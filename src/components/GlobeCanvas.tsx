"use client";

import { useEffect, useRef, useCallback } from "react";

interface CountryDot {
  name: string;
  lat: number;
  lng: number;
  risk: "critical" | "high" | "medium" | "low";
  color: string;
  glowColor: string;
  x?: number;
  y?: number;
}

const COUNTRY_DOTS: CountryDot[] = [
  { name: "Russia", lat: 55.75, lng: 37.62, risk: "high", color: "#3498db", glowColor: "rgba(52,152,219,0.5)" },
  { name: "USA", lat: 38.9, lng: -77.04, risk: "medium", color: "#e74c3c", glowColor: "rgba(231,76,60,0.5)" },
  { name: "China", lat: 39.9, lng: 116.4, risk: "high", color: "#f39c12", glowColor: "rgba(243,156,18,0.5)" },
  { name: "Iran", lat: 35.69, lng: 51.39, risk: "critical", color: "#e8a838", glowColor: "rgba(232,168,56,0.5)" },
  { name: "North Korea", lat: 39.02, lng: 125.75, risk: "critical", color: "#e74c3c", glowColor: "rgba(231,76,60,0.5)" },
  { name: "Israel", lat: 31.77, lng: 35.23, risk: "critical", color: "#e74c3c", glowColor: "rgba(231,76,60,0.5)" },
  { name: "India", lat: 28.61, lng: 77.21, risk: "low", color: "#2ecc71", glowColor: "rgba(46,204,113,0.5)" },
  { name: "Yemen", lat: 15.37, lng: 44.19, risk: "critical", color: "#e74c3c", glowColor: "rgba(231,76,60,0.5)" },
  { name: "Nigeria", lat: 9.06, lng: 7.49, risk: "high", color: "#f39c12", glowColor: "rgba(243,156,18,0.5)" },
  { name: "Ukraine", lat: 50.45, lng: 30.52, risk: "critical", color: "#e74c3c", glowColor: "rgba(231,76,60,0.5)" },
  { name: "Taiwan", lat: 25.03, lng: 121.57, risk: "high", color: "#f39c12", glowColor: "rgba(243,156,18,0.5)" },
  { name: "Brazil", lat: -15.79, lng: -47.88, risk: "low", color: "#2ecc71", glowColor: "rgba(46,204,113,0.5)" },
  { name: "UK", lat: 51.51, lng: -0.13, risk: "low", color: "#3498db", glowColor: "rgba(52,152,219,0.5)" },
  { name: "Syria", lat: 33.51, lng: 36.29, risk: "critical", color: "#e74c3c", glowColor: "rgba(231,76,60,0.5)" },
  { name: "Pakistan", lat: 33.69, lng: 73.04, risk: "high", color: "#f39c12", glowColor: "rgba(243,156,18,0.5)" },
  { name: "South Africa", lat: -25.75, lng: 28.19, risk: "medium", color: "#e8a838", glowColor: "rgba(232,168,56,0.5)" },
  { name: "Australia", lat: -35.28, lng: 149.13, risk: "low", color: "#2ecc71", glowColor: "rgba(46,204,113,0.5)" },
  { name: "Japan", lat: 35.68, lng: 139.69, risk: "low", color: "#3498db", glowColor: "rgba(52,152,219,0.5)" },
  { name: "Germany", lat: 52.52, lng: 13.41, risk: "low", color: "#3498db", glowColor: "rgba(52,152,219,0.5)" },
  { name: "Mexico", lat: 19.43, lng: -99.13, risk: "medium", color: "#e8a838", glowColor: "rgba(232,168,56,0.5)" },
];

