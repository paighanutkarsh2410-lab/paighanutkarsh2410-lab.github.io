"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { Color, MeshPhongMaterial } from "three";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import countries110 from "world-atlas/countries-110m.json";

/* ------------------------------------------------------------------ *
 * A live-looking view of global traffic into the cluster.
 * Requests arc in from cities to the active region; clicking the globe
 * sends a ping from that spot; "fail region" reroutes everything to a
 * secondary region and heals a few seconds later. Simulated, labelled.
 * ------------------------------------------------------------------ */

type Region = { id: string; name: string; lat: number; lng: number };
const PRIMARY: Region = { id: "ap-south-1", name: "Mumbai", lat: 19.076, lng: 72.8777 };
const SECONDARY: Region = { id: "ap-southeast-1", name: "Singapore", lat: 1.3521, lng: 103.8198 };
const NAGPUR = { lat: 21.1458, lng: 79.0882 };

const CITIES: [string, number, number][] = [
  ["New York", 40.71, -74.0], ["San Francisco", 37.77, -122.42], ["Toronto", 43.65, -79.38],
  ["São Paulo", -23.55, -46.63], ["London", 51.51, -0.13], ["Frankfurt", 50.11, 8.68],
  ["Lagos", 6.52, 3.38], ["Nairobi", -1.29, 36.82], ["Dubai", 25.2, 55.27],
  ["Bengaluru", 12.97, 77.59], ["Delhi", 28.61, 77.21], ["Tokyo", 35.68, 139.69],
  ["Seoul", 37.57, 126.98], ["Sydney", -33.87, 151.21], ["Jakarta", -6.2, 106.85],
];

type Arc = { id: number; startLat: number; startLng: number; endLat: number; endLng: number; colors: [string, string]; stroke: number };
type Ring = { id: number; lat: number; lng: number; color: string; max: number; speed: number; period: number };
type Label = { id: number; lat: number; lng: number; text: string; color: string };

// great-circle distance → a round-trip estimate (light in fibre ~200 km/ms, plus hops)
function rttMs(aLat: number, aLng: number, bLat: number, bLng: number) {
  const r = Math.PI / 180, R = 6371;
  const dLat = (bLat - aLat) * r, dLng = (bLng - aLng) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * r) * Math.cos(bLat * r) * Math.sin(dLng / 2) ** 2;
  const km = 2 * R * Math.asin(Math.sqrt(h));
  return Math.round((km * 1.4) / 200 * 2 + 18);
}

let uid = 0;

