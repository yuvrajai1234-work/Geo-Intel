"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  AlertTriangle,
  TrendingUp,
  Ship,
  Activity,
  Cpu,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Bell,
  Search,
  LogOut,
} from "lucide-react";

import { LiveIntelligenceProvider } from "@/context/LiveIntelligenceContext";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/threats", label: "Threat Feed", icon: AlertTriangle },
  { href: "/dashboard/risk-scores", label: "Risk Scores", icon: Globe },
  { href: "/dashboard/sentiment", label: "Sentiment", icon: Activity },
  { href: "/dashboard/currency", label: "Currency & Markets", icon: TrendingUp },
  { href: "/dashboard/supply-chain", label: "Supply Chain", icon: Ship },
  { href: "/dashboard/engine", label: "Engine Monitor", icon: Cpu },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    // In a real app, you'd clear session/tokens here
    router.push("/auth");
  };

  return (
    <LiveIntelligenceProvider>
      <div className="flex min-h-screen" style={{ background: "var(--color-dark-900)" }}>
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300"
        style={{
          width: collapsed ? "72px" : "250px",
          background: "var(--color-dark-800)",
          borderRight: "1px solid var(--color-glass-border)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 h-16 shrink-0"
          style={{ borderBottom: "1px solid var(--color-glass-border)" }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(200,165,90,0.15)", border: "1px solid rgba(200,165,90,0.3)" }}
          >
            <Shield className="w-5 h-5" style={{ color: "var(--color-accent-gold)" }} />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>
                GeoIntel
              </h1>
              <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                Intelligence Platform
              </p>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-link ${isActive ? "active" : ""}`}
                  title={collapsed ? item.label : undefined}
                  style={collapsed ? { justifyContent: "center", padding: "10px" } : {}}
                >
                  <item.icon className="w-[18px] h-[18px] shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Option */}
        <div className="px-3 py-1">
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-left"
            title={collapsed ? "Logout" : undefined}
            style={collapsed ? { justifyContent: "center", padding: "10px", color: "var(--color-accent-red)" } : { color: "var(--color-accent-red)" }}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <div className="p-3 shrink-0" style={{ borderTop: "1px solid var(--color-glass-border)" }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs transition-colors"
            style={{ color: "var(--color-text-muted)" }}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && "Collapse"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: collapsed ? "72px" : "250px" }}
      >
        {/* Top Bar */}
        <header
          className="sticky top-0 z-30 h-16 flex items-center justify-between px-6"
          style={{
            background: "rgba(10, 14, 23, 0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--color-glass-border)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
              style={{
                background: "var(--color-dark-700)",
                border: "1px solid var(--color-glass-border)",
                color: "var(--color-text-muted)",
              }}
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Search threats, countries, events...</span>
              <kbd
                className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded ml-8"
                style={{ background: "var(--color-dark-600)", color: "var(--color-text-muted)" }}
              >
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live indicator */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full status-live" style={{ backgroundColor: "var(--color-accent-green)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--color-accent-green)" }}>
                LIVE
              </span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg transition-colors" style={{ color: "var(--color-text-secondary)" }}>
              <Bell className="w-4.5 h-4.5" />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--color-accent-red)" }}
              />
            </button>

            {/* User */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, var(--color-accent-gold), var(--color-accent-amber))",
                color: "var(--color-dark-900)",
              }}
            >
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
    </LiveIntelligenceProvider>
  );
}
