/**
 * How each project is built, top to bottom, for the drill-in view: the path a request, a commit
 * or an incident takes through it. Taken from each project's own README and docs.
 */
export type Layer = { name: string; detail: string };
export type Flow = { caption: string; layers: Layer[] };

export const FLOWS: Record<string, Flow> = {
  Pitwall: {
    caption: "A car's telemetry, from the track to your screen",
    layers: [
      { name: "Browser", detail: "The React pit wall, live over WebSockets" },
      { name: "API", detail: "FastAPI: timing boards, telemetry and the race trace" },
      { name: "Services", detail: "ingest · timing · strategy · projector · replayer · uplink" },
      { name: "Stream", detail: "Kafka (Redpanda): every car event, partitioned by car" },
      { name: "History", detail: "TimescaleDB, written off the live path" },
      { name: "Platform", detail: "Kubernetes · Argo CD · Argo Rollouts · KEDA · Prometheus · Chaos Mesh" },
    ],
  },
  Launchbay: {
    caption: "One launch, template to live service",
    layers: [
      { name: "Validate", detail: "DNS-safe name, unused, template exists, owner set" },
      { name: "Repository", detail: "A GitHub App creates the repo from the template" },
      { name: "Cloud", detail: "Terraform: S3, SQS and DynamoDB, each with its own KMS key" },
      { name: "Build & sign", detail: "Tests, a Trivy scan, a push to GHCR, a cosign signature" },
      { name: "GitOps", detail: "A manifest committed to launchbay-gitops" },
      { name: "Deploy", detail: "An Argo CD ApplicationSet, past Kyverno's guardrails" },
      { name: "Live", detail: "The health check passes and the service gets its URL" },
    ],
  },
  Dishpatch: {
    caption: "A merge, from commit to the cluster on AWS",
    layers: [
      { name: "App CI", detail: "Tests, Trivy, CodeQL and an OWASP ZAP scan of the running app" },
      { name: "Supply chain", detail: "CycloneDX SBOMs, keyless cosign signatures, images on GHCR" },
      { name: "Deploy PR", detail: "A pull request pinning each image by digest" },
      { name: "Infra CI", detail: "Signatures verified, chart linted and validated, Trivy config scan" },
      { name: "GitOps", detail: "Argo CD syncs main and reverts drift" },
      { name: "AWS", detail: "K3s on EC2: Terraform builds it, Ansible hardens it" },
    ],
  },
  SentryAI: {
    caption: "An incident, from first anomaly to the fix",
    layers: [
      { name: "Monitor", detail: "z-scores, moving averages and adaptive thresholds" },
      { name: "Diagnose", detail: "Root cause with Claude, with confidence and evidence" },
      { name: "Logs", detail: "The log analysis agent reads what happened" },
      { name: "Remediate", detail: "Checkpoints, rollback and approvals before acting" },
      { name: "Learn", detail: "Qdrant vector search recalls similar past incidents" },
      { name: "Predict", detail: "Time-series forecasts, before it breaks again" },
      { name: "Capacity", detail: "Capacity planning and proactive alerts" },
      { name: "Communicate", detail: "Slack, email and in-browser alerts" },
    ],
  },
};