export default function TrafficGlobe({ dark }: { dark: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const globe = useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = useState(520);
  const [arcs, setArcs] = useState<Arc[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [failed, setFailed] = useState(false);
  const [rps, setRps] = useState(1182);
  const [visible, setVisible] = useState(true);
  const reduce = useMemo(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  const target = failed ? SECONDARY : PRIMARY;

  const land = useMemo(() => {
    const topo = countries110 as unknown as Topology<{ countries: GeometryCollection }>;
    // id 408's 110m outline makes h3's polygon fill throw, which aborts the whole hex layer
    return (feature(topo, topo.objects.countries) as unknown as { features: { id?: string }[] }).features.filter((f) => f.id !== "408");
  }, []);

  const material = useMemo(
    () => new MeshPhongMaterial({ color: new Color(dark ? "#0d0a09" : "#f4efe9"), emissive: new Color(dark ? "#1a0c05" : "#ffffff"), emissiveIntensity: dark ? 0.35 : 0.1, shininess: 6 }),
    [dark]
  );

  // size to the container
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // pause everything while off screen
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const g = globe.current;
    if (!g) return;
    if (visible) g.resumeAnimation(); else g.pauseAnimation();
  }, [visible]);

  const onReady = useCallback(() => {
    const g = globe.current;
    if (!g) return;
    g.pointOfView({ lat: 18, lng: 70, altitude: 2.15 }, 0);
    const c = g.controls();
    c.enableZoom = false;
    c.autoRotate = !reduce;
    c.autoRotateSpeed = 0.55;
    c.enableDamping = true;
  }, [reduce]);

  // a steady stream of requests into the active region
  useEffect(() => {
    if (!visible || reduce) return;
    const t = setInterval(() => {
      const [, lat, lng] = CITIES[Math.floor(Math.random() * CITIES.length)];
      const arc: Arc = {
        id: ++uid, startLat: lat, startLng: lng, endLat: target.lat, endLng: target.lng,
        colors: failed ? ["rgba(251,191,36,0.15)", "#fbbf24"] : ["rgba(249,115,22,0.12)", "#ff7a2f"],
        stroke: 0.45,
      };
      setArcs((a) => [...a.slice(-34), arc]);
      setRps((r) => Math.max(900, Math.min(1500, r + Math.round((Math.random() - 0.5) * 60))));
    }, 280);
    return () => clearInterval(t);
  }, [visible, reduce, failed, target.lat, target.lng]);

  // when the region flips, re-aim every in-flight arc (the visible reroute)
  useEffect(() => {
    setArcs((a) => a.map((x) => ({ ...x, id: ++uid, endLat: target.lat, endLng: target.lng, colors: failed ? ["rgba(251,191,36,0.15)", "#fbbf24"] : x.colors })));
  }, [failed, target.lat, target.lng]);

  const rings: Ring[] = useMemo(() => {
    const r: Ring[] = [
      { id: 1, lat: target.lat, lng: target.lng, color: failed ? "#fbbf24" : "#ff7a2f", max: 5, speed: 2.4, period: 900 },
      { id: 2, lat: NAGPUR.lat, lng: NAGPUR.lng, color: "#ffd2a8", max: 2.2, speed: 1.2, period: 1600 },
    ];
    if (failed) r.push({ id: 3, lat: PRIMARY.lat, lng: PRIMARY.lng, color: "#ff3b3b", max: 6, speed: 4, period: 500 });
    return r;
  }, [failed, target.lat, target.lng]);

  const points = useMemo(
    () => [
      { lat: PRIMARY.lat, lng: PRIMARY.lng, color: failed ? "#ff3b3b" : "#ff7a2f", r: 0.55 },
      { lat: SECONDARY.lat, lng: SECONDARY.lng, color: failed ? "#fbbf24" : "#a3a3a3", r: 0.4 },
      { lat: NAGPUR.lat, lng: NAGPUR.lng, color: "#ffe2c4", r: 0.32 },
      ...CITIES.map(([, lat, lng]) => ({ lat, lng, color: dark ? "rgba(255,210,170,.75)" : "rgba(124,45,18,.7)", r: 0.18 })),
    ],
    [failed, dark]
  );

  const ping = useCallback(
    ({ lat, lng }: { lat: number; lng: number }) => {
      const ms = rttMs(lat, lng, target.lat, target.lng);
      const id = ++uid;
      setArcs((a) => [...a.slice(-22), { id, startLat: lat, startLng: lng, endLat: target.lat, endLng: target.lng, colors: ["#ffffff", "#ff7a2f"], stroke: 0.9 }]);
      setLabels((l) => [...l.slice(-3), { id, lat, lng, text: `${ms} ms`, color: "#ffffff" }]);
      setTimeout(() => setLabels((l) => l.filter((x) => x.id !== id)), 3600);
    },
    [target.lat, target.lng]
  );

  const failRegion = () => {
    if (failed) return;
    setFailed(true);
    const g = globe.current;
    // swing the camera so both regions and the reroute are in frame
    if (g) { g.controls().autoRotate = false; g.pointOfView({ lat: 12, lng: 88, altitude: 1.75 }, 1200); }
    setTimeout(() => {
      setFailed(false);
      if (g) { g.pointOfView({ lat: 18, lng: 70, altitude: 2.15 }, 1400); g.controls().autoRotate = !reduce; }
    }, 6500);
  };

  const hexColor = useCallback(() => (dark ? "rgba(255,170,110,0.55)" : "rgba(120,53,15,0.55)"), [dark]);

  return (
    <div ref={wrap} className="relative aspect-square w-full">
      <Globe
        ref={globe}
        width={size}
        height={size}
        backgroundColor="rgba(0,0,0,0)"
        globeMaterial={material}
        showAtmosphere
        atmosphereColor={dark ? "#ff6a1a" : "#fb923c"}
        atmosphereAltitude={0.2}
        onGlobeReady={onReady}
        hexPolygonsData={land}
        hexPolygonResolution={3}
        hexPolygonMargin={0.55}
        hexPolygonUseDots
        hexPolygonColor={hexColor}
        arcsData={arcs}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="colors"
        arcStroke="stroke"
        arcDashLength={0.38}
        arcDashGap={2}
        arcDashInitialGap={() => Math.random()}
        arcDashAnimateTime={1500}
        arcAltitudeAutoScale={0.42}
        arcsTransitionDuration={600}
        ringsData={rings}
        ringLat="lat"
        ringLng="lng"
        ringColor={(r: object) => {
          const c = (r as Ring).color;
          return (t: number) => `${c}${Math.round((1 - t) * 255).toString(16).padStart(2, "0")}`;
        }}
        ringMaxRadius="max"
        ringPropagationSpeed="speed"
        ringRepeatPeriod="period"
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointRadius="r"
        pointAltitude={0.012}
        labelsData={labels}
        labelLat="lat"
        labelLng="lng"
        labelText="text"
        labelColor="color"
        labelSize={1.6}
        labelDotRadius={0.5}
        labelAltitude={0.02}
        labelResolution={2}
        onGlobeClick={ping}
        onPointClick={(p: object) => ping(p as { lat: number; lng: number })}
      />

      {/* HUD */}
      <div className="pointer-events-none absolute left-2 top-2 font-mono text-[11px] leading-relaxed text-muted-foreground sm:left-4 sm:top-4">
        <div className="flex items-center gap-2">
          <span className={`inline-block size-1.5 rounded-full ${failed ? "bg-amber-400" : "bg-emerald-400"}`} />
          <span className="text-foreground">{failed ? "failover active" : "all regions healthy"}</span>
        </div>
        <div>
          serving from <span className="text-orange-400">{target.id}</span> · {target.name}
        </div>
        <div>
          <span className="tabular-nums text-foreground">{rps.toLocaleString("en-US")}</span> req/s · p99{" "}
          <span className="tabular-nums text-foreground">{failed ? 268 : 205} ms</span>
        </div>
      </div>
      {failed && (
        <div className="pointer-events-none absolute inset-x-2 top-[4.5rem] rounded-lg sm:inset-x-auto sm:right-4 sm:top-4 sm:max-w-[13rem] border border-red-500/50 bg-red-500/10 px-3 py-2 font-mono text-[11px] text-red-300 backdrop-blur">
          ap-south-1 down. Traffic rerouted to ap-southeast-1. Healing…
        </div>
      )}
      <div className="absolute inset-x-0 bottom-2 flex flex-wrap items-center justify-center gap-2 sm:bottom-4">
        <button
          type="button"
          onClick={failRegion}
          disabled={failed}
          className="rounded-full border border-red-500/50 bg-background/70 px-3.5 py-1.5 font-mono text-[11px] text-foreground backdrop-blur transition-colors hover:bg-red-500/15 disabled:opacity-50"
        >
          {failed ? "recovering…" : "fail ap-south-1"}
        </button>
        <span className="pointer-events-none rounded-full border border-border/60 bg-background/70 px-3 py-1.5 font-mono text-[11px] text-muted-foreground backdrop-blur">
          click anywhere to ping · drag to spin
        </span>
      </div>
    </div>
  );
}
