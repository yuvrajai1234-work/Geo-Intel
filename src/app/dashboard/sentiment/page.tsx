"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Activity, TrendingDown, TrendingUp, BarChart3, MessageSquare } from "lucide-react";
import { sentimentTimeSeries } from "@/lib/mockData";

function SentimentChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = 2;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);

    const data = sentimentTimeSeries;
    const maxVal = 70;

    // Y-axis grid
    ctx.strokeStyle = "rgba(80,120,180,0.08)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartH * i) / 5;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = "rgba(138,148,166,0.6)";
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.textAlign = "right";
      ctx.fillText(String(Math.round(maxVal - (maxVal * i) / 5)), padding.left - 8, y + 3);
    }

    // X-axis labels
    ctx.fillStyle = "rgba(138,148,166,0.5)";
    ctx.font = "9px Inter, sans-serif";
    ctx.textAlign = "center";
    data.forEach((d, i) => {
      if (i % 5 === 0) {
        const x = padding.left + (chartW * i) / (data.length - 1);
        ctx.fillText(d.date.slice(5), x, h - padding.bottom + 16);
      }
    });

    const drawLine = (values: number[], color: string, fillColor: string) => {
      const points = values.map((v, i) => ({
        x: padding.left + (chartW * i) / (values.length - 1),
        y: padding.top + chartH - (v / maxVal) * chartH,
      }));

      // Fill
      ctx.beginPath();
      ctx.moveTo(points[0].x, padding.top + chartH);
      points.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();

      // Line
      ctx.beginPath();
      points.forEach((p, idx) => (idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dots
      points.forEach((p, idx) => {
        if (idx === points.length - 1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.fill();
        }
      });
    };

    drawLine(data.map((d) => d.negative), "#e74c3c", "rgba(231,76,60,0.08)");
    drawLine(data.map((d) => d.neutral), "#8a94a6", "rgba(138,148,166,0.05)");
    drawLine(data.map((d) => d.positive), "#2ecc71", "rgba(46,204,113,0.06)");
  }, []);

  useEffect(() => {
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [draw]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

function VolumeChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = 2;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 10, right: 20, bottom: 30, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);

    const data = sentimentTimeSeries;
    const maxVol = Math.max(...data.map((d) => d.volume)) * 1.1;
    const barW = (chartW / data.length) * 0.7;

    data.forEach((d, i) => {
      const x = padding.left + (chartW * i) / data.length + barW * 0.15;
      const barH = (d.volume / maxVol) * chartH;
      const y = padding.top + chartH - barH;

      const isHigh = d.volume > 110000;
      ctx.fillStyle = isHigh ? "rgba(231,76,60,0.5)" : "rgba(52,152,219,0.3)";
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [2, 2, 0, 0]);
      ctx.fill();
    });
  }, []);

  useEffect(() => {
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [draw]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

export default function SentimentPage() {
  const latestData = sentimentTimeSeries[sentimentTimeSeries.length - 1];
  const prevData = sentimentTimeSeries[sentimentTimeSeries.length - 2];
  const negChange = latestData.negative - prevData.negative;
  const volChange = ((latestData.volume - prevData.volume) / prevData.volume * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>Sentiment Analysis</h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
          AI-powered NLP sentiment tracking across global news, social media, and government communications
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Negative Sentiment", value: `${latestData.negative}%`, change: negChange > 0 ? `+${negChange}%` : `${negChange}%`, color: "#e74c3c", icon: TrendingDown },
          { label: "Positive Sentiment", value: `${latestData.positive}%`, change: "+2%", color: "#2ecc71", icon: TrendingUp },
          { label: "Daily Volume", value: latestData.volume.toLocaleString(), change: `${volChange}%`, color: "#3498db", icon: BarChart3 },
          { label: "Sources Analyzed", value: "142K", change: "+8K", color: "#9b59b6", icon: MessageSquare },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <item.icon className="w-4 h-4" style={{ color: item.color }} />
              <span className="text-[10px] font-mono" style={{ color: item.color }}>{item.change}</span>
            </div>
            <p className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>{item.value}</p>
            <p className="text-[11px] mt-1" style={{ color: "var(--color-text-muted)" }}>{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Sentiment Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card"
      >
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--color-glass-border)" }}>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Sentiment Trend — 30 Days</h3>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>Global aggregate from all monitored sources</p>
          </div>
          <div className="flex items-center gap-4">
            {[
              { label: "Negative", color: "#e74c3c" },
              { label: "Neutral", color: "#8a94a6" },
              { label: "Positive", color: "#2ecc71" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[320px] p-4">
          <SentimentChart />
        </div>
      </motion.div>

      {/* Volume Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card"
      >
        <div className="p-4" style={{ borderBottom: "1px solid var(--color-glass-border)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Content Volume — Articles & Posts Analyzed</h3>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>Red bars indicate anomalous volume spikes (above threshold)</p>
        </div>
        <div className="h-[200px] p-4">
          <VolumeChart />
        </div>
      </motion.div>

      {/* Source Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card"
      >
        <div className="p-4" style={{ borderBottom: "1px solid var(--color-glass-border)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Source Breakdown</h3>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { name: "News Articles", count: "48.2K", sentiment: -0.42, pct: 34 },
            { name: "Twitter/X", count: "52.1K", sentiment: -0.61, pct: 37 },
            { name: "Reddit", count: "18.4K", sentiment: -0.38, pct: 13 },
            { name: "Telegram", count: "12.8K", sentiment: -0.72, pct: 9 },
            { name: "Gov Releases", count: "10.5K", sentiment: -0.15, pct: 7 },
          ].map((src, i) => (
            <div key={i} className="p-3 rounded-lg" style={{ background: "var(--color-dark-700)", border: "1px solid var(--color-glass-border)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>{src.name}</p>
              <p className="text-lg font-bold font-mono" style={{ color: "var(--color-text-primary)" }}>{src.count}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-mono" style={{ color: src.sentiment < -0.5 ? "#e74c3c" : "#f39c12" }}>
                  {src.sentiment.toFixed(2)}
                </span>
                <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{src.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
