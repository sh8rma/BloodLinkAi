import React, { useState } from 'react';
import { 
  Droplet, 
  AlertTriangle, 
  TrendingUp, 
  Truck, 
  Clock, 
  HeartHandshake, 
  CheckCircle2, 
  Search, 
  Filter, 
  ArrowUpRight,
  Shield,
  Activity,
  Layers,
  ChevronRight,
  Calendar,
  Building2
} from 'lucide-react';
import { Facility, BloodGroup, ShortagePrediction, AuditLogEntry } from '../types/bloodlink';

interface NationalCommandCenterProps {
  stats: {
    totalUnits: number;
    unitsByGroup: Record<BloodGroup, number>;
    criticalShortagesCount: number;
    activeRequestsCount: number;
    activeTransfersCount: number;
    thalReservedUnits: number;
    registeredDonorsCount: number;
    dailyDonationAvg: number;
    expiringWithin48Hours: number;
  };
  facilities: Facility[];
  predictions: ShortagePrediction[];
  auditLogs: AuditLogEntry[];
  onNavigateTab: (tab: string) => void;
  onTriggerEmergency: () => void;
}

export const NationalCommandCenter: React.FC<NationalCommandCenterProps> = ({
  stats,
  facilities,
  predictions,
  auditLogs,
  onNavigateTab,
  onTriggerEmergency
}) => {
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Available unique states
  const states = ['All', ...Array.from(new Set(facilities.map(f => f.state)))];

  // Filter facilities
  const filteredFacilities = facilities.filter(f => {
    const matchState = selectedState === 'All' || f.state === selectedState;
    const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        f.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchState && matchSearch;
  });

  // Calculate national threshold comparisons
  const groupStatus = bloodGroups.map(group => {
    const current = stats.unitsByGroup[group] || 0;
    // Estimated threshold baseline
    const target = group.includes('-') ? 80 : 350;
    const percentage = Math.min(100, Math.round((current / target) * 100));
    const isCritical = percentage < 40;
    const isWatch = percentage >= 40 && percentage < 70;
    return { group, current, target, percentage, isCritical, isWatch };
  });

  return (
    <div className="space-y-6">
      
      {/* 1. Header with Breadcrumb, Title & Top-Level Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
            <span>Ministry of Health</span>
            <span aria-hidden="true">·</span>
            <span>National Transfusion Council</span>
            <span aria-hidden="true">·</span>
            <span>Master Command Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
            Parent Central Database & Logistics Command
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-3xl">
            Live surveillance aggregating 7 Tier-1 multi-specialty centers, 4 regional blood banks, and 6 active dispatch couriers across 4 states.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateTab('prediction')}
            className="px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
            <span>AI Shortage Forecast</span>
          </button>
          
          <button
            onClick={onTriggerEmergency}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-rose-600/20"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Declare Regional Alert</span>
          </button>
        </div>
      </div>

      {/* 2. Primary KPI Executive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Available Units */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 transition-all hover:border-neutral-300 dark:hover:border-neutral-700">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs mb-1">
            <span>National Reserve</span>
            <Droplet className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
            {stats.totalUnits.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
            <span>Total Whole & PRBC</span>
          </div>
        </div>

        {/* Critical Shortage Alerts */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 transition-all hover:border-neutral-300 dark:hover:border-neutral-700">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs mb-1">
            <span>Critical Deficits</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-500 tabular-nums">
            {stats.criticalShortagesCount}
          </div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            <span>O- & A- in High Alert</span>
          </div>
        </div>

        {/* Thalassemia Reserved Units */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 transition-all hover:border-neutral-300 dark:hover:border-neutral-700">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs mb-1">
            <span>Thal Pre-Locked</span>
            <HeartHandshake className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
            {stats.thalReservedUnits}
          </div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            <span>Priority Level 2 Protected</span>
          </div>
        </div>

        {/* Active Emergency Transfers */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 transition-all hover:border-neutral-300 dark:hover:border-neutral-700">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs mb-1">
            <span>In-Transit Couriers</span>
            <Truck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
            {stats.activeTransfersCount}
          </div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            <span>Cold-chain tracked</span>
          </div>
        </div>

        {/* Expiring Soon (<48h) */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 transition-all hover:border-neutral-300 dark:hover:border-neutral-700">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs mb-1">
            <span>Expiring &lt;48h</span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
            {stats.expiringWithin48Hours}
          </div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            <span>Expiry Guard Active</span>
          </div>
        </div>

        {/* Registered Active Donors */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 transition-all hover:border-neutral-300 dark:hover:border-neutral-700">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs mb-1">
            <span>Voluntary Donors</span>
            <Shield className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
            {stats.registeredDonorsCount}
          </div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            <span>+184 Daily Avg</span>
          </div>
        </div>

      </div>

      {/* 3. National Blood Group Inventory Matrix & Threshold Balances */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              National Blood Group Inventory & Safety Thresholds
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Continuous comparison against the 14-day minimum strategic national buffer standard.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Safe Buffer
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Watchlist
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Critical Deficit
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {groupStatus.map(item => {
            const barColor = item.isCritical 
              ? 'bg-rose-600' 
              : item.isWatch 
                ? 'bg-amber-500' 
                : 'bg-emerald-600';
            
            const textColor = item.isCritical 
              ? 'text-rose-600 dark:text-rose-400' 
              : item.isWatch 
                ? 'text-amber-600 dark:text-amber-400' 
                : 'text-neutral-900 dark:text-neutral-100';

            return (
              <div 
                key={item.group} 
                className="bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 rounded-lg p-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-neutral-900 dark:text-neutral-100">
                      {item.group}
                    </span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className={`text-xl font-bold font-mono mt-1.5 ${textColor} tabular-nums`}>
                    {item.current}
                  </div>
                  <div className="text-[10px] text-neutral-400 dark:text-neutral-500">
                    Target: {item.target}u
                  </div>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${barColor}`} 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Two-Column Analytics: Seasonal Demand Patterns & Disease-Specific Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Seasonal Demand vs Collection Surge Curve (Interactive SVG) */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                12-Month Seasonal Demand vs Donation Divergence
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Historical correlation showing festival travel spikes and monsoon dengue surges.
              </p>
            </div>
            <span className="text-xs font-mono text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
              Q4 High-Risk Phase
            </span>
          </div>

          <div className="h-52 w-full pt-4">
            {/* SVG Line / Bar Chart */}
            <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="donationGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#888888" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.2" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#888888" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.2" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="#888888" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.2" />

              {/* Shaded Area for Demand */}
              <path
                d="M 20 120 Q 80 110, 140 95 T 260 140 T 360 60 T 440 45 T 490 50 L 490 170 L 20 170 Z"
                fill="url(#demandGrad)"
              />

              {/* Demand Curve (Red) */}
              <path
                d="M 20 120 Q 80 110, 140 95 T 260 140 T 360 60 T 440 45 T 490 50"
                fill="none"
                stroke="#e11d48"
                strokeWidth="2.5"
              />

              {/* Supply Curve (Emerald) */}
              <path
                d="M 20 100 Q 80 90, 140 85 T 260 110 T 360 135 T 440 125 T 490 120"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />

              {/* Key Critical Event Callouts */}
              <circle cx="360" cy="60" r="4" fill="#e11d48" />
              <circle cx="440" cy="45" r="4" fill="#e11d48" />
              <text x="330" y="45" fill="#e11d48" fontSize="10" fontWeight="bold">Dengue Surge</text>
              <text x="410" y="30" fill="#e11d48" fontSize="10" fontWeight="bold">Diwali/Holi Travel</text>
            </svg>

            {/* X-Axis labels */}
            <div className="flex justify-between text-[11px] text-neutral-400 mt-2 font-mono">
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jul</span>
              <span className="font-bold text-rose-500">Sep</span>
              <span className="font-bold text-rose-600">Nov (Now)</span>
              <span>Dec</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 pt-3 mt-3">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-rose-600"></span> Transfusion Demand (Surging)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-b border-dashed border-emerald-500"></span> Voluntary Donations (Lagging)
            </span>
          </div>
        </div>

        {/* Disease-Specific Requirements Breakdown */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Disease-Specific Consumption Patterns
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Percentage of national inventory dedicated by clinical medical category.
              </p>
            </div>
            <button 
              onClick={() => onNavigateTab('thalassemia')}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <span>Manage Chronic Roster</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5 mt-2">
            {[
              { label: 'Thalassemia Major & Sickle Cell (Priority 2)', percent: 34, units: '1,720 units/mo', color: 'bg-indigo-600', sub: 'Non-negotiable recurring lifetime transfusions' },
              { label: 'Emergency Trauma & Mass Casualties (Priority 1)', percent: 28, units: '1,410 units/mo', color: 'bg-rose-600', sub: 'Road accidents, acute internal hemorrhage' },
              { label: 'Oncology & Bone Marrow Aplasia (Priority 3)', percent: 22, units: '1,110 units/mo', color: 'bg-amber-500', sub: 'Platelet apheresis & leukoreduced red cells' },
              { label: 'Cardiovascular, Orthopedic & Elective Surgeries', percent: 16, units: '810 units/mo', color: 'bg-emerald-600', sub: 'CABG, joint replacements, general procedures' }
            ].map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{cat.label}</span>
                  <span className="font-mono text-neutral-600 dark:text-neutral-400 tabular-nums">
                    <strong>{cat.percent}%</strong> ({cat.units})
                  </span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.percent}%` }}></div>
                </div>
                <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  {cat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 5. Master Facility Network Inventory Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
        
        {/* Table Header & Interactive Filter Bar */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Facility Stock Ledger ({filteredFacilities.length} nodes active)
            </h3>
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              <span>Hospitals and blood banks feeding the parent central database</span>
              <span aria-hidden="true">·</span>
              <span>Updated &lt;1 min ago</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search facility or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-rose-500 w-44 sm:w-56"
              />
            </div>

            {/* State Filter Buttons */}
            <div className="flex items-center gap-1 p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
              {states.map(state => (
                <button
                  key={state}
                  onClick={() => setSelectedState(state)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    selectedState === state
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-medium shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3 px-4">Facility / Location</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-2 text-right">A+</th>
                <th className="py-3 px-2 text-right">A-</th>
                <th className="py-3 px-2 text-right">B+</th>
                <th className="py-3 px-2 text-right">B-</th>
                <th className="py-3 px-2 text-right">AB+</th>
                <th className="py-3 px-2 text-right">AB-</th>
                <th className="py-3 px-2 text-right">O+</th>
                <th className="py-3 px-2 text-right">O-</th>
                <th className="py-3 px-3 text-right">Total Units</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {filteredFacilities.map((fac) => {
                const total = (Object.values(fac.inventory) as number[]).reduce((a, b) => a + b, 0);
                const isUnderStocked = fac.inventory['O-'] < (fac.criticalThresholds['O-'] || 20);
                
                return (
                  <tr 
                    key={fac.id} 
                    className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {fac.name}
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {fac.city}, {fac.state} · {fac.contactPhone}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 font-medium text-[11px] ${
                        fac.type === 'hospital' 
                          ? 'text-rose-700 dark:text-rose-400' 
                          : 'text-indigo-700 dark:text-indigo-400'
                      }`}>
                        <Building2 className="w-3.5 h-3.5" />
                        {fac.type === 'hospital' ? 'Hospital' : 'Blood Bank'}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-right font-mono tabular-nums text-neutral-700 dark:text-neutral-300">{fac.inventory['A+']}</td>
                    <td className={`py-3 px-2 text-right font-mono tabular-nums ${fac.inventory['A-'] < 15 ? 'text-rose-600 font-bold' : 'text-neutral-700 dark:text-neutral-300'}`}>{fac.inventory['A-']}</td>
                    <td className="py-3 px-2 text-right font-mono tabular-nums text-neutral-700 dark:text-neutral-300">{fac.inventory['B+']}</td>
                    <td className="py-3 px-2 text-right font-mono tabular-nums text-neutral-700 dark:text-neutral-300">{fac.inventory['B-']}</td>
                    <td className="py-3 px-2 text-right font-mono tabular-nums text-neutral-700 dark:text-neutral-300">{fac.inventory['AB+']}</td>
                    <td className={`py-3 px-2 text-right font-mono tabular-nums ${fac.inventory['AB-'] < 10 ? 'text-amber-600 font-bold' : 'text-neutral-700 dark:text-neutral-300'}`}>{fac.inventory['AB-']}</td>
                    <td className="py-3 px-2 text-right font-mono tabular-nums text-neutral-700 dark:text-neutral-300">{fac.inventory['O+']}</td>
                    <td className={`py-3 px-2 text-right font-mono tabular-nums ${fac.inventory['O-'] < 15 ? 'text-rose-600 font-bold bg-rose-50/60 dark:bg-rose-950/30' : 'text-neutral-700 dark:text-neutral-300'}`}>{fac.inventory['O-']}</td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                      {total}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {isUnderStocked ? (
                        <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                          Critical O-
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          Optimal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Real-Time National Audit & Activity Stream Preview */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-600" />
              <span>National Central Database Activity Stream</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Tamper-evident healthcare event stream synchronizing all participating institutions.
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            {auditLogs.length} events logged
          </span>
        </div>

        <div className="space-y-2.5 divide-y divide-neutral-100 dark:divide-neutral-800">
          {auditLogs.slice(0, 4).map((log) => (
            <div key={log.id} className="pt-2.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <div className="flex items-start sm:items-center gap-2">
                <span className="font-mono text-[11px] text-neutral-400 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {log.action.replace(/_/g, ' ')}
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 hidden md:inline">
                  · {log.details}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono self-end sm:self-auto">
                <span>{log.facility}</span>
                <span aria-hidden="true">·</span>
                <span className="text-neutral-500">{log.hash.slice(0, 8)}...</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
