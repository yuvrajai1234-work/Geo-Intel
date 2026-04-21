// Mock data service for the GeoIntel dashboard
// In production, these would connect to GDELT, OFAC/UN, World Bank, and social media APIs

export type RiskLevel = "critical" | "high" | "medium" | "low" | "minimal";

export interface CountryRisk {
  country: string;
  code: string;
  riskScore: number;
  riskLevel: RiskLevel;
  conflictScore: number;
  sanctionsScore: number;
  currencyScore: number;
  sentimentScore: number;
  trend: "up" | "down" | "stable";
  region: string;
  lastUpdated: string;
  topThreats: string[];
}

export interface ThreatEvent {
  id: string;
  title: string;
  source: string;
  sourceType: "gdelt" | "social" | "ofac" | "worldbank" | "government";
  severity: RiskLevel;
  country: string;
  category: string;
  timestamp: string;
  sentiment: number; // -1 to 1
  summary: string;
}

export interface SupplyRoute {
  id: string;
  name: string;
  from: { name: string; lat: number; lng: number };
  to: { name: string; lat: number; lng: number };
  status: "active" | "disrupted" | "blocked";
  riskLevel: RiskLevel;
  commodity: string;
  dailyVolume: string;
  lastIncident?: string;
}

export interface SentimentData {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
  volume: number;
}

export interface CurrencyRisk {
  pair: string;
  rate: number;
  change24h: number;
  volatility: number;
  riskLevel: RiskLevel;
  anomalyDetected: boolean;
  anomalyScore?: number;
}

export interface AnomalyAlert {
  id: string;
  type: "currency" | "trade" | "sentiment" | "conflict" | "sanctions";
  title: string;
  description: string;
  severity: RiskLevel;
  detectedAt: string;
  metric: string;
  expected: number;
  actual: number;
  deviation: number;
}

export interface EngineTask {
  id: string;
  name: string;
  status: "running" | "completed" | "failed" | "queued" | "retrying";
  type: "sentiment" | "risk_score" | "anomaly" | "data_ingest" | "report";
  startedAt: string;
  completedAt?: string;
  progress: number;
  worker: string;
  retries: number;
}

