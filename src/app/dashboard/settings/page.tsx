"use client";

import { Shield, Bell, Lock, Globe, Database, User } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
        <p className="text-sm mt-1 text-gray-400">Configure your intelligence feeds, alert thresholds and API integrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-accent-gold" />
            <h3 className="text-sm font-bold text-white">Risk Thresholds</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2">Conflict Alert Sensitivity</label>
              <input type="range" className="w-full accent-accent-gold" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2">Currency Volatility Anomaly (Sigma)</label>
              <input type="range" className="w-full accent-accent-gold" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Notification Hub</h3>
          </div>
          
          <div className="space-y-3">
            {['Email Alerts', 'SMS (Critical)', 'Webhook Integrations', 'System Sounds'].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{item}</span>
                <div className="w-8 h-4 bg-dark-600 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-accent-gold rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 space-y-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Data Integrations</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'GDELT Project', status: 'Connected', key: '••••••••••••••••' },
              { name: 'Bloomberg API', status: 'Inactive', key: '—' },
              { name: 'Twitter/X Enterprise', status: 'Connected', key: '••••••••••••••••' },
            ].map((api) => (
              <div key={api.name} className="p-4 rounded-lg bg-dark-700 border border-glass-border">
                <p className="text-xs font-bold text-white mb-1">{api.name}</p>
                <p className={`text-[10px] mb-3 ${api.status === 'Connected' ? 'text-green-500' : 'text-gray-500'}`}>{api.status}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-gray-500">{api.key}</span>
                  <button className="text-[10px] text-accent-gold font-bold">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
