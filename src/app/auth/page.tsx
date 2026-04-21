"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Mail, Lock, User, ArrowRight, ShieldCheck, Cpu } from "lucide-react";
import Link from "next/link";

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") === "signup" ? "signup" : "signin";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleDemoLogin = () => {
    setIsLoading(true);
    setFormData({
      email: "demo.agent@geointel.org",
      password: "••••••••••••",
      name: "Agent Zero",
    });
    
    // Simulate biometric/secure login
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 bg-dark-900 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-gold/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 grid-pattern opacity-10"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md relative z-10 overflow-hidden"
      >
        <div className="p-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-accent-gold/10 border border-accent-gold/20 mb-6">
            <Shield className="w-8 h-8 text-accent-gold" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Security Protocol</h1>
          <p className="text-sm text-gray-500 mt-2">Geospatial Intelligence Access Terminal</p>
        </div>

        {/* Tabs */}
        <div className="flex px-8 gap-6 border-b border-glass-border">
          <button 
            onClick={() => setActiveTab("signin")}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'signin' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Sign In
            {activeTab === 'signin' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-gold" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("signup")}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'signup' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Register
            {activeTab === 'signup' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-gold" />
            )}
          </button>
        </div>

        <div className="p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {activeTab === "signup" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-1"
                >
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Assigned Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="e.g. Agent Miller"
                      className="w-full bg-dark-800 border border-glass-border rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-accent-gold/40 focus:outline-none transition-colors"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Secure Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="email" 
                  placeholder="agent@geointel.org"
                  className="w-full bg-dark-800 border border-glass-border rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-accent-gold/40 focus:outline-none transition-colors"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Encryption Key</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="password" 
                  placeholder="••••••••••••"
                  className="w-full bg-dark-800 border border-glass-border rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-accent-gold/40 focus:outline-none transition-colors"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-accent-gold to-accent-amber text-dark-900 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest mt-6 flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin" />
                  Verifying Identity...
                </>
              ) : (
                <>
                  {activeTab === 'signin' ? 'Unlock Access' : 'Initialize Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo User Section */}
          <div className="mt-8 border-t border-glass-border pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px bg-glass-border flex-1"></div>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Rapid Access</span>
              <div className="h-px bg-glass-border flex-1"></div>
            </div>
            
            <button 
              onClick={handleDemoLogin}
              className="w-full bg-blue-500/10 border border-blue-500/20 text-blue-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-500/20 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              Bypass with Demo Account (Manager Access)
            </button>
          </div>
        </div>

        <div className="p-6 bg-dark-800/50 border-t border-glass-border text-center">
          <Link href="/" className="text-[10px] text-gray-500 hover:text-accent-gold transition-colors font-bold uppercase tracking-widest">
            ← Return to Public Terminal
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-900 flex items-center justify-center text-accent-gold font-mono uppercase tracking-[0.5em] animate-pulse">Initializing Security Protocol...</div>}>
      <AuthContent />
    </Suspense>
  );
}
