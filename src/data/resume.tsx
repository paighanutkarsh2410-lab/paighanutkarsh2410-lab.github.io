import { Icons } from "@/components/icons";
import { HomeIcon, FolderGit2Icon, BriefcaseIcon, WorkflowIcon } from "lucide-react";
import { Python } from "@/components/ui/svgs/python";
import { Docker } from "@/components/ui/svgs/docker";
import { Kubernetes } from "@/components/ui/svgs/kubernetes";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Java } from "@/components/ui/svgs/java";
import { brandIcon } from "@/components/ui/svgs/brand-icon";

const GH = "https://github.com/paighanutkarsh2410-lab";

export const DATA = {
  name: "Utkarsh Paighan",
  initials: "UP",
  url: "https://paighanutkarsh2410-lab.github.io",
  location: "Nagpur, India",
  locationLink: "https://www.google.com/maps/place/Nagpur",
  description:
    "Site Reliability & DevOps Engineer. I build platforms that ship safely and stay up.",
  summary:
    "I'm a B.Tech Computer Science graduate (2026) who builds and runs production-style platforms end to end. I define **SLOs with burn-rate alerting** and runbooks, instrument services with Prometheus, Grafana and OpenTelemetry, and prove resilience with **chaos GameDays** and load tests. I deliver through **GitOps on Kubernetes** (Argo CD, Helm, canary releases) with CI/CD pipelines that scan and sign every image, and Infrastructure as Code on AWS and Azure. ",
  avatarUrl: "",
  resumeUrl: "/Utkarsh-Paighan-Resume.pdf",
  skills: [
    { name: "Kubernetes", icon: Kubernetes },
    { name: "Docker", icon: Docker },
    { name: "Argo CD", icon: brandIcon("argo", "#EF7B4D") },
    { name: "Helm", icon: brandIcon("helm") },
    { name: "Terraform", icon: brandIcon("terraform", "#844FBA") },
    { name: "Ansible", icon: brandIcon("ansible", "#EE0000") },
    { name: "AWS", icon: brandIcon("aws", "#FF9900") },
    { name: "Azure", icon: brandIcon("microsoftazure", "#0078D4") },
    { name: "GitHub Actions", icon: brandIcon("githubactions", "#2088FF") },
    { name: "Prometheus", icon: brandIcon("prometheus", "#E6522C") },
    { name: "Grafana", icon: brandIcon("grafana", "#F46800") },
    { name: "OpenTelemetry", icon: brandIcon("opentelemetry") },
    { name: "Kafka", icon: brandIcon("apachekafka") },
    { name: "Python", icon: Python },
    { name: "FastAPI", icon: brandIcon("fastapi", "#009688") },
    { name: "PostgreSQL", icon: Postgresql },
    { name: "Linux", icon: brandIcon("linux") },
    { name: "RHEL", icon: brandIcon("redhat", "#EE0000") },
    { name: "Java", icon: Java },
  ],
  navbar: [
    { href: "#", icon: HomeIcon, label: "Home", hideOnMobile: false },
    { href: "#projects", icon: FolderGit2Icon, label: "Projects", hideOnMobile: false },
    { href: "#pipeline", icon: WorkflowIcon, label: "Pipeline", hideOnMobile: true },
    { href: "#experience", icon: BriefcaseIcon, label: "Experience", hideOnMobile: true },
  ],
  contact: {
    email: "paighanutkarsh01@gmail.com",
    tel: "+91 72765 47075",
    social: {
      GitHub: {
        name: "GitHub",
        url: GH,
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/utkarsh-paighan-0620b9426",
        icon: Icons.linkedin,
        navbar: true,
      },
      email: {
        name: "Email",
        url: "mailto:paighanutkarsh01@gmail.com",
        icon: Icons.email,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "Qspiders",
      href: "https://qspiders.com",
      badges: [],
      location: "Pune, India",
      title: "Java Full Stack Development Trainee",
      logoUrl: "",
      start: "Dec 2025",
      end: "Mar 2026",
      description:
        "Trained in Core Java (OOP, exception handling) and SQL: queries, joins and relational database design.",
    },
    {
      company: "HOTIT Institute Pvt. Ltd.",
      href: "",
      badges: [],
      location: "Nagpur, India",
      title: "Data Analyst Intern",
      logoUrl: "",
      start: "Jun 2025",
      end: "Jun 2025",
      description:
        "Built Power BI dashboards on real-time data for performance monitoring, giving stakeholders visibility into key metrics.",
    },
    {
      company: "LGPS Technologies Pvt. Ltd.",
      href: "",
      badges: [],
      location: "Nagpur, India",
      title: "Project Manager Intern",
      logoUrl: "",
      start: "Jun 2024",
      end: "Jun 2024",
      description:
        "Led a team of developers in Agile sprints, coordinating timelines and tasks across teams to deliver milestones on time.",
    },
  ],
  education: [
    {
      school: "S.B. Jain Institute of Technology, Management and Research",
      href: "https://sbjit.edu.in",
      degree: "B.Tech, Computer Science and Engineering · CGPA 8.81 / 10",
      logoUrl: "",
      start: "2022",
      end: "2026",
    },
    {
      school: "AlgoZenith Club",
      href: "",
      degree: "Co-Lead · Winner, Data Visualization Course (first place)",
      logoUrl: "",
      start: "2024",
      end: "2024",
    },
    {
      school: "Nirala Junior College, Nagpur",
      href: "",
      degree: "Higher Secondary · 85.00%",
      logoUrl: "",
      start: "2020",
      end: "2022",
    },
  ],
  projects: [
    {
      title: "Pitwall",
      href: "https://paighanutkarsh2410-lab.github.io/pitwall/",
      dates: "Real-time F1 telemetry platform on Kubernetes",
      active: true,
      description:
        "Streams real Formula 1 telemetry through Kafka into 7 FastAPI microservices, TimescaleDB and a live React dashboard; 90 races replayable. Every release is an Argo Rollouts canary with automated rollback. **5 SLOs** with burn-rate alerts; Chaos Mesh GameDays and k6 load tests served **1,182 / 1,182 viewers at 205 ms p99**.",
      technologies: ["Kafka", "Kubernetes", "Argo CD", "Argo Rollouts", "KEDA", "Prometheus", "Grafana", "OpenTelemetry", "Chaos Mesh", "k6"],
      links: [
        { type: "Live", href: "https://paighanutkarsh2410-lab.github.io/pitwall/", icon: <Icons.globe className="size-3" /> },
        { type: "Source", href: `${GH}/pitwall`, icon: <Icons.github className="size-3" /> },
      ],
      image: "/projects/pitwall.jpg",
      video: "",
    },
    {
      title: "Launchbay",
      href: "https://launchbay-593.pages.dev/",
      dates: "Self-service internal developer platform",
      active: true,
      description:
        "A golden-path portal that takes a service from **template to live in minutes**: creates the repo via a GitHub App, provisions S3, SQS and DynamoDB with Terraform, runs a Trivy-scanned, cosign-signed pipeline and deploys with Argo CD. Kyverno admits only images signed by the service's own CI.",
      technologies: ["FastAPI", "React", "Terraform", "Argo CD", "Kyverno", "Trivy", "cosign", "AWS"],
      links: [
        { type: "Live", href: "https://launchbay-593.pages.dev/", icon: <Icons.globe className="size-3" /> },
        { type: "Source", href: `${GH}/launchbay`, icon: <Icons.github className="size-3" /> },
      ],
      image: "/projects/launchbay.jpg",
      video: "",
    },
    {
      title: "SentryAI",
      href: "https://devops-ai-assistant.vercel.app/",
      dates: "AI-powered incident management",
      active: true,
      description:
        "**8 cooperating AI agents** detect metric anomalies (z-score, adaptive thresholds), diagnose root causes with Claude, and run remediation with checkpoints, rollback and approvals. Qdrant vector search recalls similar past incidents.",
      technologies: ["FastAPI", "Next.js", "PostgreSQL", "Redis", "Claude API", "Qdrant"],
      links: [
        { type: "Live", href: "https://devops-ai-assistant.vercel.app/", icon: <Icons.globe className="size-3" /> },
        { type: "Source", href: `${GH}/sentryai`, icon: <Icons.github className="size-3" /> },
      ],
      image: "/projects/sentryai.jpg",
      video: "",
    },
    {
      title: "Dishpatch",
      href: `${GH}/dishpatch-infra`,
      dates: "DevSecOps pipeline and GitOps on AWS",
      active: true,
      description:
        "CI security gates (Trivy, CodeQL, OWASP ZAP and CycloneDX SBOMs) publish keyless cosign-signed images to GHCR and open a digest-pinned deploy PR; **infra CI rejects any unsigned image**. AWS provisioned with Terraform, K3s via Ansible, delivered with Helm and Argo CD.",
      technologies: ["Terraform", "Ansible", "K3s", "Helm", "Argo CD", "GitHub Actions", "AWS"],
      links: [
        { type: "Infra", href: `${GH}/dishpatch-infra`, icon: <Icons.github className="size-3" /> },
        { type: "App", href: `${GH}/dishpatch-app`, icon: <Icons.github className="size-3" /> },
      ],
      image: "/projects/dishpatch.jpg",
      video: "",
    },
  ],
} as const;
