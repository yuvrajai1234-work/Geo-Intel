"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Zap, AlertTriangle, BarChart3 } from "lucide-react";
import { useLiveIntelligence } from "@/context/LiveIntelligenceContext";
import { anomalyAlerts, getRiskColor } from "@/lib/mockData";

function CurrencySparkline({ color, volatility }: { color: string; volatility: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = 2;
    canvas.width = 120 * dpr;
    canvas.height = 40 * dpr;
    ctx.scale(dpr, dpr);

    const w = 120, h = 40;
    ctx.clearRect(0, 0, w, h);

    // Generate random sparkline data based on volatility
    const points = 20;
    const data: number[] = [];
    let val = h / 2;
    for (let i = 0; i < points; i++) {
      val += (Math.random() - 0.45) * volatility * 1.5;
      val = Math.max(5, Math.min(h - 5, val));
      data.push(val);
    }

    // Fill
    ctx.beginPath();
    ctx.moveTo(0, h);
    data.forEach((v, i) => ctx.lineTo((w / (points - 1)) * i, v));
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = color + "15";
    ctx.fill();

    // Line
    ctx.beginPath();
    data.forEach((v, i) => (i === 0 ? ctx.moveTo(0, v) : ctx.lineTo((w / (points - 1)) * i, v)));
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [color, volatility]);

  useEffect(() => {
    draw();
  }, [draw]);

  return <canvas ref={canvasRef} className="w-[120px] h-[40px]" />;
}

export default function CurrencyPage() {
  const { liveCurrency } = useLiveIntelligence();
  const currencyAnomalies = anomalyAlerts.filter(a => a.type === "currency");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>Currency & Market Risk</h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
          Real-time currency monitoring with anomaly detection and volatility analysis
        </p>
      </div>

      {/* Currency Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {liveCurrency.map((c, i) => (
          <motion.div
            key={c.pair}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-mono font-bold" style={{ color: "var(--color-text-primary)" }}>{c.pair}</span>
              <div className="flex items-center gap-1.5">
                {c.anomalyDetected && (
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(243,156,18,0.15)", color: "var(--color-accent-amber)" }}>
                    <Zap className="w-3 h-3" /> {parseFloat(c.volatility).toFixed(1)}σ
                  </span>
                )}
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getRiskColor(c.riskLevel) }}
                />
              </div>
            </div>

            <p suppressHydrationWarning className="text-2xl font-bold font-mono mb-1" style={{ color: "var(--color-text-primary)" }}>
              {parseFloat(c.rate) > 1000 ? parseFloat(c.rate).toLocaleString() : parseFloat(c.rate).toFixed(parseFloat(c.rate) < 10 ? 3 : 2)}
            </p>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                {parseFloat(c.change24h) > 0 ? (
                  <TrendingUp className="w-3.5 h-3.5" style={{ color: "#e74c3c" }} />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" style={{ color: "#2ecc71" }} />
                )}
                <span className="text-xs font-mono font-medium" style={{ color: parseFloat(c.change24h) > 0 ? "#e74c3c" : "#2ecc71" }}>
                  {parseFloat(c.change24h) > 0 ? "+" : ""}{c.change24h}%
                </span>
              </div>
              <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                Vol: {parseFloat(c.volatility).toFixed(1)}
              </span>
            </div>

            <CurrencySparkline color={getRiskColor(c.riskLevel)} volatility={parseFloat(c.volatility)} />
          </motion.div>
        ))}
      </div>

      {/* Anomaly Detection Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card"
      >
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--color-glass-border)" }}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" style={{ color: "var(--color-accent-amber)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Currency Anomaly Alerts
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(231,76,60,0.15)", color: "#e74c3c" }}>
            {currencyAnomalies.length} ACTIVE
          </span>
        </div>
        <div className="p-4 space-y-3">
          {currencyAnomalies.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="p-4 rounded-lg border"
              style={{
                background: getRiskColor(alert.severity) + "08",
                borderColor: getRiskColor(alert.severity) + "25",
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{alert.title}</h4>
                <span className="text-xs font-mono font-bold ml-2 shrink-0" style={{ color: getRiskColor(alert.severity) }}>
                  {alert.deviation.toFixed(1)}σ deviation
                </span>
              </div>
              <p className="text-xs mb-3" style={{ color: "var(--color-text-secondary)" }}>{alert.description}</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-2 rounded" style={{ background: "var(--color-dark-700)" }}>
                  <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Expected</p>
                  <p className="text-xs font-mono font-bold" style={{ color: "var(--color-text-primary)" }}>{alert.expected}</p>
                </div>
                <div className="p-2 rounded" style={{ background: "var(--color-dark-700)" }}>
                  <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Actual</p>
                  <p className="text-xs font-mono font-bold" style={{ color: getRiskColor(alert.severity) }}>{alert.actual}</p>
                </div>
                <div className="p-2 rounded" style={{ background: "var(--color-dark-700)" }}>
                  <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Detected</p>
                  <p className="text-xs font-mono font-bold" style={{ color: "var(--color-text-primary)" }}>{alert.detectedAt}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Volatility Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card"
      >
        <div className="p-4" style={{ borderBottom: "1px solid var(--color-glass-border)" }}>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" style={{ color: "var(--color-accent-cyan)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Volatility Comparison</h3>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {[...liveCurrency].sort((a, b) => parseFloat(b.volatility) - parseFloat(a.volatility)).map((c) => (
            <div key={c.pair} className="flex items-center gap-3">
              <span className="text-xs font-mono font-medium w-20" style={{ color: "var(--color-text-secondary)" }}>{c.pair}</span>
              <div className="flex-1 h-3 rounded-full" style={{ background: "var(--color-dark-600)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(parseFloat(c.volatility) / 15) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: getRiskColor(c.riskLevel) }}
                />
              </div>
              <span className="text-xs font-mono font-bold w-10 text-right" style={{ color: getRiskColor(c.riskLevel) }}>
                {parseFloat(c.volatility).toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
