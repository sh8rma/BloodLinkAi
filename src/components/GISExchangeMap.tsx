import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Truck, 
  Building2, 
  Users, 
  Navigation, 
  Thermometer, 
  Clock, 
  Phone, 
  Layers,
  ArrowRight,
  Shield,
  Activity
} from 'lucide-react';
import { Facility, BloodTransfer, Donor, BloodGroup } from '../types/bloodlink';

interface GISExchangeMapProps {
  facilities: Facility[];
  transfers: BloodTransfer[];
  donors: Donor[];
  onDispatchTransfer: (fromFacId: string, toFacId: string, group: BloodGroup, units: number) => void;
}

export const GISExchangeMap: React.FC<GISExchangeMapProps> = ({
  facilities,
  transfers,
  donors,
  onDispatchTransfer
}) => {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(facilities[0] || null);
  const [selectedTransfer, setSelectedTransfer] = useState<BloodTransfer | null>(transfers[0] || null);
  const [filterLayer, setFilterLayer] = useState<'all' | 'hospitals' | 'bloodbanks' | 'transits'>('all');

  // Interactive map nodes mapping relative coordinates for nationwide visualization
  // Delhi (North), Mumbai (West), Bengaluru (South), Hyderabad (South-Central)
  const mapNodes = facilities.map(f => {
    let x = 250;
    let y = 150;

    if (f.city.includes('Delhi')) {
      x = 220 + (f.id === 'fac-1' ? -20 : 25);
      y = 120 + (f.id === 'fac-1' ? -15 : 20);
    } else if (f.city.includes('Mumbai')) {
      x = 150 + (f.id === 'fac-3' ? 20 : -15);
      y = 310 + (f.id === 'fac-3' ? -10 : 25);
    } else if (f.city.includes('Bengaluru')) {
      x = 220 + (f.id === 'fac-5' ? 20 : -20);
      y = 440 + (f.id === 'fac-5' ? -15 : 20);
    } else if (f.city.includes('Hyderabad')) {
      x = 260;
      y = 340;
    }

    return { ...f, mapX: x, mapY: y };
  });

  return (
    <div className="space-y-6">
      
      {/* 1. Header with Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
            <span>Spatial Telemetry & Logistics Network</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Cold-Chain Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>Smart Geographic Blood Exchange Network</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-3xl">
            Live geospatial topology showing hospital hubs, certified blood banks, active GPS couriers with real-time temperature telemetry, and donor clusters.
          </p>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-medium">
          {[
            { id: 'all', label: 'All Nodes' },
            { id: 'hospitals', label: 'Hospitals' },
            { id: 'bloodbanks', label: 'Blood Banks' },
            { id: 'transits', label: 'Active Couriers' },
          ].map(l => (
            <button
              key={l.id}
              onClick={() => setFilterLayer(l.id as any)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filterLayer === l.id
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-semibold shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive Map Container & Real-time Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Vector GIS Map Canvas */}
        <div className="lg:col-span-2 bg-neutral-900 rounded-xl border border-neutral-800 p-5 shadow-lg relative min-h-[500px] flex flex-col justify-between overflow-hidden">
          
          {/* Top Map HUD */}
          <div className="flex items-center justify-between z-10 text-xs font-mono">
            <div className="flex items-center gap-2 bg-neutral-950/80 px-3 py-1 rounded-lg border border-neutral-800 text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>GRID STATUS: 6 COURIERS DISPATCHED</span>
            </div>

            <div className="flex items-center gap-3 bg-neutral-950/80 px-3 py-1 rounded-lg border border-neutral-800 text-[11px] text-neutral-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Hospital
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Blood Bank
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> In Transit
              </span>
            </div>
          </div>

          {/* SVG Canvas depicting Network Corridors */}
          <div className="my-auto py-4 w-full h-[400px] flex items-center justify-center">
            <svg className="w-full h-full max-w-[500px]" viewBox="0 0 500 550">
              <defs>
                <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Geographic abstract territory lines */}
              <path
                d="M 180 60 Q 220 40, 260 60 T 310 140 T 360 220 T 320 320 T 260 480 T 210 520 T 170 420 T 120 300 T 130 180 Z"
                fill="#171717"
                stroke="#262626"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* Inter-City Logistics Corridors (Delhi <-> Mumbai <-> Bengaluru <-> Hyderabad) */}
              <line x1="220" y1="120" x2="160" y2="310" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
              <line x1="160" y1="310" x2="220" y2="440" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
              <line x1="220" y1="120" x2="260" y2="340" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
              <line x1="260" y1="340" x2="220" y2="440" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />

              {/* Active Transfer Couriers Moving along Routes */}
              {transfers.map((t, idx) => {
                // Simulated vehicle position
                const startX = 220;
                const startY = 120;
                const endX = 245;
                const endY = 140;

                return (
                  <g 
                    key={t.id} 
                    className="cursor-pointer"
                    onClick={() => setSelectedTransfer(t)}
                  >
                    <line 
                      x1={startX} 
                      y1={startY} 
                      x2={endX} 
                      y2={endY} 
                      stroke="#10b981" 
                      strokeWidth="2.5" 
                      strokeDasharray="4 2"
                    />
                    <circle cx={(startX + endX) / 2} cy={(startY + endY) / 2} r="6" fill="#10b981" className="animate-pulse" />
                    <text x={(startX + endX) / 2 + 10} y={(startY + endY) / 2 + 4} fill="#10b981" fontSize="10" fontFamily="monospace">
                      ETA {t.estimatedArrivalMinutes}m ({t.currentTempCelsius}°C)
                    </text>
                  </g>
                );
              })}

              {/* Facility Nodes */}
              {mapNodes.map((node) => {
                if (filterLayer === 'hospitals' && node.type !== 'hospital') return null;
                if (filterLayer === 'bloodbanks' && node.type !== 'blood_bank') return null;

                const isSelected = selectedFacility?.id === node.id;
                const isHospital = node.type === 'hospital';
                const fillColor = isHospital ? '#e11d48' : '#6366f1';

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setSelectedFacility(node)}
                  >
                    {isSelected && (
                      <circle cx={node.mapX} cy={node.mapY} r="18" fill="none" stroke="#f43f5e" strokeWidth="1.5" className="animate-ping" opacity="0.6" />
                    )}

                    <circle
                      cx={node.mapX}
                      cy={node.mapY}
                      r={isSelected ? "9" : "7"}
                      fill={fillColor}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    <text
                      x={node.mapX + 12}
                      y={node.mapY + 4}
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight={isSelected ? "bold" : "normal"}
                      className="select-none"
                    >
                      {node.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Zoom & Legend Controls */}
          <div className="flex items-center justify-between z-10 text-[11px] text-neutral-400 font-mono border-t border-neutral-800 pt-3">
            <span>Projection: National High-Resolution Healthcare Coordinate Grid</span>
            <span>Click any node or vehicle to inspect telemetry</span>
          </div>

        </div>

        {/* Right Col: Telemetry Inspector Card */}
        <div className="space-y-4">
          
          {/* Active Courier Telemetry (When a transfer is selected or default) */}
          {selectedTransfer && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    Live Courier Telemetry
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  {selectedTransfer.status}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="text-[10px] text-neutral-400">Cargo Payload</div>
                  <div className="font-bold text-rose-600 font-mono text-sm">
                    {selectedTransfer.units} units {selectedTransfer.bloodGroup} ({selectedTransfer.component})
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 font-mono">
                  <div>
                    <div className="text-[10px] text-neutral-400">Cold-Chain Temp</div>
                    <div className="text-sm font-bold text-emerald-600 tabular-nums">
                      {selectedTransfer.currentTempCelsius}°C (Nominal)
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-400">Estimated ETA</div>
                    <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                      {selectedTransfer.estimatedArrivalMinutes} minutes
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-500 space-y-1">
                  <div><strong>From:</strong> {selectedTransfer.fromFacilityName}</div>
                  <div><strong>To:</strong> {selectedTransfer.toFacilityName}</div>
                  <div><strong>Vehicle Plate:</strong> <span className="font-mono">{selectedTransfer.vehiclePlate}</span></div>
                  <div><strong>Driver Contact:</strong> <span className="font-mono">{selectedTransfer.driverPhone}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Selected Facility Inspector */}
          {selectedFacility && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {selectedFacility.name}
                  </h3>
                  <div className="text-[11px] text-neutral-500">
                    {selectedFacility.city}, {selectedFacility.state}
                  </div>
                </div>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
                  selectedFacility.type === 'hospital' 
                    ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/60' 
                    : 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60'
                }`}>
                  {selectedFacility.type === 'hospital' ? 'Hospital Hub' : 'Blood Bank'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Current Inventory Snapshot:
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-center">
                  {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map(g => (
                    <div key={g} className="p-1.5 rounded bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700 text-xs">
                      <div className="font-bold text-[11px] text-neutral-700 dark:text-neutral-300">{g}</div>
                      <div className={`font-mono font-bold tabular-nums ${selectedFacility.inventory[g] < 15 ? 'text-rose-600' : 'text-neutral-900 dark:text-neutral-100'}`}>
                        {selectedFacility.inventory[g]}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onDispatchTransfer(facilities[0].id, selectedFacility.id, 'O-', 2)}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Dispatch Cold-Chain Units to Here</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
