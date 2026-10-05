import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  ShieldAlert,
  Building2,
  Warehouse,
  HeartHandshake,
  UserCheck,
  Dna,
  Cpu,
  MapPin,
  Bell,
  Sun,
  Moon,
  ShieldCheck,
  FileText,
  Radio
} from 'lucide-react';

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    emergencyMode,
    setEmergencyModalOpen,
    darkMode,
    setDarkMode,
    socketConnected,
    setAuditModalOpen,
    setVerifyModalOpen,
    setNotifDrawerOpen
  } = useApp();

  const navItems = [
    { id: 'national', label: 'Command Center', icon: Activity, badge: 'National' },
    { id: 'hospital', label: 'Hospital Panel', icon: Building2 },
    { id: 'bloodbank', label: 'Blood Banks', icon: Warehouse },
    { id: 'donor', label: 'Donor Panel', icon: HeartHandshake },
    { id: 'patient', label: 'Patient Portal', icon: UserCheck },
    { id: 'thalassemia', label: 'Thalassemia Priority', icon: Dna, badge: 'Level 2' },
    { id: 'ai', label: 'AI Prediction Core', icon: Cpu, badge: 'ML 90-Day' },
    { id: 'map', label: 'National Blood Map', icon: MapPin }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 flex items-center justify-center text-white shadow-md shadow-rose-600/30">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white m-0 leading-none">
                Blood<span className="text-rose-600 dark:text-rose-500">Link</span> AI
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                Enterprise v2.4
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 m-0 mt-0.5 font-medium flex items-center gap-1.5">
              <span>Predictive Blood Shortage Network</span>
              <span className="inline-block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                {socketConnected ? 'Live National Grid' : 'Connecting...'}
              </span>
            </p>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Emergency Crisis Button */}
          <button
            onClick={() => setEmergencyModalOpen(true)}
            className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all shadow-xs cursor-pointer ${
              emergencyMode.active
                ? 'bg-red-600 text-white animate-bounce shadow-red-600/50 hover:bg-red-700'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 dark:hover:bg-rose-900/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="hidden sm:inline">
              {emergencyMode.active ? 'EMERGENCY ACTIVE' : 'Emergency Mode'}
            </span>
            <span className="sm:hidden">{emergencyMode.active ? 'ACTIVE' : 'SOS'}</span>
          </button>

          {/* Aadhaar e-KYC Verification */}
          <button
            onClick={() => setVerifyModalOpen(true)}
            title="Aadhaar / ABDM Identity Compliance"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline">Aadhaar e-KYC</span>
          </button>

          {/* Immutable Audit Trail */}
          <button
            onClick={() => setAuditModalOpen(true)}
            title="Immutable Cryptographic Audit Trail"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="hidden md:inline">Audit Ledger</span>
          </button>

          {/* Notification Center */}
          <button
            onClick={() => setNotifDrawerOpen(true)}
            title="Multi-channel Broadcasts"
            className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-white dark:ring-slate-900"></span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Dark Mode"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* Role Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-slate-800/60 overflow-x-auto no-scrollbar">
        <nav className="flex items-center gap-1 py-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                      isActive
                        ? 'bg-rose-800/80 text-rose-100'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
