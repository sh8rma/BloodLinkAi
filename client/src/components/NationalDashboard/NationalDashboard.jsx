import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Droplet,
  AlertTriangle,
  Clock,
  Truck,
  Users,
  Building2,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  RefreshCw
} from 'lucide-react';

export default function NationalDashboard() {
  const { overview, refreshOverview, setActiveTab, setEmergencyModalOpen } = useApp();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  if (!overview) {
    return (
      <div className="flex items-center justify-center p-20 text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        Loading National Command Center Data...
      </div>
    );
  }

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await refreshOverview();
    setTimeout(() => setRefreshing(false), 600);
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Helper for risk color badge
  const getRiskBadge = (units) => {
    if (units < 50) return { label: 'Critical', bg: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200' };
    if (units < 120) return { label: 'Shortage Risk', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200' };
    if (units < 300) return { label: 'Watchlist', bg: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300 border-yellow-200' };
    return { label: 'Safe Buffer', bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200' };
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              National Blood Command Center
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
              Parent Central Database
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time multi-state inventory ingestion, predictive shortage tracking, and emergency logistics orchestration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-lg shadow-2xs transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-rose-600' : ''}`} />
            <span>Sync Grid</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs transition cursor-pointer"
          >
            <span>Run 90-Day ML Model</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Available Units */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Blood Units</span>
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {overview.totalBloodUnits.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+4.2% daily intake</span>
          </div>
        </div>

        {/* Critical Shortage Groups */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Critical Deficits</span>
            <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {overview.criticalShortages.length} <span className="text-xs font-normal text-slate-500">Groups</span>
          </div>
          <div className="text-[11px] font-mono text-red-600 dark:text-red-400 mt-1 truncate">
            {overview.criticalShortages.map(c => c.bloodGroup).join(', ')}
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Expiring &lt; 5 Days</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {overview.expiringSoonUnits} <span className="text-xs font-normal text-slate-500">Units</span>
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
            <span>Expiry Prevention Active</span>
          </div>
        </div>

        {/* Active In-Transit */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Transfers</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {overview.activeTransfersCount} <span className="text-xs font-normal text-slate-500">Fleet</span>
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">
            Drone &amp; Smart EMS In Route
          </div>
        </div>

        {/* Registered Donors */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Donors</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {overview.totalDonors}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            {overview.eligibleDonorsCount} Ready to Donate Today
          </div>
        </div>

        {/* Connected Facilities */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Grid Facilities</span>
            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {overview.totalHospitals + overview.totalBloodBanks}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {overview.totalHospitals} Hosps + {overview.totalBloodBanks} Banks
          </div>
        </div>
      </div>

      {/* Blood Group Inventory Heatmap Grid */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>National Blood Group Stock Heatmap &amp; Risk Depletion Radar</span>
              <span className="text-xs font-normal text-slate-500">
                (Click any card for instant allocation filter)
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Continuous monitoring of available volume versus projected burn rates across all 8 ABO/Rh phenotypes.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Safe
            </span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> Watchlist
            </span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Shortage Risk
            </span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Critical Emergency
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {bloodGroups.map((bg) => {
            const count = overview.groupInventory[bg] || 0;
            const risk = getRiskBadge(count);
            const isSelected = selectedGroup === bg;
            const percentage = Math.min(Math.round((count / 1200) * 100), 100);

            return (
              <div
                key={bg}
                onClick={() => setSelectedGroup(isSelected ? null : bg)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-center relative overflow-hidden ${
                  isSelected
                    ? 'border-rose-600 ring-2 ring-rose-600/30 bg-rose-50/40 dark:bg-rose-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Background gauge fill */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-rose-500/10 dark:bg-rose-500/15 transition-all"
                  style={{ height: `${percentage}%` }}
                ></div>

                <div className="relative z-10">
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {bg}
                  </div>
                  <div className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                    {count.toLocaleString()}
                    <span className="text-[10px] text-slate-400 font-normal ml-0.5">units</span>
                  </div>

                  <span className={`inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded-md border mt-2 ${risk.bg}`}>
                    {risk.label}
                  </span>

                  <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                    {bg === 'O-' ? 'Universal RBC' : bg === 'AB+' ? 'Univ. Plasma' : 'Standard'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Component Breakdown & State-wise Inventory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Component-wise breakdown */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-600" />
              <span>Component Inventory &amp; Shelf Life</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Live Telemetry</span>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between text-xs font-medium mb-1">
                <span className="text-slate-700 dark:text-slate-300">PRBC (Packed Red Cells)</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {overview.componentBreakdown.PRBC} units <span className="text-slate-400 font-normal">(35-42d shelf)</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-rose-600 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-medium mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-700 dark:text-slate-300">Platelet Concentrates</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-100 text-amber-700 rounded-sm">5d Shelf-Life</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {overview.componentBreakdown.Platelets} units <span className="text-amber-500 font-normal">(Short Shelf)</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-medium mb-1">
                <span className="text-slate-700 dark:text-slate-300">Fresh Frozen Plasma (FFP)</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {overview.componentBreakdown.FFP} units <span className="text-slate-400 font-normal">(1y shelf)</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Platelet Agitator Temp: 22.0°C</span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All Chillers Compliant
              </span>
            </div>
          </div>
        </div>

        {/* State & City Distribution */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>Regional Inventory Distribution</span>
            </h3>
            <button
              onClick={() => setActiveTab('map')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              GIS Map →
            </button>
          </div>

          <div className="space-y-2.5">
            {Object.entries(overview.stateInventory).map(([state, units]) => {
              const maxState = 2500;
              const pct = Math.min(Math.round((units / maxState) * 100), 100);
              return (
                <div key={state} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-850 text-xs">
                  <div className="flex items-center justify-between font-medium text-slate-800 dark:text-slate-200">
                    <span>{state}</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">{units} units</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 mt-1.5 overflow-hidden">
                    <div className="h-full bg-rose-600 rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disease Demand & Priority Queue */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-600" />
              <span>Disease Demand Allocations</span>
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 rounded-full">
              Level 1 - 4 Priority
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-700 dark:text-red-300">Level 1: Polytrauma / Shock</span>
                <span className="text-xs font-extrabold text-red-600">4 Active</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Zero-delay priority lock. AI emergency donor matching activated for Ahmedabad &amp; Delhi.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300">Level 2: Thalassemia Monthly</span>
                <span className="text-xs font-extrabold text-rose-600">{overview.thalassemiaPatientsCount} Queued</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Automated advance monthly booking engine actively reserving leukodepleted PRBC 5 days prior.
              </p>
              <button
                onClick={() => setActiveTab('thalassemia')}
                className="mt-2 text-xs font-bold text-rose-700 dark:text-rose-300 underline cursor-pointer"
              >
                Open Thalassemia Dedicated Center →
              </button>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Level 3: Scheduled Surgeries</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">12 Staged</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Elective procedures staged pending surplus buffer clearance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
