import React from 'react';
import { Heart, Building2, Droplet, User, Sparkles, Activity } from 'lucide-react';

export const NetworkVisualization: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto bg-gradient-to-b from-neutral-900/90 to-neutral-950/95 border border-rose-950/40 rounded-2xl p-6 shadow-2xl overflow-hidden backdrop-blur-md text-white">
      
      {/* Background Subtle Medical Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(244,63,94,0.3) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Floating subtle blood drop particles */}
      <div className="absolute top-4 right-6 text-rose-500/30 animate-float-slow pointer-events-none">
        <Droplet className="w-5 h-5 fill-rose-500/20" />
      </div>
      <div className="absolute bottom-8 left-6 text-rose-500/25 animate-float-reverse pointer-events-none">
        <Droplet className="w-6 h-6 fill-rose-500/20" />
      </div>
      <div className="absolute top-1/2 right-4 text-rose-500/20 animate-float-slow pointer-events-none">
        <Droplet className="w-4 h-4 fill-rose-500/15" />
      </div>

      {/* Top Header with live status */}
      <div className="relative z-10 flex items-center justify-between border-b border-neutral-800 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-mono font-semibold tracking-wider uppercase text-neutral-300">
            Intelligent Blood Routing
          </span>
        </div>
        <div className="text-[11px] font-mono text-rose-400 bg-rose-950/60 border border-rose-900/50 px-2 py-0.5 rounded">
          Cold-Chain Active
        </div>
      </div>

      {/* Heartbeat EKG SVG line */}
      <div className="relative z-10 w-full h-8 mb-5 overflow-hidden flex items-center">
        <svg className="w-full h-8" viewBox="0 0 360 32" fill="none">
          <path
            d="M 0 16 L 90 16 L 105 4 L 115 28 L 125 10 L 135 22 L 145 16 L 210 16 L 225 4 L 235 28 L 245 10 L 255 22 L 265 16 L 360 16"
            stroke="#e11d48"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-ekg"
          />
        </svg>
      </div>

      {/* Healthcare Network Flow Nodes */}
      <div className="relative z-10 space-y-3">
        
        {/* Node 1: DONOR */}
        <div className="flex items-center gap-4 bg-neutral-900/80 border border-neutral-800 hover:border-rose-700/60 p-3 rounded-xl transition-all group">
          <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400 shrink-0 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-rose-500/40 text-rose-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">1. Registered Donor</h4>
              <span className="text-[10px] text-emerald-400 font-mono">Verified Match</span>
            </div>
            <p className="text-[11px] text-neutral-400 truncate">Voluntary donation & emergency mobile drive intake</p>
          </div>
        </div>

        {/* Animated Connecting Arrow 1 */}
        <div className="flex justify-center items-center py-0.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-rose-500">
            <span className="w-1 h-1 rounded-full bg-rose-500 animate-ping"></span>
            <span className="w-1 h-3 border-l-2 border-dashed border-rose-600/70"></span>
            <span className="w-1 h-1 rounded-full bg-rose-500 animate-ping"></span>
          </div>
        </div>

        {/* Node 2: BLOOD BANK */}
        <div className="flex items-center gap-4 bg-neutral-900/80 border border-neutral-800 hover:border-rose-700/60 p-3 rounded-xl transition-all group">
          <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400 shrink-0 group-hover:scale-105 transition-transform">
            <Droplet className="w-5 h-5 fill-rose-500/40 text-rose-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">2. Certified Blood Bank</h4>
              <span className="text-[10px] text-rose-400 font-mono">4°C Cold Storage</span>
            </div>
            <p className="text-[11px] text-neutral-400 truncate">Component fractionation, screening & expiry guard</p>
          </div>
        </div>

        {/* Animated Connecting Arrow 2 */}
        <div className="flex justify-center items-center py-0.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-rose-500">
            <span className="w-1 h-1 rounded-full bg-rose-500 animate-ping"></span>
            <span className="w-1 h-3 border-l-2 border-dashed border-rose-600/70"></span>
            <span className="w-1 h-1 rounded-full bg-rose-500 animate-ping"></span>
          </div>
        </div>

        {/* Node 3: HOSPITAL */}
        <div className="flex items-center gap-4 bg-neutral-900/80 border border-neutral-800 hover:border-rose-700/60 p-3 rounded-xl transition-all group">
          <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400 shrink-0 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 text-rose-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">3. Hospital Command</h4>
              <span className="text-[10px] text-amber-400 font-mono">ICU & Surgeries</span>
            </div>
            <p className="text-[11px] text-neutral-400 truncate">Rapid crossmatch, trauma triage & ward distribution</p>
          </div>
        </div>

        {/* Animated Connecting Arrow 3 */}
        <div className="flex justify-center items-center py-0.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-rose-500">
            <span className="w-1 h-1 rounded-full bg-rose-500 animate-ping"></span>
            <span className="w-1 h-3 border-l-2 border-dashed border-rose-600/70"></span>
            <span className="w-1 h-1 rounded-full bg-rose-500 animate-ping"></span>
          </div>
        </div>

        {/* Node 4: PATIENT */}
        <div className="flex items-center gap-4 bg-neutral-900/80 border border-neutral-800 hover:border-rose-700/60 p-3 rounded-xl transition-all group">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
            <User className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">4. Recovering Patient</h4>
              <span className="text-[10px] text-emerald-400 font-mono">Life Restored</span>
            </div>
            <p className="text-[11px] text-neutral-400 truncate">Thalassemia monthly lock & trauma emergency care</p>
          </div>
        </div>

      </div>

      {/* Network Micro-Telemetry Bar */}
      <div className="relative z-10 mt-5 pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          AI Shortage Prediction
        </span>
        <span className="text-emerald-400 font-semibold">100% Interconnected</span>
      </div>

    </div>
  );
};
