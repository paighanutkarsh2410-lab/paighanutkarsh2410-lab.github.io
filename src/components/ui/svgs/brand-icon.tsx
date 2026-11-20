import { cn } from "@/lib/utils";

/**
 * Renders an official Simple Icons mark (public/icons/*.svg) as a CSS mask,
 * so it takes the brand colour — or the current text colour when the brand
 * colour would vanish in dark mode.
 */
export function brandIcon(file: string, color?: string) {
  function BrandIcon({ className }: { className?: string }) {
    const url = `url(/icons/${file}.svg)`;
    return (
      <span
        aria-hidden
        className={cn("inline-block shrink-0", className)}
        style={{
          backgroundColor: color ?? "currentColor",
          WebkitMaskImage: url,
          maskImage: url,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    );
  }
  BrandIcon.displayName = `BrandIcon(${file})`;
  return BrandIcon;
}