export default function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const rotationRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const starsRef = useRef<{ x: number; y: number; size: number; opacity: number; twinkleSpeed: number }[]>([]);

  const latLngTo3D = useCallback(
    (lat: number, lng: number, radius: number, rotation: number) => {
      const phi = ((90 - lat) * Math.PI) / 180;
      const theta = ((lng + rotation) * Math.PI) / 180;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      return { x, y, z };
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Generate stars
      if (starsRef.current.length === 0) {
        starsRef.current = Array.from({ length: 120 }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.6 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
        }));
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    const drawGlobe = (time: number) => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.35;

      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.8);
      bgGrad.addColorStop(0, "rgba(15, 25, 50, 0.4)");
      bgGrad.addColorStop(0.5, "rgba(10, 14, 23, 0.6)");
      bgGrad.addColorStop(1, "rgba(10, 14, 23, 0.9)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Stars
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 200, 230, ${star.opacity * twinkle})`;
        ctx.fill();
      });

      // Slow rotation with mouse influence
      const mouseInfluence = (mouseRef.current.x / w - 0.5) * 15;
      rotationRef.current += 0.08;
      const rotation = rotationRef.current + mouseInfluence;

      // Globe glow
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.4);
      glowGrad.addColorStop(0, "rgba(30, 60, 120, 0.08)");
      glowGrad.addColorStop(0.5, "rgba(20, 40, 80, 0.04)");
      glowGrad.addColorStop(1, "transparent");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Draw latitude lines
      ctx.strokeStyle = "rgba(80, 120, 180, 0.1)";
      ctx.lineWidth = 0.6;
      for (let lat = -80; lat <= 80; lat += 20) {
        const phi = ((90 - lat) * Math.PI) / 180;
        const r = radius * Math.sin(phi);
        const yPos = cy - radius * Math.cos(phi);
        ctx.beginPath();
        ctx.ellipse(cx, yPos, r, r * 0.15, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw longitude lines
      for (let lng = 0; lng < 360; lng += 20) {
        ctx.beginPath();
        const adjustedLng = lng + rotation;
        for (let lat = -90; lat <= 90; lat += 2) {
          const pos = latLngTo3D(lat, adjustedLng - rotation, radius, rotation);
          const screenX = cx + pos.x;
          const screenY = cy - pos.y;
          if (pos.z > 0) {
            if (lat === -90) {
              ctx.moveTo(screenX, screenY);
            } else {
              ctx.lineTo(screenX, screenY);
            }
          } else {
            ctx.moveTo(screenX, screenY);
          }
        }
        ctx.strokeStyle = "rgba(80, 120, 180, 0.07)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Globe outline
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(80, 130, 200, 0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw country dots
      const dotsWithDepth: (CountryDot & { screenX: number; screenY: number; z: number; scale: number })[] = [];
      
      COUNTRY_DOTS.forEach((dot) => {
        const pos = latLngTo3D(dot.lat, dot.lng, radius, rotation);
        if (pos.z > -radius * 0.1) {
          const depthFactor = (pos.z + radius) / (2 * radius);
          const scale = 0.4 + depthFactor * 0.6;
          dotsWithDepth.push({
            ...dot,
            screenX: cx + pos.x,
            screenY: cy - pos.y,
            z: pos.z,
            scale,
          });
        }
      });

      // Sort by z for proper layering
      dotsWithDepth.sort((a, b) => a.z - b.z);

      dotsWithDepth.forEach((dot) => {
        const pulse = Math.sin(time * 0.003 + dot.screenX * 0.01) * 0.3 + 0.7;
        const baseSize = dot.risk === "critical" ? 6 : dot.risk === "high" ? 5 : 4;
        const size = baseSize * dot.scale;

        // Outer glow
        const glowSize = size * 4 * pulse;
        const glow = ctx.createRadialGradient(
          dot.screenX, dot.screenY, 0,
          dot.screenX, dot.screenY, glowSize
        );
        glow.addColorStop(0, dot.glowColor);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(dot.screenX, dot.screenY, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Inner dot
        ctx.beginPath();
        ctx.arc(dot.screenX, dot.screenY, size, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.globalAlpha = dot.scale;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Bright center
        ctx.beginPath();
        ctx.arc(dot.screenX, dot.screenY, size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.globalAlpha = dot.scale * 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Label (only for visible dots)
        if (dot.scale > 0.6) {
          ctx.font = `${Math.round(10 * dot.scale)}px Inter, sans-serif`;
          ctx.fillStyle = `rgba(200, 210, 230, ${dot.scale * 0.8})`;
          ctx.textAlign = "left";
          ctx.fillText(dot.name, dot.screenX + size + 6, dot.screenY + 3);
        }
      });

      animFrameRef.current = requestAnimationFrame(drawGlobe);
    };

    animFrameRef.current = requestAnimationFrame(drawGlobe);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [latLngTo3D]);

  return <canvas ref={canvasRef} className="globe-canvas" />;
}
