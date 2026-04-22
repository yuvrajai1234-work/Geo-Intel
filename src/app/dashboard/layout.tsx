"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { countryRiskData, threatEvents } from "@/lib/mockData";
import { Search as SearchIcon, Flag, AlertCircle } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredItems = [
    ...navItems.map(item => ({ ...item, type: 'page' })),
    ...countryRiskData.map(c => ({ 
      label: c.country, 
      href: `/dashboard/risk-scores?country=${c.code}`, 
      icon: Flag, 
      type: 'country',
      subtitle: `${c.region} • ${c.riskLevel} risk`
    })),
    ...threatEvents.map(t => ({ 
      label: t.title, 
      href: `/dashboard/threats?id=${t.id}`, 
      icon: AlertCircle, 
      type: 'threat',
      subtitle: `${t.country} • ${t.severity}`
    }))
  ].filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10);

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
          <div className="flex items-center gap-3 relative">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm group transition-all"
              style={{
                background: "var(--color-dark-700)",
                border: "1px solid var(--color-glass-border)",
                color: "var(--color-text-muted)",
                width: "300px",
              }}
            >
              <Search className="w-3.5 h-3.5 group-focus-within:text-accent-gold" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search threats, countries, events..."
                className="bg-transparent border-none outline-none text-xs w-full text-text-primary"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchVisible(true);
                }}
                onFocus={() => setSearchVisible(true)}
              />
              <kbd
                className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded"
                style={{ background: "var(--color-dark-600)", color: "var(--color-text-muted)" }}
              >
                ⌘K
              </kbd>
            </div>

            {/* Search Results Dropdown */}
            {searchVisible && searchQuery && (
              <div 
                className="absolute top-full left-0 mt-2 w-full glass-card overflow-hidden z-50 shadow-2xl"
                onMouseLeave={() => setSearchVisible(false)}
              >
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => {
                          router.push(item.href);
                          setSearchQuery("");
                          setSearchVisible(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[rgba(100,140,200,0.08)] transition-colors text-left border-b border-glass-border last:border-0"
                      >
                        <div className={`p-1.5 rounded ${item.type === 'threat' ? 'bg-red-500/10' : item.type === 'country' ? 'bg-blue-500/10' : 'bg-dark-600'}`}>
                          <item.icon className={`w-3.5 h-3.5 ${item.type === 'threat' ? 'text-red-500' : item.type === 'country' ? 'text-blue-400' : 'text-accent-gold'}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{item.label}</p>
                          <p className="text-[10px] text-gray-500 truncate">{item.subtitle || `Navigate to ${item.label} module`}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-xs text-gray-500 font-medium italic">No results found for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </div>
            )}
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
