import React, { useState } from 'react';
import { 
  ThermometerSnowflake, 
  Clock, 
  AlertOctagon, 
  Layers, 
  Truck, 
  CheckCircle2, 
  ShieldAlert, 
  Share2,
  Calendar,
  Building,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { Facility, BloodGroup, BloodTransfer } from '../types/bloodlink';

interface BloodBankPanelProps {
  facilities: Facility[];
  transfers: BloodTransfer[];
  onDispatchTransfer: (fromFacId: string, toFacId: string, group: BloodGroup, units: number) => void;
  onNavigateToTab: (tab: string) => void;
}

export const BloodBankPanel: React.FC<BloodBankPanelProps> = ({
  facilities,
  transfers,
  onDispatchTransfer,
  onNavigateToTab
}) => {
  const bloodBanks = facilities.filter(f => f.type === 'blood_bank');
  const hospitals = facilities.filter(f => f.type === 'hospital');
  
  const [activeBankId, setActiveBankId] = useState<string>(bloodBanks[0]?.id || 'fac-1');
  const activeBank = bloodBanks.find(b => b.id === activeBankId) || bloodBanks[0];

  // Expiring batches mock simulation
  const expiringBatches = [
    {
      batchId: 'BATCH-PLT-0981',
      bloodGroup: 'A-' as BloodGroup,
      component: 'Platelet Concentrates (SDP)',
      units: 4,
      collectedDate: '2026-10-01',
      expiryDate: '2026-10-06 (in 22 hrs)',
      storageZone: 'Platelet Agitator Zone A (22°C)',
      recommendedDestination: 'Tata Memorial Cancer & Hematology Center',
      recommendedReason: 'Severe thrombocytopenia oncology patients waiting on ward'
    },
    {
      batchId: 'BATCH-RBC-8812',
      bloodGroup: 'B+' as BloodGroup,
      component: 'PRBC (Packed Red Blood Cells)',
      units: 6,
      collectedDate: '2026-08-30',
      expiryDate: '2026-10-07 (in 46 hrs)',
      storageZone: 'Cold Room Vault 1 (3.4°C)',
      recommendedDestination: 'AIIMS Apex Trauma & Transfusion Institute',
      recommendedReason: 'Scheduled trauma orthopedic resuscitation stock'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Header with Breadcrumb & Facility Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
            <span>Bio-Logistics & Cold Storage</span>
            <span aria-hidden="true">·</span>
            <span>Blood Bank Management Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>Blood Bank & Cold-Chain Inventory</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-3xl">
            Real-time thermal monitoring, component apheresis separation logging, and automated expiry prevention transfers.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={activeBankId}
            onChange={(e) => setActiveBankId(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
          >
            {bloodBanks.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Cold Storage Environmental Zones Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Cold Room (2-6°C) for PRBC & Whole Blood */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              Cold Vault 1 (PRBC / Whole Blood)
            </span>
            <span className="text-xs font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Optimal
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
              3.8°C
            </span>
            <span className="text-xs text-neutral-400">Target: 2°C – 6°C</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-2 flex items-center justify-between">
            <span>Storage Capacity: 1,800 units</span>
            <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">74% Full</span>
          </div>
        </div>

        {/* Deep Freezer (-80°C) for FFP & Cryoprecipitate */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              Deep Cryo Freezer (FFP / Cryo)
            </span>
            <span className="text-xs font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Optimal
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
              -78.4°C
            </span>
            <span className="text-xs text-neutral-400">Target: -80°C</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-2 flex items-center justify-between">
            <span>Plasma Packs: 640 units</span>
            <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">Shelf life 1 yr</span>
          </div>
        </div>

        {/* Platelet Agitator (20-24°C) with continuous oscillation */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              Platelet Agitator Incubator
            </span>
            <span className="text-xs font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              60 rpm Oscillation
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
              22.2°C
            </span>
            <span className="text-xs text-neutral-400">Target: 20°C – 24°C</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-2 flex items-center justify-between">
            <span>Critical Constraint</span>
            <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">Max 5-Day Shelf Life</span>
          </div>
        </div>

      </div>

      {/* 3. Blood Expiry Prevention System (Hackathon Winning Feature #9) */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-600" />
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Blood Expiry Prevention & Proactive Diversion System
              </h2>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Predictive algorithm detects units with &lt;48h shelf life and automatically routes them to high-consumption trauma ICUs before wastage occurs.
            </p>
          </div>
          <span className="text-xs font-mono text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
            Zero-Waste Protocol Active
          </span>
        </div>

        <div className="space-y-3">
          {expiringBatches.map((batch) => (
            <div 
              key={batch.batchId}
              className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-amber-700 dark:text-amber-400">
                    {batch.batchId}
                  </span>
                  <span className="text-xs font-bold text-rose-600 font-mono">
                    {batch.units} Units {batch.bloodGroup}
                  </span>
                  <span className="text-xs text-neutral-700 dark:text-neutral-300">
                    ({batch.component})
                  </span>
                  <span className="text-[11px] font-mono text-red-600 dark:text-red-400 font-semibold">
                    · Expires {batch.expiryDate}
                  </span>
                </div>

                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                  <strong>AI Recommended Diversion:</strong> Transfer to <strong>{batch.recommendedDestination}</strong> ({batch.recommendedReason})
                </div>

                <div className="text-[11px] text-neutral-500 font-mono">
                  Location: {batch.storageZone} · Collected on {batch.collectedDate}
                </div>
              </div>

              <div className="shrink-0 self-end md:self-auto">
                <button
                  onClick={() => onDispatchTransfer(activeBank.id, hospitals[0]?.id || 'fac-2', batch.bloodGroup, batch.units)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Proactive Cold-Chain Transfer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Active Blood Bank Stock Matrix */}
      {activeBank && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {activeBank.name} – Detailed Stock Reserves
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Live calibrated units in warehouse quarantine and release partitions.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-neutral-900 dark:text-neutral-100">
              Total Units: {(Object.values(activeBank.inventory) as number[]).reduce((a, b) => a + b, 0)}u
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map((group) => {
              const count = activeBank.inventory[group] || 0;
              const minThreshold = activeBank.criticalThresholds[group] || 30;
              const isBelow = count < minThreshold;

              return (
                <div key={group} className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-center">
                  <div className="text-xs font-extrabold text-neutral-900 dark:text-neutral-100">{group}</div>
                  <div className={`text-xl font-bold font-mono my-1 tabular-nums ${isBelow ? 'text-rose-600 font-bold' : 'text-neutral-900 dark:text-neutral-100'}`}>
                    {count}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    Buffer: {minThreshold}u
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
