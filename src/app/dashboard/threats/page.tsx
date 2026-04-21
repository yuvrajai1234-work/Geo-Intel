"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, Search, AlertTriangle, ExternalLink } from "lucide-react";
import { useLiveIntelligence } from "@/context/LiveIntelligenceContext";
import { getRiskColor, getSourceIcon } from "@/lib/mockData";

export default function ThreatsPage() {
  const { liveThreats } = useLiveIntelligence();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = liveThreats.filter((evt) => {
    const matchesFilter = filter === "all" || evt.severity === filter || evt.sourceType === filter;
    const matchesSearch = evt.title.toLowerCase().includes(search.toLowerCase()) || (evt.country && evt.country.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>Threat Intelligence Feed</h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
          Real-time aggregated threat events from GDELT, OFAC, social media, and government sources
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 max-w-md"
          style={{ background: "var(--color-dark-700)", border: "1px solid var(--color-glass-border)" }}
        >
          <Search className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
          <input
            type="text"
            placeholder="Search threats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1"
            style={{ color: "var(--color-text-primary)" }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
          {["all", "critical", "high", "medium", "gdelt", "social", "ofac"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
              style={{
                background: filter === f ? "rgba(200,165,90,0.15)" : "var(--color-dark-700)",
                color: filter === f ? "var(--color-accent-gold)" : "var(--color-text-muted)",
                border: `1px solid ${filter === f ? "rgba(200,165,90,0.3)" : "var(--color-glass-border)"}`,
              }}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Events */}
      <div className="space-y-3">
        {filtered.map((evt, i) => (
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="glass-card p-5 hover:border-[rgba(200,165,90,0.2)] transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl mt-1">{getSourceIcon(evt.sourceType)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-sm font-semibold leading-snug group-hover:text-[var(--color-accent-gold)] transition-colors" style={{ color: "var(--color-text-primary)" }}>
                    {evt.title}
                  </h3>
                  <ExternalLink className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--color-text-muted)" }} />
                </div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--color-text-secondary)" }}>
                  {evt.summary}
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <span
                    className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase border"
                    style={{
                      color: getRiskColor(evt.severity),
                      borderColor: getRiskColor(evt.severity) + "40",
                      backgroundColor: getRiskColor(evt.severity) + "12",
                    }}
                  >
                    {evt.severity}
                  </span>
                  <span className="text-xs flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
                    <AlertTriangle className="w-3 h-3" /> {evt.category}
                  </span>
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>🌍 {evt.country}</span>
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>📡 {evt.source}</span>
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>🕐 {evt.timestamp}</span>
                  <span className="text-xs font-mono" style={{ color: evt.sentiment < -0.5 ? "var(--color-accent-red)" : evt.sentiment < 0 ? "var(--color-accent-amber)" : "var(--color-accent-green)" }}>
                    Sentiment: {evt.sentiment.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
