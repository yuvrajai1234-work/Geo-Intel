"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Minus, Shield, TrendingUp, Scale, Coins, MessageSquare } from "lucide-react";
import { useLiveIntelligence } from "@/context/LiveIntelligenceContext";
import { getRiskColor } from "@/lib/mockData";

export default function RiskScoresPage() {
  const { liveRiskScores } = useLiveIntelligence();
  const [sortBy, setSortBy] = useState<"riskScore" | "conflictScore" | "sanctionsScore" | "currencyScore">("riskScore");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  const sorted = [...liveRiskScores].sort((a, b) => {
    const diff = a[sortBy] - b[sortBy];
    return sortDir === "desc" ? -diff : diff;
  });

  const handleSort = (key: typeof sortBy) => {
    if (sortBy === key) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
  };

  const SortHeader = ({ label, field, icon: Icon }: { label: string; field: typeof sortBy; icon: React.ElementType }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors"
      style={{ color: sortBy === field ? "var(--color-accent-gold)" : "var(--color-text-muted)" }}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
      {sortBy === field && (sortDir === "desc" ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />)}
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>Country Risk Scores</h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
          Multi-dimensional risk assessment combining conflict, sanctions, currency, and sentiment data
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Critical", count: liveRiskScores.filter(c => c.riskLevel === "critical").length, color: "#e74c3c" },
          { label: "High", count: liveRiskScores.filter(c => c.riskLevel === "high").length, color: "#f39c12" },
          { label: "Medium", count: liveRiskScores.filter(c => c.riskLevel === "medium").length, color: "#e8a838" },
          { label: "Low/Minimal", count: liveRiskScores.filter(c => c.riskLevel === "low" || c.riskLevel === "minimal").length, color: "#2ecc71" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-sm p-4 text-center"
          >
            <p className="text-3xl font-bold mb-1" style={{ color: item.color }}>{item.count}</p>
            <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>{item.label} Risk</p>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card overflow-hidden"
      >
        {/* Table Header */}
        <div
          className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_80px] gap-4 px-5 py-3 items-center"
          style={{ borderBottom: "1px solid var(--color-glass-border)", background: "var(--color-dark-700)" }}
        >
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Country</span>
          <SortHeader label="Overall" field="riskScore" icon={Shield} />
          <SortHeader label="Conflict" field="conflictScore" icon={TrendingUp} />
          <SortHeader label="Sanctions" field="sanctionsScore" icon={Scale} />
          <SortHeader label="Currency" field="currencyScore" icon={Coins} />
          <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
            <MessageSquare className="w-3.5 h-3.5" /> Sentiment
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Trend</span>
        </div>

        {/* Rows */}
        {sorted.map((c, i) => (
          <motion.div
            key={c.code}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.03 }}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_80px] gap-4 px-5 py-3.5 items-center hover:bg-[rgba(100,140,200,0.04)] transition-colors cursor-pointer"
            style={{ borderBottom: "1px solid var(--color-glass-border)" }}
          >
            {/* Country */}
            <div className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: getRiskColor(c.riskLevel) }}
              />
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{c.country}</p>
                <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{c.region} · {c.lastUpdated}</p>
              </div>
            </div>

            {/* Risk Score */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--color-dark-600)" }}>
                <div className="h-full rounded-full" style={{ width: `${c.riskScore}%`, backgroundColor: getRiskColor(c.riskLevel) }} />
              </div>
              <span className="text-xs font-mono font-bold w-7" style={{ color: getRiskColor(c.riskLevel) }}>{c.riskScore}</span>
            </div>

            {/* Conflict */}
            <span className="text-xs font-mono font-medium" style={{ color: c.conflictScore > 70 ? "#e74c3c" : c.conflictScore > 40 ? "#f39c12" : "#2ecc71" }}>
              {c.conflictScore}
            </span>

            {/* Sanctions */}
            <span className="text-xs font-mono font-medium" style={{ color: c.sanctionsScore > 70 ? "#e74c3c" : c.sanctionsScore > 40 ? "#f39c12" : "#2ecc71" }}>
              {c.sanctionsScore}
            </span>

            {/* Currency */}
            <span className="text-xs font-mono font-medium" style={{ color: c.currencyScore > 70 ? "#e74c3c" : c.currencyScore > 40 ? "#f39c12" : "#2ecc71" }}>
              {c.currencyScore}
            </span>

            {/* Sentiment */}
            <span className="text-xs font-mono font-medium" style={{ color: c.sentimentScore < -0.5 ? "#e74c3c" : c.sentimentScore < 0 ? "#f39c12" : "#2ecc71" }}>
              {c.sentimentScore.toFixed(2)}
            </span>

            {/* Trend */}
            <div className="flex items-center gap-1">
              {c.trend === "up" && <ArrowUp className="w-3.5 h-3.5" style={{ color: "#e74c3c" }} />}
              {c.trend === "down" && <ArrowDown className="w-3.5 h-3.5" style={{ color: "#2ecc71" }} />}
              {c.trend === "stable" && <Minus className="w-3.5 h-3.5" style={{ color: "#8a94a6" }} />}
              <span className="text-[10px] capitalize" style={{ color: "var(--color-text-muted)" }}>{c.trend}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