// Country risk data
export const countryRiskData: CountryRisk[] = [
  { country: "Ukraine", code: "UA", riskScore: 94, riskLevel: "critical", conflictScore: 98, sanctionsScore: 75, currencyScore: 88, sentimentScore: -0.82, trend: "up", region: "Eastern Europe", lastUpdated: "2 min ago", topThreats: ["Active conflict", "Infrastructure damage", "Refugee crisis"] },
  { country: "Russia", code: "RU", riskScore: 91, riskLevel: "critical", conflictScore: 85, sanctionsScore: 96, currencyScore: 78, sentimentScore: -0.75, trend: "stable", region: "Eastern Europe", lastUpdated: "1 min ago", topThreats: ["Heavy sanctions", "Military mobilization", "Economic isolation"] },
  { country: "Iran", code: "IR", riskScore: 87, riskLevel: "critical", conflictScore: 72, sanctionsScore: 94, currencyScore: 90, sentimentScore: -0.68, trend: "up", region: "Middle East", lastUpdated: "5 min ago", topThreats: ["Nuclear program", "Sanctions", "Regional proxy wars"] },
  { country: "Yemen", code: "YE", riskScore: 85, riskLevel: "critical", conflictScore: 92, sanctionsScore: 60, currencyScore: 95, sentimentScore: -0.88, trend: "up", region: "Middle East", lastUpdated: "3 min ago", topThreats: ["Civil war", "Humanitarian crisis", "Houthi attacks"] },
  { country: "Syria", code: "SY", riskScore: 83, riskLevel: "critical", conflictScore: 88, sanctionsScore: 85, currencyScore: 92, sentimentScore: -0.79, trend: "stable", region: "Middle East", lastUpdated: "8 min ago", topThreats: ["Civil war aftermath", "Sanctions", "Displacement"] },
  { country: "North Korea", code: "KP", riskScore: 82, riskLevel: "critical", conflictScore: 65, sanctionsScore: 98, currencyScore: 99, sentimentScore: -0.71, trend: "stable", region: "East Asia", lastUpdated: "15 min ago", topThreats: ["Nuclear weapons", "ICBM tests", "Total sanctions"] },
  { country: "China", code: "CN", riskScore: 68, riskLevel: "high", conflictScore: 55, sanctionsScore: 52, currencyScore: 65, sentimentScore: -0.35, trend: "up", region: "East Asia", lastUpdated: "1 min ago", topThreats: ["Taiwan tensions", "Trade war", "South China Sea"] },
  { country: "Pakistan", code: "PK", riskScore: 64, riskLevel: "high", conflictScore: 62, sanctionsScore: 35, currencyScore: 78, sentimentScore: -0.42, trend: "up", region: "South Asia", lastUpdated: "7 min ago", topThreats: ["Political instability", "Border conflicts", "Economic crisis"] },
  { country: "Nigeria", code: "NG", riskScore: 61, riskLevel: "high", conflictScore: 68, sanctionsScore: 28, currencyScore: 72, sentimentScore: -0.38, trend: "stable", region: "West Africa", lastUpdated: "12 min ago", topThreats: ["Boko Haram", "Oil disruption", "Currency devaluation"] },
  { country: "Taiwan", code: "TW", riskScore: 58, riskLevel: "high", conflictScore: 48, sanctionsScore: 15, currencyScore: 42, sentimentScore: -0.28, trend: "up", region: "East Asia", lastUpdated: "4 min ago", topThreats: ["China invasion risk", "Military buildup", "Semiconductor dependency"] },
  { country: "Israel", code: "IL", riskScore: 72, riskLevel: "high", conflictScore: 82, sanctionsScore: 20, currencyScore: 45, sentimentScore: -0.55, trend: "up", region: "Middle East", lastUpdated: "2 min ago", topThreats: ["Gaza conflict", "Regional tensions", "Hezbollah"] },
  { country: "Turkey", code: "TR", riskScore: 52, riskLevel: "medium", conflictScore: 45, sanctionsScore: 30, currencyScore: 68, sentimentScore: -0.25, trend: "stable", region: "Middle East", lastUpdated: "10 min ago", topThreats: ["Currency volatility", "Regional involvement", "Political tensions"] },
  { country: "India", code: "IN", riskScore: 38, riskLevel: "low", conflictScore: 35, sanctionsScore: 10, currencyScore: 40, sentimentScore: 0.15, trend: "stable", region: "South Asia", lastUpdated: "3 min ago", topThreats: ["Border disputes", "Religious tensions", "Water security"] },
  { country: "Brazil", code: "BR", riskScore: 35, riskLevel: "low", conflictScore: 22, sanctionsScore: 8, currencyScore: 55, sentimentScore: 0.08, trend: "down", region: "South America", lastUpdated: "9 min ago", topThreats: ["Political polarization", "Deforestation", "Currency pressure"] },
  { country: "Germany", code: "DE", riskScore: 22, riskLevel: "minimal", conflictScore: 10, sanctionsScore: 5, currencyScore: 25, sentimentScore: 0.32, trend: "stable", region: "Western Europe", lastUpdated: "6 min ago", topThreats: ["Energy dependency", "Immigration", "Industrial slowdown"] },
  { country: "USA", code: "US", riskScore: 30, riskLevel: "low", conflictScore: 28, sanctionsScore: 8, currencyScore: 35, sentimentScore: 0.05, trend: "stable", region: "North America", lastUpdated: "1 min ago", topThreats: ["Political division", "Debt ceiling", "Tech regulation"] },
];

