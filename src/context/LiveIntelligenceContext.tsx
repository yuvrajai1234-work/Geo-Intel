"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchLiveThreats, fetchLiveCurrency } from '@/lib/api';
import { threatEvents as mockThreats, currencyRisks as mockCurrency, countryRiskData as mockRisk } from '@/lib/mockData';

interface LiveIntelligenceContextType {
  liveThreats: any[];
  liveCurrency: any[];
  liveRiskScores: any[];
  isSyncing: boolean;
  lastUpdate: Date | null;
}

const LiveIntelligenceContext = createContext<LiveIntelligenceContextType | undefined>(undefined);

export function LiveIntelligenceProvider({ children }: { children: ReactNode }) {
  const [liveThreats, setLiveThreats] = useState(mockThreats);
  const [liveCurrency, setLiveCurrency] = useState(mockCurrency);
  const [liveRiskScores, setLiveRiskScores] = useState(mockRisk);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const syncData = async () => {
    setIsSyncing(true);
    try {
      // Parallel fetch from GDELT and Currency APIs
      const [newThreats, newCurrency] = await Promise.all([
        fetchLiveThreats(),
        fetchLiveCurrency()
      ]);

      if (newThreats.length > 0) {
        setLiveThreats(prev => [...newThreats, ...prev].slice(0, 50));
      }

      if (newCurrency.length > 0) {
        setLiveCurrency(newCurrency);
      }

      // Simulate Real-time Risk Prediction updates base on new data
      setLiveRiskScores(prev => prev.map(country => {
        // Drift risk scores slightly to simulate live calculation
        const drift = (Math.random() * 2 - 1);
        const newScore = Math.min(100, Math.max(0, country.riskScore + drift));
        return {
          ...country,
          riskScore: Math.round(newScore),
          lastUpdated: "Just now"
        };
      }));

      setLastUpdate(new Date());
    } catch (error) {
      console.error("Critical: Real-time sync failed", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    syncData();
    // Poll every 60 seconds for true real-time feel
    const interval = setInterval(syncData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LiveIntelligenceContext.Provider value={{ 
      liveThreats, 
      liveCurrency, 
      liveRiskScores, 
      isSyncing, 
      lastUpdate 
    }}>
      {children}
    </LiveIntelligenceContext.Provider>
  );
}

export function useLiveIntelligence() {
  const context = useContext(LiveIntelligenceContext);
  if (context === undefined) {
    throw new Error('useLiveIntelligence must be used within a LiveIntelligenceProvider');
  }
  return context;
}
