"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Globe,
  Shield,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Clock,
} from "lucide-react";
import {
  getRiskColor,
  getSourceIcon,
  getTaskStatusColor,
  type CountryRisk,
  threatEvents as mockThreats,
  anomalyAlerts as mockAnomalies,
  currencyRisks as mockCurrency,
  engineTasks as mockEngine,
} from "@/lib/mockData";
import { useLiveIntelligence } from "@/context/LiveIntelligenceContext";
import Link from "next/link";

// Stat Card
function StatCard({
  label,
  value,
  change,
  icon: Icon,
  color,
  delay,
}: {
  label: string;
  value: string;
  change?: string;
  icon: React.ElementType;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
        {change && (
          <span className="text-xs font-medium flex items-center gap-1" style={{ color }}>
            {change.startsWith("+") ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : change.startsWith("-") ? (
              <ArrowDownRight className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </p>
    </motion.div>
  );
}

// Risk bar
function RiskBar({ country, score, level }: { country: string; score: number; level: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-xs font-medium w-20 truncate" style={{ color: "var(--color-text-secondary)" }}>
        {country}
      </span>
      <div className="flex-1 h-2 rounded-full" style={{ background: "var(--color-dark-600)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: getRiskColor(level as CountryRisk["riskLevel"]) }}
        />
      </div>
      <span className="text-xs font-mono font-bold w-8 text-right" style={{ color: getRiskColor(level as CountryRisk["riskLevel"]) }}>
        {score}
      </span>
    </div>
  );
}

// Mini world map using canvas
function MiniWorldMap({ riskData }: { riskData: any[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const dw = w / 2;
    const dh = h / 2;

    ctx.clearRect(0, 0, dw, dh);

    // Simple projection
    const project = (lat: number, lng: number) => {
      const x = ((lng + 180) / 360) * dw;
      const y = ((90 - lat) / 180) * dh;
      return { x, y };
    };

    // Draw dots
    const time = Date.now();
    riskData.slice(0, 15).forEach((c: any) => {
      // Approx coordinates
      const coords: Record<string, [number, number]> = {
        UA: [48.38, 31.16], RU: [61.52, 105.32], IR: [32.43, 53.69], YE: [15.55, 48.52],
        SY: [34.80, 38.99], KP: [40.34, 127.51], CN: [35.86, 104.20], PK: [30.38, 69.35],
        NG: [9.08, 8.68], TW: [23.70, 120.96], IL: [31.05, 34.85], TR: [38.96, 35.24],
      };
      const coord = coords[c.code] || [0, 0];
      const pos = project(coord[0], coord[1]);
      const color = getRiskColor(c.riskLevel);
      const pulse = Math.sin(time * 0.003 + pos.x * 0.05) * 0.3 + 0.7;
      const size = c.riskLevel === "critical" ? 5 : c.riskLevel === "high" ? 4 : 3;

      // Glow
      const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size * 4 * pulse);
      grad.addColorStop(0, color + "66");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size * 4 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Dot
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
      ctx.fill();
    });

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ imageRendering: "auto" }} />;
}

export default function DashboardOverview() {
  const { liveThreats, liveCurrency, liveRiskScores, isSyncing, lastUpdate } = useLiveIntelligence();
  const [, setTick] = useState(0);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const criticalCount = liveRiskScores.filter((c: any) => c.riskLevel === "critical").length;
  const activeAnomalies = mockAnomalies.filter((a) => a.severity === "critical" || a.severity === "high").length;
  const runningTasks = mockEngine.filter((t) => t.status === "running").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            Global Threat Overview
          </h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-sm flex items-center gap-2" style={{ color: "var(--color-text-muted)" }}>
                <Clock className="w-3.5 h-3.5" />
                Live Sync: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Connecting...'} {isSyncing && '(Updating...)'}
            </p>
            <button 
                onClick={() => alert("System Sync Initialized: Re-verifying GDELT ingress and market volatility indices.")}
                className="text-[10px] font-black text-accent-gold uppercase tracking-widest hover:underline"
            >
                Manual Refresh
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full status-live" style={{ backgroundColor: "var(--color-accent-red)" }} />
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--color-accent-red)" }}>
            {criticalCount} Critical Zones
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Countries Monitored"
          value="195"
          icon={Globe}
          color="#3498db"
          delay={0}
        />
        <StatCard
          label="Active Threats"
          value={String(liveThreats.length)}
          change="+3 today"
          icon={AlertTriangle}
          color="#e74c3c"
          delay={0.1}
        />
        <StatCard
          label="Anomalies Detected"
          value={String(activeAnomalies)}
          change="+2 in 24h"
          icon={Zap}
          color="#f39c12"
          delay={0.2}
        />
        <StatCard
          label="Engine Tasks Running"
          value={String(runningTasks)}
          icon={Activity}
          color="#2ecc71"
          delay={0.3}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Threat Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card lg:col-span-2 overflow-hidden"
        >
          <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--color-glass-border)" }}>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                Global Threat Map
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                Real-time risk distribution across monitored regions
              </p>
            </div>
            <Link
              href="/dashboard/risk-scores"
              className="text-xs font-medium flex items-center gap-1 transition-colors"
              style={{ color: "var(--color-accent-gold)" }}
            >
              View Details <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="h-[300px] relative">
            <MiniWorldMap riskData={liveRiskScores} />
          </div>
          {/* Legend */}
          <div className="px-4 pb-3 flex items-center gap-5">
            {[
              { label: "Critical", color: "#e74c3c" },
              { label: "High", color: "#f39c12" },
              { label: "Medium", color: "#e8a838" },
              { label: "Low", color: "#2ecc71" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                  {l.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Risk Countries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass-card"
        >
          <div className="p-4" style={{ borderBottom: "1px solid var(--color-glass-border)" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                Top Risk Countries
              </h3>
              <Shield className="w-4 h-4" style={{ color: "var(--color-accent-gold)" }} />
            </div>
          </div>
          <div className="p-4 space-y-0.5 text-xs">
            {liveRiskScores.slice(0, 10).map((c: any) => (
              <RiskBar key={c.code} country={c.country} score={c.riskScore} level={c.riskLevel} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Live Threat Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass-card"
        >
          <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--color-glass-border)" }}>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full status-live" style={{ backgroundColor: "var(--color-accent-red)" }} />
              <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                Live Threat Feed
              </h3>
            </div>
            <Link
              href="/dashboard/threats"
              className="text-xs font-medium flex items-center gap-1"
              style={{ color: "var(--color-accent-gold)" }}
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--color-glass-border)" }}>
            {liveThreats.slice(0, 5).map((evt: any) => (
              <div key={evt.id} className="p-4 hover:bg-[rgba(100,140,200,0.04)] transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{getSourceIcon(evt.sourceType)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug mb-1 line-clamp-2" style={{ color: "var(--color-text-primary)" }}>
                      {evt.title}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase border"
                        style={{
                          color: getRiskColor(evt.severity),
                          borderColor: getRiskColor(evt.severity) + "40",
                          backgroundColor: getRiskColor(evt.severity) + "15",
                        }}
                      >
                        {evt.severity}
                      </span>
                      <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                        {evt.country || 'Global'}
                      </span>
                      <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                        {evt.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Anomaly Alerts + Currency */}
        <div className="space-y-5">
          {/* Anomaly Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="glass-card"
          >
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--color-glass-border)" }}>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" style={{ color: "var(--color-accent-amber)" }} />
                <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  Anomaly Alerts
                </h3>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ background: "rgba(231,76,60,0.15)", color: "var(--color-accent-red)" }}
              >
                {mockAnomalies.length} ACTIVE
              </span>
            </div>
            <div className="p-4 space-y-3">
              {mockAnomalies.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg border cursor-pointer transition-colors hover:border-opacity-50"
                  style={{
                    background: getRiskColor(alert.severity) + "08",
                    borderColor: getRiskColor(alert.severity) + "25",
                  }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>
                      {alert.title}
                    </p>
                    <span className="text-[10px] font-mono ml-2 shrink-0" style={{ color: getRiskColor(alert.severity) }}>
                      {alert.deviation.toFixed(1)}σ
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                    {alert.description.slice(0, 100)}...
                  </p>
                  <p className="text-[10px] mt-1.5" style={{ color: "var(--color-text-muted)" }}>
                    {alert.detectedAt}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Currency Quick View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="glass-card"
          >
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--color-glass-border)" }}>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" style={{ color: "var(--color-accent-cyan)" }} />
                <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  Currency Watch
                </h3>
              </div>
              <Link
                href="/dashboard/currency"
                className="text-xs font-medium flex items-center gap-1"
                style={{ color: "var(--color-accent-gold)" }}
              >
                View All <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {liveCurrency.slice(0, 4).map((c: any) => (
                  <div
                    key={c.pair}
                    className="p-3 rounded-lg"
                    style={{ background: "var(--color-dark-700)", border: "1px solid var(--color-glass-border)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold" style={{ color: "var(--color-text-primary)" }}>
                        {c.pair}
                      </span>
                      {c.anomalyDetected && (
                        <Zap className="w-3 h-3" style={{ color: "var(--color-accent-amber)" }} />
                      )}
                    </div>
                    <p className="text-lg font-bold font-mono" style={{ color: "var(--color-text-primary)" }}>
                      {c.rate > 1000 ? c.rate.toLocaleString() : c.rate.toFixed(3)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {c.change24h > 0 ? (
                        <TrendingUp className="w-3 h-3" style={{ color: "#e74c3c" }} />
                      ) : (
                        <TrendingDown className="w-3 h-3" style={{ color: "#2ecc71" }} />
                      )}
                      <span
                        className="text-[11px] font-mono font-medium"
                        style={{ color: c.change24h > 0 ? "#e74c3c" : "#2ecc71" }}
                      >
                        {c.change24h > 0 ? "+" : ""}{c.change24h}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Engine Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="glass-card"
      >
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--color-glass-border)" }}>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" style={{ color: "var(--color-accent-green)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Engine Pipeline Status
            </h3>
          </div>
          <Link
            href="/dashboard/engine"
            className="text-xs font-medium flex items-center gap-1"
            style={{ color: "var(--color-accent-gold)" }}
          >
            View Engine <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {mockEngine.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-lg"
                style={{ background: "var(--color-dark-700)", border: "1px solid var(--color-glass-border)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase"
                    style={{
                      background: getTaskStatusColor(task.status) + "20",
                      color: getTaskStatusColor(task.status),
                    }}
                  >
                    {task.status}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: "var(--color-text-muted)" }}>
                    {task.worker}
                  </span>
                </div>
                <p className="text-xs font-medium mb-2 line-clamp-1" style={{ color: "var(--color-text-primary)" }}>
                  {task.name}
                </p>
                <div className="h-1.5 rounded-full" style={{ background: "var(--color-dark-600)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${task.progress}%`,
                      backgroundColor: getTaskStatusColor(task.status),
                    }}
                  />
                </div>
                <p className="text-[10px] mt-1 text-right font-mono" style={{ color: "var(--color-text-muted)" }}>
                  {task.progress}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
