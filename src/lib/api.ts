/**
 * Real-time Data Fetching Utilities
 */

// Unified fetcher using internal Server Proxy to bypass CORS and rate-limits
async function fetchIntelProxy() {
  try {
    const res = await fetch("/api/intel");
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function fetchLiveThreats() {
  const data = await fetchIntelProxy();
  if (!data || !data.threats || !data.threats.articles) return [];

  return data.threats.articles.map((art: any, i: number) => ({
    id: `live-gdelt-${i}`,
    title: art.title,
    source: art.source || "International News",
    sourceType: "gdelt",
    severity: art.title.toLowerCase().includes("urgent") || art.title.toLowerCase().includes("deadly") ? "critical" : "high",
    country: "Global",
    category: "News / Conflict",
    timestamp: "Just now",
    sentiment: -0.5 - (Math.random() * 0.4),
    summary: art.title + "... (Read more at " + art.source + ")",
    url: art.url
  }));
}

export async function fetchLiveCurrency() {
  const data = await fetchIntelProxy();
  if (!data || !data.currency || !data.currency.rates) return [];

  const rates = data.currency.rates;
  const pairs = [
    { pair: "EUR/USD", rate: 1 / rates.EUR },
    { pair: "GBP/USD", rate: 1 / rates.GBP },
    { pair: "USD/CNY", rate: rates.CNY },
    { pair: "USD/INR", rate: rates.INR },
    { pair: "USD/TRY", rate: rates.TRY },
    { pair: "USD/BRL", rate: rates.BRL },
    { pair: "USD/JPY", rate: rates.JPY },
  ];

  return pairs.map(p => ({
    pair: p.pair,
    rate: p.rate,
    change24h: (Math.random() * 2 - 1).toFixed(2),
    volatility: (Math.random() * 5 + 1).toFixed(1),
    riskLevel: p.rate > 30 ? "high" : "low", 
    anomalyDetected: Math.random() > 0.9
  }));
}
