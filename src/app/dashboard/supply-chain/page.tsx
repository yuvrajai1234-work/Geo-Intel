"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Ship, 
  Map as MapIcon, 
  ChevronDown, 
  Plus, 
  Minus, 
  Maximize, 
  Crosshair,
  Navigation,
  Globe,
  Anchor,
  ArrowRight,
  Activity,
  Cpu,
  ShieldAlert,
  Radio
} from "lucide-react";
import { supplyRoutes, getRiskColor } from "@/lib/mockData";

// Detailed World Silhouette Paths
const CONTINENTS = [
  { name: 'NA', path: [[-168,70], [-100,75], [-50,55], [-70,10], [-100,20], [-130,50]] },
  { name: 'SA', path: [[-80,12], [-35,-15], [-70,-55], [-85,-10]] },
  { name: 'EU', path: [[-10,60], [10,65], [40,65], [50,45], [20,35], [0,35]] },
  { name: 'AF', path: [[-15,35], [25,35], [50,10], [50,0], [35,-35], [15,-35], [-10,-10]] },
  { name: 'AS', path: [[40,65], [140,70], [180,60], [145,20], [120,-10], [80,10], [40,40]] },
  { name: 'AU', path: [[113,-12], [153,-12], [153,-38], [113,-38]] },
  { name: 'GR', path: [[-55,83], [-25,83], [-35,65], [-65,70]] }
];

const MAJOR_CITIES = [
  { name: 'Chicago', lat: 41.87, lng: -87.62, risk: 'low' },
  { name: 'Washington D.C.', lat: 38.90, lng: -77.03, risk: 'low' },
  { name: 'London', lat: 51.50, lng: -0.12, risk: 'low' },
  { name: 'Paris', lat: 48.85, lng: 2.35, risk: 'low' },
  { name: 'Riyadh', lat: 24.71, lng: 46.67, risk: 'high' },
  { name: 'Cape Town', lat: -33.92, lng: 18.42, risk: 'medium' },
  { name: 'Singapore', lat: 1.35, lng: 103.81, risk: 'medium' },
  { name: 'Mumbai', lat: 19.07, lng: 72.87, risk: 'low' },
];