// Threat events feed
export const threatEvents: ThreatEvent[] = [
  { id: "evt-001", title: "Escalation in Eastern Ukraine frontline — heavy artillery exchanges reported", source: "GDELT Monitor", sourceType: "gdelt", severity: "critical", country: "Ukraine", category: "Conflict", timestamp: "2 min ago", sentiment: -0.92, summary: "Multiple reports of intensified shelling along the Donetsk-Luhansk axis. Civilian evacuations underway." },
  { id: "evt-002", title: "EU announces 14th sanctions package targeting Russian energy sector", source: "Reuters / OFAC Tracker", sourceType: "ofac", severity: "high", country: "Russia", category: "Sanctions", timestamp: "18 min ago", sentiment: -0.65, summary: "New sanctions include restrictions on LNG exports and additional banking restrictions." },
  { id: "evt-003", title: "Houthi forces claim drone strike on commercial vessel in Red Sea", source: "Social Media Intel", sourceType: "social", severity: "critical", country: "Yemen", category: "Maritime", timestamp: "32 min ago", sentiment: -0.88, summary: "Vessel reportedly hit 60nm off Hodeidah. No casualties confirmed. Shipping rerouting underway." },
  { id: "evt-004", title: "Iranian Rial drops 8% amid nuclear deal collapse fears", source: "Financial Times", sourceType: "worldbank", severity: "high", country: "Iran", category: "Currency", timestamp: "1 hr ago", sentiment: -0.72, summary: "Currency markets react to failed diplomatic talks. Central bank intervention expected." },
  { id: "evt-005", title: "China conducts military exercises near Taiwan Strait", source: "GDELT / DoD Reports", sourceType: "gdelt", severity: "high", country: "China", category: "Military", timestamp: "2 hrs ago", sentiment: -0.58, summary: "PLA Navy and Air Force exercises detected. Taiwan raises alert level to secondary." },
  { id: "evt-006", title: "North Korea tests intermediate-range ballistic missile", source: "Government Intel", sourceType: "government", severity: "critical", country: "North Korea", category: "WMD", timestamp: "4 hrs ago", sentiment: -0.95, summary: "Hwasong-class IRBM launched from Pyongyang suburbs. Flew 650km before splashing down in Sea of Japan." },
  { id: "evt-007", title: "Nigerian Naira faces renewed pressure after oil output decline", source: "World Bank Data", sourceType: "worldbank", severity: "medium", country: "Nigeria", category: "Economic", timestamp: "5 hrs ago", sentiment: -0.41, summary: "Oil production fell below 1.2M bpd threshold. Parallel market rate diverges 15% from official." },
  { id: "evt-008", title: "Pakistan-Afghanistan border clashes leave 12 soldiers dead", source: "GDELT Monitor", sourceType: "gdelt", severity: "high", country: "Pakistan", category: "Conflict", timestamp: "6 hrs ago", sentiment: -0.77, summary: "Torkham border crossing closed indefinitely. Cross-border shelling reported in Khyber district." },
  { id: "evt-009", title: "Gaza ceasefire negotiations collapse — IDF announces ground operation expansion", source: "Social Media / Reuters", sourceType: "social", severity: "critical", country: "Israel", category: "Conflict", timestamp: "45 min ago", sentiment: -0.91, summary: "UN envoy condemns failure. Humanitarian corridor demands unmet. Regional escalation risk elevated." },
  { id: "evt-010", title: "Turkey-Syria border tensions flare amid Kurdish militia movement", source: "Government Intel", sourceType: "government", severity: "medium", country: "Turkey", category: "Conflict", timestamp: "8 hrs ago", sentiment: -0.48, summary: "Turkish military reinforcements deployed to southeastern border. NATO monitoring situation." },
];

// Supply chain routes
export const supplyRoutes: SupplyRoute[] = [
  { id: "sr-001", name: "Suez Canal — Mediterranean Route", from: { name: "Shanghai", lat: 31.23, lng: 121.47 }, to: { name: "Rotterdam", lat: 51.92, lng: 4.48 }, status: "disrupted", riskLevel: "high", commodity: "Electronics, Consumer Goods", dailyVolume: "$2.4B", lastIncident: "Houthi drone attack near Bab el-Mandeb" },
  { id: "sr-002", name: "Russia-Europe Gas Pipeline", from: { name: "Yamal, Russia", lat: 67.6, lng: 72.5 }, to: { name: "Berlin, Germany", lat: 52.52, lng: 13.41 }, status: "blocked", riskLevel: "critical", commodity: "Natural Gas", dailyVolume: "$180M", lastIncident: "Sanctions and infrastructure damage" },
  { id: "sr-003", name: "Persian Gulf Oil Route", from: { name: "Bandar Abbas", lat: 27.18, lng: 56.28 }, to: { name: "Mumbai", lat: 19.08, lng: 72.88 }, status: "active", riskLevel: "medium", commodity: "Crude Oil", dailyVolume: "$890M", lastIncident: "Strait of Hormuz surveillance increase" },
  { id: "sr-004", name: "Taiwan Strait Shipping Lane", from: { name: "Kaohsiung", lat: 22.62, lng: 120.31 }, to: { name: "Los Angeles", lat: 33.75, lng: -118.19 }, status: "active", riskLevel: "high", commodity: "Semiconductors", dailyVolume: "$1.8B", lastIncident: "PLA naval exercises in adjacent waters" },
  { id: "sr-005", name: "Cape of Good Hope Detour", from: { name: "Singapore", lat: 1.35, lng: 103.82 }, to: { name: "London", lat: 51.51, lng: -0.13 }, status: "active", riskLevel: "medium", commodity: "Mixed Cargo", dailyVolume: "$1.2B", lastIncident: "Congestion due to Red Sea rerouting" },
  { id: "sr-006", name: "Black Sea Grain Corridor", from: { name: "Odessa", lat: 46.48, lng: 30.73 }, to: { name: "Istanbul", lat: 41.01, lng: 28.98 }, status: "disrupted", riskLevel: "critical", commodity: "Grain, Agriculture", dailyVolume: "$95M", lastIncident: "Russian naval blockade threat" },
];

