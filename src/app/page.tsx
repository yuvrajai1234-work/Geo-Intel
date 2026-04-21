"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Activity, Globe, BarChart3, Zap, ArrowRight, Radio, LogIn, UserPlus } from "lucide-react";
import GlobeCanvas from "@/components/GlobeCanvas";
import Link from "next/link";

function RealTimeClock() {
  const [time, setTime] = useState(new Date());
  const [selectedZone, setSelectedZone] = useState("UTC");

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: selectedZone,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date).split(':');
  };

  const [hh, mm, ss] = formatTime(time);
  
  const timelines = [
    { label: "UTC", zone: "UTC" },
    { label: "EST", zone: "America/New_York" },
    { label: "GMT", zone: "Europe/London" },
    { label: "IST", zone: "Asia/Kolkata" },
  ];

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Timeline Selection Brackets */}
      <div className="flex items-center gap-4">
        <span className="text-[10px] text-gray-500 tracking-widest">[ TIMELINES ]</span>
        <div className="flex gap-2">
          {timelines.map((t) => (
            <button
              key={t.label}
              onClick={() => setSelectedZone(t.zone)}
              className={`px-2 py-0.5 text-[9px] font-bold border transition-all ${
                selectedZone === t.zone 
                ? "border-accent-gold text-accent-gold bg-accent-gold/5" 
                : "border-glass-border text-gray-500 hover:text-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8 relative">
        {/* Decorative Brackets */}
        <div className="absolute -left-6 md:-left-12 top-0 bottom-0 w-4 border-l-2 border-t-2 border-b-2 border-accent-gold/30 rounded-l-xl"></div>
        <div className="absolute -right-6 md:-right-12 top-0 bottom-0 w-4 border-r-2 border-t-2 border-b-2 border-accent-gold/30 rounded-r-xl"></div>

        {[
          { value: hh, label: "HOURS" },
          { value: mm, label: "MINUTES" },
          { value: ss, label: "SECONDS" },
        ].map((item, i) => (
          <div key={i} className="text-center min-w-[80px] md:min-w-[120px]">
            <div
              className="text-5xl md:text-7xl font-black tracking-tighter"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-text-primary)",
              }}
            >
              {item.value}
            </div>
            <div
              className="text-[9px] md:text-[11px] tracking-[0.4em] mt-2 font-bold"
              style={{ color: "var(--color-text-muted)" }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-[10px] font-mono text-accent-gold/60 tracking-[0.3em] uppercase">
        Live Synchronized Intelligence Feed
      </div>
    </div>
  );
}

const features = [
  {
    icon: Globe,
    title: "Global Threat Mapping",
    desc: "Real-time geopolitical risk visualization across 195 countries with live data feeds from GDELT, OFAC, and UN databases.",
  },
  {
    icon: Activity,
    title: "Sentiment Analysis",
    desc: "AI-powered NLP processing of 100K+ daily news articles and social media posts to detect emerging threats.",
  },
  {
    icon: BarChart3,
    title: "Risk Scoring Engine",
    desc: "Multi-dimensional risk scores combining conflict intensity, sanctions exposure, and currency volatility metrics.",
  },
  {
    icon: Shield,
    title: "Supply Chain Intel",
    desc: "Interactive supply route visualization with disruption alerts, sanctions compliance checks, and alternative routing.",
  },
  {
    icon: Zap,
    title: "Anomaly Detection",
    desc: "Statistical anomaly detection on financial markets, trade flows, and political stability indicators using ML models.",
  },
  {
    icon: Radio,
    title: "Live Monitoring",
    desc: "24/7 automated monitoring with configurable alert thresholds and real-time notification pipeline via Celery + Redis.",
  },
];

const dataSources = [
  { name: "GDELT Project", desc: "Global event monitoring", status: "live" },
  { name: "OFAC / UN", desc: "Sanctions & compliance", status: "live" },
  { name: "World Bank", desc: "Economic indicators", status: "live" },
  { name: "Social Media", desc: "Sentiment feeds", status: "live" },
  { name: "Gov Reports", desc: "Official intelligence", status: "syncing" },
  { name: "Financial APIs", desc: "Currency & markets", status: "live" },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: "var(--color-dark-900)" }}>
      <GlobeCanvas />

      {/* ===== HERO SECTION ===== */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
        {/* Logo */}
        {/* Logo - Removed symbols */}

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 md:mt-32"
        >
          <p
            className="text-xl md:text-l tracking-[0.5em] font-bold mb-4"
            style={{ color: "var(--color-text-primary)" }}
          >
            The
          </p>
          <h1
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4"
            style={{ color: "var(--color-text-primary)" }}
          >
            GEO INTEL
          </h1>
          <h2 className="text-lg md:text-2xl font-light tracking-[0.2em] mb-6 text-gray-400">
            Global Risks & Threats Intel
          </h2>
          <div
            className="flex items-center justify-center gap-6 text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold"
            style={{ color: "var(--color-text-muted)" }}
          >
            <span>News</span>
            <span className="w-1 h-1 rounded-full bg-accent-gold/40"></span>
            <span>Analysis</span>
            <span className="w-1 h-1 rounded-full bg-accent-gold/40"></span>
            <span>Intel</span>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-64 md:w-80 h-px my-12"
          style={{ background: "linear-gradient(90deg, transparent, var(--color-accent-gold), transparent)" }}
        />

        {/* Time Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mb-16"
        >
          <RealTimeClock />
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mb-12"
        >
          <p
            className="text-xs md:text-sm tracking-[0.3em] uppercase font-bold"
            style={{ color: "var(--color-text-muted)" }}
          >
            World Affairs, Clarified
          </p>

          <div className="flex items-center justify-center gap-3 mt-5">
            <span
              className="w-2.5 h-2.5 rounded-full status-live shadow-[0_0_10px_rgba(231,76,60,0.5)]"
              style={{ backgroundColor: "var(--color-accent-red)" }}
            />
            <span
              className="text-[11px] tracking-[0.3em] uppercase font-black"
              style={{ color: "var(--color-accent-red)" }}
            >
              Monitoring Live
            </span>
          </div>
        </motion.div>

        {/* Auth CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/auth?tab=signin"
            className="group flex items-center gap-3 px-10 py-4 rounded-full text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, var(--color-accent-gold), var(--color-accent-amber))",
              color: "var(--color-dark-900)",
            }}
          >
            <LogIn className="w-4 h-4" />
            Sign In
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/auth?tab=signup"
            className="group flex items-center gap-3 px-10 py-4 rounded-full text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 border border-glass-border hover:border-accent-gold/40 hover:bg-accent-gold/5"
            style={{
              color: "var(--color-text-primary)",
            }}
          >
            <UserPlus className="w-4 h-4" />
            Sign Up
          </Link>
        </motion.div>

        {/* Scroll indicator - Moved below buttons with glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-3"
          >
            <span 
              className="text-[10px] tracking-[0.4em] font-black uppercase text-accent-gold"
              style={{ filter: 'drop-shadow(0 0 8px rgba(200, 165, 90, 0.4))' }}
            >
              Scroll to explore
            </span>
            <div
              className="w-px h-16 bg-gradient-to-b from-accent-gold via-accent-gold/40 to-transparent"
              style={{ boxShadow: '0 0 15px rgba(200, 165, 90, 0.2)' }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative z-10 py-32 px-4 border-t border-glass-border/30 bg-dark-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p
              className="text-[11px] tracking-[0.5em] uppercase font-bold mb-4"
              style={{ color: "var(--color-accent-gold)" }}
            >
              An Intelligence Platform
            </p>
            <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: "var(--color-text-primary)" }}>
              A Power for a Volatile World
            </h2>
            <div className="w-20 h-1 bg-accent-gold mx-auto mb-8 opacity-60"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-8 border-transparent hover:border-accent-gold/20 hover:bg-accent-gold/5 transition-all duration-500 group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:rotate-6 bg-dark-800 border border-glass-border"
                >
                  <f.icon
                    className="w-7 h-7 text-accent-gold group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3
                  className="text-lg font-black mb-3 tracking-tight"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DATA SOURCES SECTION ===== */}
      <section className="relative z-10 py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p
              className="text-[11px] tracking-[0.5em] uppercase font-bold mb-4"
              style={{ color: "var(--color-accent-gold)" }}
            >
              Data Aggregation
            </p>
            <h2 className="text-3xl md:text-4xl font-black mb-6" style={{ color: "var(--color-text-primary)" }}>
              The World's Information, Consolidated
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {dataSources.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-glass-border bg-dark-800/40 flex flex-col justify-between hover:bg-dark-800 transition-colors"
                style={{ height: '120px' }}
              >
                <div>
                  <p className="text-sm font-black text-white">{src.name}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{src.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${src.status === 'live' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]'}`}
                  />
                  <span
                    className={`text-[9px] uppercase tracking-widest font-black ${src.status === 'live' ? 'text-green-500' : 'text-orange-500'}`}
                  >
                    {src.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 py-16 px-4 text-center border-t border-glass-border/30">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-lg font-black tracking-tighter text-white">GEO INTEL</span>
        </div>
        <p className="text-[10px] tracking-[0.3em] font-bold uppercase text-gray-500">
          © {new Date().getFullYear()} Global Risk Intelligence Platform. Security Class: Very High.
        </p>
      </footer>
    </div>
  );
}