function MasterTheatreMap({ 
  zoom, setZoom, offset, setOffset, 
  isDragging, setIsDragging, lastMousePos, setLastMousePos, 
  selectedRouteId, setSelectedRouteId, isDropdownOpen, setIsDropdownOpen, 
  scanPos, setScanPos, triggerRecalculate, isRecalculating 
}: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Projection Logic
  const project = useCallback((lat: number, lng: number, localZoom = zoom, localOffset = offset, w: number, h: number) => {
    let x = ((lng + 180) / 360) * w;
    let y = ((90 - lat) / 180) * h;
    const centerX = w / 2;
    const centerY = h / 2;
    x = centerX + (x - centerX) * localZoom + localOffset.x;
    y = centerY + (y - centerY) * localZoom + localOffset.y;
    return { x, y };
  }, [zoom, offset]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const time = Date.now();

    // 1. Background Layers (Parallax)
    ctx.strokeStyle = "rgba(100, 150, 255, 0.02)";
    ctx.lineWidth = 1;
    const gridStep = 50 * zoom;
    for(let i = offset.x % gridStep; i < w; i += gridStep) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for(let i = offset.y % gridStep; i < h; i += gridStep) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

    // 2. Continents Shadow (Depth)
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    CONTINENTS.forEach(c => {
        ctx.beginPath();
        c.path.forEach((p_coord, idx) => {
            const p = project(p_coord[1], p_coord[0], zoom, { x: offset.x + 4, y: offset.y + 4 }, w, h);
            if(idx === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.fill();
    });

    // 3. Main Continents (Holographic Steel)
    CONTINENTS.forEach(c => {
        const p_start = project(c.path[0][1], c.path[0][0], zoom, offset, w, h);
        const grad = ctx.createLinearGradient(p_start.x, p_start.y, p_start.x + 200, p_start.y + 200);
        grad.addColorStop(0, "#1a1c22");
        grad.addColorStop(1, "#111215");
        ctx.fillStyle = grad;
        ctx.strokeStyle = "rgba(100,165,255,0.1)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        c.path.forEach((p_coord, idx) => {
            const p = project(p_coord[1], p_coord[0], zoom, offset, w, h);
            if(idx === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    });

    // 4. Dot-Map Matrix (Active Nodes)
    ctx.fillStyle = "rgba(100, 165, 255, 0.04)";
    const dotSpacing = Math.max(3, 4 / zoom);
    for (let lg = -180; lg < 180; lg += 6) {
        for (let lt = -60; lt < 80; lt += 6) {
            const p = project(lt, lg, zoom, offset, w, h);
            if (p.x > 0 && p.x < w && p.y > 0 && p.y < h) {
                const distToScan = Math.abs(p.x - scanPos);
                const scanHighlight = Math.max(0, 1 - distToScan / 100);
                if (scanHighlight > 0) {
                    ctx.fillStyle = `rgba(100, 200, 255, ${0.05 + scanHighlight * 0.2})`;
                } else {
                    ctx.fillStyle = "rgba(100, 165, 255, 0.04)";
                }
                ctx.beginPath();
                ctx.arc(p.x, p.y, 0.5 * zoom, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // 5. Routes (Neon Arcs)
    supplyRoutes.forEach((route) => {
      const start = project(route.from.lat, route.from.lng, zoom, offset, w, h);
      const end = project(route.to.lat, route.to.lng, zoom, offset, w, h);
      const isVisible = selectedRouteId === 'all' || route.id === selectedRouteId;
      const color = route.status === "active" ? "#c8a55a" : "#ff4444";

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2 - 50 * zoom; 
      ctx.quadraticCurveTo(midX, midY, end.x, end.y);
      
      ctx.strokeStyle = isVisible ? color : "rgba(100,100,100,0.1)";
      ctx.lineWidth = (isVisible ? 1.5 : 0.4) * Math.sqrt(zoom);
      ctx.shadowBlur = isVisible ? 10 : 0;
      ctx.shadowColor = color;
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (isVisible) {
        const t = (time % 4000) / 4000;
        const tx = (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * midX + t * t * end.x;
        const ty = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * midY + t * t * end.y;
        
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(tx, ty, 2.5 * zoom, 0, Math.PI * 2); ctx.fill();
        
        // Ripple
        ctx.strokeStyle = color;
        ctx.beginPath(); ctx.arc(tx, ty, 5 * zoom * (1 + (time % 500) / 500), 0, Math.PI * 2); 
        ctx.globalAlpha = 1 - (time % 500) / 500;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }
    });

    // 6. Cities & Data Leader HUDs
    MAJOR_CITIES.forEach((city) => {
      const pos = project(city.lat, city.lng, zoom, offset, w, h);
      const isRight = city.lng > 0;
      
      // Node Dot
      ctx.fillStyle = city.risk === 'high' ? "#ff4444" : "#ffcc00";
      ctx.beginPath(); ctx.arc(pos.x, pos.y, 2.5 * zoom, 0, Math.PI * 2); ctx.fill();
      
      if (zoom > 1.2) {
          const hudX = pos.x + (isRight ? 30 : -30) * zoom;
          const hudY = pos.y - 40 * zoom;

          // Leader Line (Polygonal)
          ctx.strokeStyle = "rgba(255,255,255,0.2)";
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
          ctx.lineTo(pos.x + (isRight ? 10 : -10) * zoom, pos.y - 10 * zoom);
          ctx.lineTo(hudX, hudY);
          ctx.stroke();

          // Text Box
          ctx.fillStyle = "rgba(10,12,15,0.8)";
          ctx.strokeStyle = "rgba(255,255,255,0.1)";
          const boxW = 80 * zoom;
          const boxH = 30 * zoom;
          const boxX = isRight ? hudX : hudX - boxW;
          const boxY = hudY - boxH / 2;
          ctx.beginPath(); ctx.roundRect(boxX, boxY, boxW, boxH, 4 * zoom); ctx.fill(); ctx.stroke();
          
          ctx.fillStyle = "white";
          ctx.font = `bold ${Math.max(8, 9 * zoom)}px JetBrains Mono`;
          ctx.textAlign = "left";
          ctx.fillText(city.name, boxX + 8 * zoom, boxY + 12 * zoom);
          
          ctx.fillStyle = city.risk === 'high' ? "#ff4444" : "#2ecc71";
          ctx.font = `${Math.max(6, 7 * zoom)}px JetBrains Mono`;
          ctx.fillText(city.risk.toUpperCase() + " RISK AREA", boxX + 8 * zoom, boxY + 22 * zoom);
      }
    });

    // 7. Scanning HUD Scanline
    setScanPos((prev: number) => (prev + 2) % w);
    ctx.strokeStyle = "rgba(100, 200, 255, 0.05)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(scanPos, 0); ctx.lineTo(scanPos, h); ctx.stroke();

  }, [zoom, offset, selectedRouteId, scanPos, project]);

  useEffect(() => {
    const frame = requestAnimationFrame(function loop() { draw(); requestAnimationFrame(loop); });
    return () => cancelAnimationFrame(frame);
  }, [draw]);

  return (
    <div 
      className="relative w-full h-[650px] glass-card overflow-hidden bg-[#0a0b0e] cursor-crosshair border-[#222] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      onWheel={(e) => setZoom((prev: number) => Math.max(0.5, Math.min(10, prev * (e.deltaY > 0 ? 0.95 : 1.05))))}
      onMouseDown={(e) => { setIsDragging(true); setLastMousePos({ x: e.clientX, y: e.clientY }); }}
      onMouseMove={(e) => {
        if (!isDragging) return;
        setOffset((prev: { x: number, y: number }) => ({ x: prev.x + (e.clientX - lastMousePos.x), y: prev.y + (e.clientY - lastMousePos.y) }));
        setLastMousePos({ x: e.clientX, y: e.clientY });
      }}
      onMouseUp={() => setIsDragging(false)}
    >
      {/* HUD Header */}
      <div className="absolute top-10 left-10 z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Global Theatre</h3>
            <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                    <Radio className="w-3 h-3 text-blue-500 animate-pulse" />
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">SigInt Uplink Active</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                    <ShieldAlert className="w-3 h-3 text-red-500" />
                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Global Conflict Alert</span>
                </div>
            </div>
        </motion.div>
      </div>

      {/* Floating Controls */}
      <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
        <div className="flex flex-col gap-1 p-1.5 bg-[#111]/90 backdrop-blur-md border border-[#222] rounded-2xl shadow-2xl">
            <button onClick={() => setZoom((p: number) => Math.min(10, p * 1.5))} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white transition-colors"><Plus size={16}/></button>
            <div className="w-full h-px bg-[#222]" />
            <button onClick={() => setZoom((p: number) => Math.max(0.2, p * 0.7))} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white transition-colors"><Minus size={16}/></button>
            <div className="w-full h-px bg-[#222]" />
            <button onClick={() => { setZoom(1); setOffset({x:0,y:0})}} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white transition-colors"><Maximize size={16}/></button>
        </div>

        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#111]/90 backdrop-blur-md border border-[#222] rounded-2xl text-[9px] font-black uppercase tracking-widest text-white shadow-2xl hover:border-accent-gold/50 transition-all group"
        >
          <div className="flex items-center gap-2">
            <Crosshair className="w-3.5 h-3.5 text-accent-gold group-hover:rotate-90 transition-transform" />
            {selectedRouteId === 'all' ? 'Theater Scan' : supplyRoutes.find(r => r.id === selectedRouteId)?.name}
          </div>
          <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
            {isDropdownOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-[#111]/95 backdrop-blur-xl border border-[#222] rounded-2xl py-2 shadow-3xl overflow-hidden">
                    <button onClick={() => {setSelectedRouteId('all'); setIsDropdownOpen(false)}} className="w-full text-left px-5 py-2 text-[9px] font-black text-gray-500 hover:text-white hover:bg-white/5 uppercase transition-all">Full Theater</button>
                    {supplyRoutes.map(r => (
                        <button key={r.id} onClick={() => {setSelectedRouteId(r.id); setIsDropdownOpen(false)}} className="w-full text-left px-5 py-2 text-[9px] font-black text-gray-500 hover:text-white hover:bg-white/5 uppercase transition-all">{r.name}</button>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* HUD Analytics Bottom */}
      <div className="absolute bottom-10 inset-x-10 flex justify-between items-end pointer-events-none">
        <div className="flex gap-12 p-8 rounded-[3rem] bg-[#0c0d11]/90 backdrop-blur-3xl border border-[#222] pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div>
                <p className="text-[9px] font-black text-gray-600 uppercase mb-2 tracking-widest">System Scale</p>
                <p className="text-xl font-black text-accent-gold italic">{zoom.toFixed(2)}<span className="text-xs">x</span></p>
            </div>
            <div className="w-px h-12 bg-[#222]" />
            <div>
                <p className="text-[9px] font-black text-gray-600 uppercase mb-2 tracking-widest">Theater Coords</p>
                <div className="flex gap-4">
                    <div><span className="text-[8px] text-gray-500 font-bold">X:</span> <span className="text-sm font-black text-white font-mono">{offset.x.toFixed(0)}</span></div>
                    <div><span className="text-[8px] text-gray-500 font-bold">Y:</span> <span className="text-sm font-black text-white font-mono">{offset.y.toFixed(0)}</span></div>
                </div>
            </div>
            <div className="w-px h-12 bg-[#222]" />
            <div>
                <p className="text-[9px] font-black text-gray-600 uppercase mb-2 tracking-widest">Network Load</p>
                <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-[#111] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '42%' }} />
                    </div>
                    <span className="text-xs font-black text-blue-500">42%</span>
                </div>
            </div>
        </div>
        
        <div className="flex flex-col gap-4 pointer-events-auto">
            <button 
              onClick={triggerRecalculate}
              className={`p-6 rounded-[2.5rem] border backdrop-blur-md max-w-sm transition-all text-left ${
                isRecalculating ? 'bg-blue-500/20 border-blue-500/40' : 'bg-accent-gold/5 border-accent-gold/20 shadow-xl shadow-accent-gold/5'
              }`}
            >
                <div className="flex items-center gap-3 mb-2">
                    <Cpu className={`w-4 h-4 ${isRecalculating ? 'text-blue-500 animate-spin' : 'text-accent-gold'}`} />
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isRecalculating ? 'text-blue-500' : 'text-white'}`}>
                      {isRecalculating ? 'Neural Compute...' : 'Heuristic Update'}
                    </p>
                </div>
                <p className="text-xs text-gray-400 font-bold leading-relaxed">AI engine predicts a 14% increase in maritime insurance premiums for Red Sea lanes over next 48h.</p>
            </button>
        </div>
      </div>
    </div>
  );
}

export default function SupplyChainPage() {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [selectedRouteId, setSelectedRouteId] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scanPos, setScanPos] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);

  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2500);
  };

  const triggerRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => setIsRecalculating(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between px-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Supply Command</h1>
          <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.4em] mt-1">Operational Awareness Monitor • V4.2.0</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => alert("Generating Secure Intelligence Report...")}
            className="px-8 py-4 bg-[#111] border border-[#222] rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-white hover:bg-black transition-all"
          >
            Generate Intel Rep
          </button>
          <button 
            onClick={triggerSync}
            disabled={isSyncing}
            className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
              isSyncing ? 'bg-blue-500 text-white animate-pulse' : 'bg-accent-gold text-dark-900 shadow-2xl shadow-accent-gold/20'
            }`}
          >
             <Radio className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> 
             {isSyncing ? 'Synchronizing...' : 'Sync Satellite'}
          </button>
        </div>
      </div>

      <div className="relative">
        <MasterTheatreMap 
          zoom={zoom} setZoom={setZoom} 
          offset={offset} setOffset={setOffset} 
          isDragging={isDragging} setIsDragging={setIsDragging} 
          lastMousePos={lastMousePos} setLastMousePos={setLastMousePos} 
          selectedRouteId={selectedRouteId} setSelectedRouteId={setSelectedRouteId} 
          isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} 
          scanPos={scanPos} setScanPos={setScanPos} 
          triggerRecalculate={triggerRecalculate}
          isRecalculating={isRecalculating}
        />
        
        {/* Full-screen Sync Overlay */}
        <AnimatePresence>
          {isSyncing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-blue-500/10 backdrop-blur-sm pointer-events-none flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-xs font-black text-blue-500 uppercase tracking-[0.3em]">Downloading Satellite Telemetry...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 pb-12">
        <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between border-b border-[#222] pb-6">
                <div className="flex items-center gap-4">
                    <Activity size={24} className="text-blue-500" />
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Corridor Telemetry</h2>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    <span className="text-[10px] font-black text-white uppercase">Operational Status: Peak</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {supplyRoutes.map((route) => (
                <motion.div key={route.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="group relative glass-card p-8 bg-[#0c0d11] border-[#222] hover:border-accent-gold/40 transition-all duration-500 overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent-gold/5 rounded-full blur-3xl group-hover:bg-accent-gold/10 transition-all" />
                    
                    <div className="flex items-start justify-between mb-8">
                        <div className="p-4 bg-[#111] rounded-3xl border border-[#222] text-accent-gold shadow-2xl group-hover:border-accent-gold/30 transition-all">
                            <Anchor size={28} />
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${route.status === 'active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {route.status}
                        </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-white uppercase mb-2 tracking-tight group-hover:text-accent-gold transition-colors">{route.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-bold uppercase mb-8">
                        {route.from.name} <ArrowRight size={14} className="text-accent-gold" /> {route.to.name}
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[10px] font-black text-gray-700 uppercase mb-2 tracking-widest">Tonnage / 24H</p>
                            <p className="text-lg font-black text-white font-mono">{route.dailyVolume}</p>
                        </div>
                        <button className="flex items-center gap-2 text-[10px] font-black text-accent-gold uppercase tracking-tighter hover:gap-4 transition-all">
                            Open Intelligence Log <ArrowRight size={12} />
                        </button>
                    </div>
                </motion.div>
                ))}
            </div>
        </div>

        <div className="space-y-4">
            <div className="glass-card p-8 bg-[#0c0d11] border-[#222]">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-10 border-b border-[#222] pb-6">Global Choke Points</h3>
                <div className="space-y-10">
                    {[
                        { l: 'Northern Suez', v: 96, c: 'from-red-500 to-red-900', t: 'CRITICAL' },
                        { l: 'Bab-el-Mandeb', v: 82, c: 'from-orange-500 to-orange-900', t: 'HIGH' },
                        { l: 'Malacca Strait', v: 48, c: 'from-green-500 to-green-900', t: 'STABLE' },
                    ].map(cp => (
                        <div key={cp.l} className="group cursor-help" onClick={() => alert(`${cp.l} Detail: ${cp.t} risk detected using sig-int analysis.`)}>
                             <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{cp.l}</p>
                                    <p className={`text-[9px] font-black uppercase tracking-tighter ${cp.t === 'CRITICAL' ? 'text-red-500' : 'text-gray-400'}`}>{cp.t} RISK</p>
                                </div>
                                <span className="text-xl font-black text-white font-mono">{cp.v}%</span>
                             </div>
                             <div className="h-2 bg-[#111] rounded-full overflow-hidden border border-[#222]">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${cp.v}%` }} className={`h-full bg-gradient-to-r ${cp.c}`} />
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-8 rounded-[3rem] bg-gradient-to-br from-blue-900/10 via-[#0c0d11] to-transparent border border-blue-500/20 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 mb-6 border border-blue-500/30">
                    <Navigation size={24} />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-widest mb-4">Route Diversion AI</h3>
                <p className="text-xs text-gray-400 font-bold leading-relaxed uppercase mb-8">AI is calculating optimal freight detour via Cape of Good Hope for 14 active vessels.</p>
                
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Engine Processing...</span>
                </div>

                <button 
                  onClick={() => alert("AI Simulation started: Routing via Cape of Good Hope. Estimated delay +12 days. Cost impact +$450/TEU.")}
                  className="w-full mt-6 py-4 bg-accent-gold text-dark-900 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:brightness-110 relative z-10"
                >
                  Run AI Model
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