// Sentiment time series
export const sentimentTimeSeries: SentimentData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const baseNeg = 35 + Math.random() * 15;
  const spike = i > 22 ? 10 : 0;
  return {
    date: date.toISOString().split("T")[0],
    negative: Math.round(baseNeg + spike + Math.random() * 5),
    positive: Math.round(20 + Math.random() * 10),
    neutral: Math.round(30 + Math.random() * 10),
    volume: Math.round(80000 + Math.random() * 40000 + (i > 22 ? 20000 : 0)),
  };
});

// Currency risks
export const currencyRisks: CurrencyRisk[] = [
  { pair: "USD/RUB", rate: 92.45, change24h: 2.3, volatility: 8.7, riskLevel: "high", anomalyDetected: true, anomalyScore: 3.2 },
  { pair: "USD/IRR", rate: 562000, change24h: 8.1, volatility: 14.2, riskLevel: "critical", anomalyDetected: true, anomalyScore: 4.8 },
  { pair: "USD/TRY", rate: 38.92, change24h: 1.8, volatility: 6.5, riskLevel: "high", anomalyDetected: false },
  { pair: "USD/NGN", rate: 1620, change24h: 3.5, volatility: 9.1, riskLevel: "high", anomalyDetected: true, anomalyScore: 2.9 },
  { pair: "USD/PKR", rate: 312.5, change24h: 2.1, volatility: 5.8, riskLevel: "medium", anomalyDetected: false },
  { pair: "EUR/USD", rate: 1.082, change24h: -0.3, volatility: 1.2, riskLevel: "low", anomalyDetected: false },
  { pair: "USD/CNY", rate: 7.28, change24h: 0.4, volatility: 2.1, riskLevel: "medium", anomalyDetected: false },
  { pair: "USD/UAH", rate: 41.2, change24h: 1.2, volatility: 7.8, riskLevel: "high", anomalyDetected: true, anomalyScore: 2.5 },
];

// Anomaly alerts
export const anomalyAlerts: AnomalyAlert[] = [
  { id: "an-001", type: "currency", title: "Iranian Rial extreme volatility spike", description: "IRR/USD spread exceeds 4.8σ from 30-day moving average. Largest single-day move since 2022.", severity: "critical", detectedAt: "1 hr ago", metric: "USD/IRR Volatility", expected: 3.2, actual: 14.2, deviation: 4.8 },
  { id: "an-002", type: "sentiment", title: "Negative sentiment surge — Ukraine conflict", description: "Social media negative sentiment volume exceeds 3σ threshold. 340% increase in conflict-related mentions.", severity: "critical", detectedAt: "25 min ago", metric: "Sentiment Volume", expected: 85000, actual: 142000, deviation: 3.2 },
  { id: "an-003", type: "trade", title: "Red Sea shipping volume anomaly", description: "Container throughput at Suez dropped 42% vs 7-day average. Consistent with mass rerouting via Cape.", severity: "high", detectedAt: "3 hrs ago", metric: "Suez Throughput", expected: 52, actual: 30, deviation: 2.9 },
  { id: "an-004", type: "conflict", title: "GDELT conflict event frequency spike — Middle East", description: "Event count for Goldstein scale <-7 events increased 280% in 48hr window.", severity: "high", detectedAt: "6 hrs ago", metric: "GDELT Event Frequency", expected: 120, actual: 456, deviation: 3.5 },
  { id: "an-005", type: "currency", title: "Russian Ruble correlation break with oil prices", description: "RUB-Brent correlation coefficient dropped from 0.82 to 0.23 — potential capital controls or intervention.", severity: "high", detectedAt: "12 hrs ago", metric: "RUB-Brent Correlation", expected: 0.82, actual: 0.23, deviation: 3.2 },
  { id: "an-006", type: "sanctions", title: "Unusual vessel tracking patterns — Iranian fleet", description: "AIS signal loss for 14 Iranian-flagged tankers. Pattern consistent with sanctions evasion.", severity: "critical", detectedAt: "8 hrs ago", metric: "AIS Signal Count", expected: 34, actual: 20, deviation: 2.8 },
];

// Engine tasks (Celery+Redis simulator)
export const engineTasks: EngineTask[] = [
  { id: "task-001", name: "GDELT Event Ingest — Global", status: "running", type: "data_ingest", startedAt: "2 min ago", progress: 67, worker: "worker-alpha-01", retries: 0 },
  { id: "task-002", name: "Sentiment Analysis — Middle East Batch", status: "running", type: "sentiment", startedAt: "5 min ago", progress: 42, worker: "worker-beta-03", retries: 0 },
  { id: "task-003", name: "Risk Score Recalculation — All Countries", status: "running", type: "risk_score", startedAt: "8 min ago", progress: 85, worker: "worker-alpha-02", retries: 1 },
  { id: "task-004", name: "Currency Anomaly Detection — Hourly", status: "completed", type: "anomaly", startedAt: "15 min ago", completedAt: "12 min ago", progress: 100, worker: "worker-gamma-01", retries: 0 },
  { id: "task-005", name: "OFAC Sanctions List Sync", status: "completed", type: "data_ingest", startedAt: "1 hr ago", completedAt: "45 min ago", progress: 100, worker: "worker-alpha-01", retries: 0 },
  { id: "task-006", name: "Social Media Crawler — X/Twitter", status: "running", type: "data_ingest", startedAt: "3 min ago", progress: 23, worker: "worker-delta-02", retries: 0 },
  { id: "task-007", name: "Supply Chain Risk Report — Weekly", status: "queued", type: "report", startedAt: "—", progress: 0, worker: "—", retries: 0 },
  { id: "task-008", name: "World Bank Data Refresh — GDP/Inflation", status: "completed", type: "data_ingest", startedAt: "2 hrs ago", completedAt: "1.5 hrs ago", progress: 100, worker: "worker-alpha-03", retries: 2 },
  { id: "task-009", name: "Trade Flow Anomaly Detection — Asia", status: "failed", type: "anomaly", startedAt: "30 min ago", progress: 55, worker: "worker-gamma-02", retries: 3 },
  { id: "task-010", name: "Government Report Parser — US DoD", status: "retrying", type: "data_ingest", startedAt: "20 min ago", progress: 12, worker: "worker-beta-01", retries: 2 },
];

// Utility functions
export function getRiskColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    critical: "#e74c3c",
    high: "#f39c12",
    medium: "#e8a838",
    low: "#2ecc71",
    minimal: "#3498db",
  };
  return colors[level];
}

export function getRiskBgClass(level: RiskLevel): string {
  return `risk-bg-${level}`;
}

export function getRiskTextClass(level: RiskLevel): string {
  return `risk-${level}`;
}

export function getSourceIcon(type: ThreatEvent["sourceType"]): string {
  const icons: Record<string, string> = {
    gdelt: "📡",
    social: "📱",
    ofac: "⚖️",
    worldbank: "🏦",
    government: "🏛️",
  };
  return icons[type] || "📄";
}

export function getTaskStatusColor(status: EngineTask["status"]): string {
  const colors: Record<string, string> = {
    running: "#3498db",
    completed: "#2ecc71",
    failed: "#e74c3c",
    queued: "#8a94a6",
    retrying: "#f39c12",
  };
  return colors[status] || "#8a94a6";
}
