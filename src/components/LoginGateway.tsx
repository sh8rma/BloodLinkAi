import React, { useState } from 'react';
import { 
  Heart, 
  Droplet, 
  Building2, 
  User, 
  Shield, 
  Activity, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Sparkles, 
  Clock, 
  Users, 
  Radio, 
  Flame,
  KeyRound,
  ShieldCheck,
  Zap,
  ChevronRight
} from 'lucide-react';
import { UserRole, BloodGroup } from '../types/bloodlink';
import { NetworkVisualization } from './NetworkVisualization';

interface LoginGatewayProps {
  onLogin: (role: UserRole) => void;
  onOpenRegisterModal: () => void;
  onOpenEmergencyModal: () => void;
  stats: {
    registeredDonorsCount: number;
    totalUnits: number;
    activeRequestsCount: number;
    activeTransfersCount: number;
  };
  facilitiesCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({
  onLogin,
  onOpenRegisterModal,
  onOpenEmergencyModal,
  stats,
  facilitiesCount,
  isDarkMode,
  onToggleDarkMode
}) => {
  // Selected role for specific login form, null = showing role cards
  const [selectedRoleForLogin, setSelectedRoleForLogin] = useState<UserRole | null>(null);

  // Form input states
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('demo123');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSelectRole = (role: UserRole) => {
    setSelectedRoleForLogin(role);
    setErrorMessage('');
    // Pre-populate sensible demo credentials based on role
    if (role === 'hospital') setLoginIdentifier('apollo.delhi@hospital.org');
    else if (role === 'blood_bank') setLoginIdentifier('central.bank@nbtc.gov.in');
    else if (role === 'donor') setLoginIdentifier('aarav.sharma@example.com');
    else if (role === 'patient') setLoginIdentifier('ananya.roy@patient.care');
    else if (role === 'national_admin') setLoginIdentifier('admin.hq@bloodlink.gov.in');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier) {
      setErrorMessage('Please enter your identifier / email.');
      return;
    }
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      if (selectedRoleForLogin) {
        onLogin(selectedRoleForLogin);
      }
    }, 400);
  };

  const handleInstantBypass = (role: UserRole) => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onLogin(role);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white transition-colors relative overflow-hidden">
      
      {/* Background Subtle Medical Grid and Ambient Red Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-500/10 dark:bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-rose-500/5 dark:bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Bar & Live Status Strip */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-600/25">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
                BloodLink <span className="text-rose-600 dark:text-rose-400">AI</span>
              </span>
              <p className="text-[10px] text-neutral-400 font-mono tracking-wider uppercase hidden sm:block">
                Predictive Blood Shortage Network
              </p>
            </div>
          </div>

          {/* Center Network Status Bar */}
          <div className="hidden md:flex items-center gap-2.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-neutral-700 dark:text-neutral-300 font-medium">Network Operational</span>
            <span className="text-neutral-300 dark:text-neutral-600">|</span>
            <span className="text-neutral-500 text-[11px]">Sync: Live</span>
            <span className="text-neutral-300 dark:text-neutral-600">|</span>
            <span className="text-rose-600 dark:text-rose-400 font-semibold text-[11px]">Data: LIVE CONNECTED</span>
          </div>

          {/* Right Action & Mode */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenEmergencyModal}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm shadow-red-600/30 transition-all hover:scale-[1.02]"
            >
              <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
              <span className="hidden sm:inline">Emergency</span> SOS
            </button>

            <button
              onClick={onToggleDarkMode}
              className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-xs transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero & Login Experience Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        
        {/* ================================================== */}
        {/* 1. HERO SECTION & HEALTHCARE NETWORK VISUALIZATION */}
        {/* ================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Message, Slogan, and Calls to Action */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs font-mono text-rose-700 dark:text-rose-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>National Predictive Blood Reserve Architecture</span>
            </div>

            {/* Primary Slogan (Visual Centerpiece) */}
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-mono font-bold text-neutral-400 dark:text-neutral-500">
                BLOODLINK AI PLATFORM
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
                DONATE BLOOD. <br />
                <span className="text-rose-600 dark:text-rose-500">SAVE LIVES.</span> <br />
                BE SOMEONE'S HOPE. <span className="text-rose-500 animate-heartbeat inline-block">❤️</span>
              </h1>
            </div>

            {/* Secondary Slogan & Supporting Text */}
            <div className="space-y-2">
              <p className="text-base sm:text-lg font-semibold text-rose-700 dark:text-rose-400 italic">
                "Every drop counts. Every donor matters."
              </p>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
                BloodLink AI connects donors, hospitals, blood banks and patients through an intelligent blood network — helping the right blood reach the right patient at the right time.
              </p>
            </div>

            {/* Heartbeat EKG Line Accent */}
            <div className="w-full max-w-md h-6 overflow-hidden flex items-center">
              <svg className="w-full h-6" viewBox="0 0 300 24" fill="none">
                <path
                  d="M 0 12 L 70 12 L 85 2 L 95 22 L 105 8 L 115 16 L 125 12 L 190 12 L 205 2 L 215 22 L 225 8 L 235 16 L 245 12 L 300 12"
                  stroke="#e11d48"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="animate-ekg"
                />
              </svg>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenRegisterModal}
                className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>🩸 Become a Donor</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleSelectRole('patient')}
                className="px-6 py-3.5 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all hover:scale-[1.02] shadow-xs cursor-pointer"
              >
                <Search className="w-4 h-4 text-rose-600" />
                <span>🔎 Find Blood</span>
              </button>
            </div>

          </div>

          {/* Right Column: Intelligent Healthcare Network Visualization */}
          <div className="lg:col-span-5">
            <NetworkVisualization />
          </div>

        </section>

        {/* ================================================== */}
        {/* 2. EMOTIONAL DONOR CARD */}
        {/* ================================================== */}
        <section className="bg-gradient-to-r from-rose-50 via-white to-rose-50 dark:from-rose-950/30 dark:via-neutral-900 dark:to-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-rose-600/30">
                <Heart className="w-6 h-6 fill-white" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  "One donation can help save multiple lives."
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
                  Your decision to donate today could become someone's second chance tomorrow. Join 12,450+ verified lifesavers on standby.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenRegisterModal}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold shrink-0 self-start md:self-auto shadow-md shadow-rose-600/30 transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
            >
              <span>Become a Donor</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </section>

        {/* ================================================== */}
        {/* 3. ROLE LOGIN AREA & FORM WORKSPACES */}
        {/* ================================================== */}
        <section id="role-selection" className="space-y-6">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
              Access Gateways
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
              Welcome to BloodLink AI
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Choose how you're accessing the network to enter your dedicated management portal.
            </p>
          </div>

          {/* If No Role is Selected: Display Role Cards */}
          {!selectedRoleForLogin ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Card 1: HOSPITAL */}
              <div 
                onClick={() => handleSelectRole('hospital')}
                className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-rose-500 dark:hover:border-rose-600 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-600/10 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4 group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 font-mono">
                    HOSPITAL
                  </h3>
                  <div className="text-2xl my-1">🏥</div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                    Manage blood requirements and emergency requests.
                  </p>
                </div>
                
                <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform">
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card 2: BLOOD BANK */}
              <div 
                onClick={() => handleSelectRole('blood_bank')}
                className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-rose-500 dark:hover:border-rose-600 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-600/10 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4 group-hover:scale-110 transition-transform">
                    <Droplet className="w-6 h-6 fill-rose-600/30" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 font-mono">
                    BLOOD BANK
                  </h3>
                  <div className="text-2xl my-1">🩸</div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                    Manage inventory, requests and transfers.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform">
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card 3: DONOR */}
              <div 
                onClick={() => handleSelectRole('donor')}
                className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-rose-500 dark:hover:border-rose-600 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-600/10 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4 group-hover:scale-110 transition-transform">
                    <Heart className="w-6 h-6 fill-rose-600/30" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 font-mono">
                    DONOR
                  </h3>
                  <div className="text-2xl my-1">❤️</div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                    Donate blood and respond to urgent needs.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform">
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card 4: PATIENT */}
              <div 
                onClick={() => handleSelectRole('patient')}
                className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-rose-500 dark:hover:border-rose-600 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-600/10 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 font-mono">
                    PATIENT
                  </h3>
                  <div className="text-2xl my-1">🧑</div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                    Find blood and manage your requests.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform">
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card 5: ADMINISTRATOR */}
              <div 
                onClick={() => handleSelectRole('national_admin')}
                className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-rose-500 dark:hover:border-rose-600 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-600/10 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300 mb-4 group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 font-mono">
                    ADMINISTRATOR
                  </h3>
                  <div className="text-2xl my-1">🛡️</div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                    Monitor the blood network and AI intelligence.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform">
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          ) : (
            
            /* If Role Is Selected: Render Targeted Healthcare Login Experience */
            <div className="max-w-xl mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl animate-fadeIn">
              
              <button
                onClick={() => setSelectedRoleForLogin(null)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 mb-4 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Back to role selection</span>
              </button>

              {/* Dynamic Header Per Role */}
              {selectedRoleForLogin === 'hospital' && (
                <div className="mb-6 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏥</span>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                      Hospital Command Center
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Sign in to your hospital workspace. Manage blood requests, availability and emergencies.
                  </p>
                </div>
              )}

              {selectedRoleForLogin === 'blood_bank' && (
                <div className="mb-6 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🩸</span>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                      Blood Bank Operations
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Manage inventory, requests and blood transfers.
                  </p>
                </div>
              )}

              {selectedRoleForLogin === 'donor' && (
                <div className="mb-6 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">❤️</span>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                      Welcome, Life Saver ❤️
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Your next donation could be someone's next chance.
                  </p>
                </div>
              )}

              {selectedRoleForLogin === 'patient' && (
                <div className="mb-6 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🧑</span>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                      Find the Blood You Need
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-500">
                    We're here to help you find the right blood, faster.
                  </p>
                </div>
              )}

              {selectedRoleForLogin === 'national_admin' && (
                <div className="mb-6 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🛡️</span>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                      BloodLink Command Center
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Monitor the national blood network and AI intelligence.
                  </p>
                </div>
              )}

              {/* Error Callout */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400">
                  {errorMessage}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {selectedRoleForLogin === 'hospital' ? 'Hospital ID / Email' :
                     selectedRoleForLogin === 'blood_bank' ? 'Blood Bank License / Email' :
                     selectedRoleForLogin === 'donor' ? 'Email / Registered Phone' :
                     selectedRoleForLogin === 'patient' ? 'Patient ID / Contact Phone' :
                     'Administrator Security Email'}
                  </label>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Enter your credential..."
                    className="w-full text-xs p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Password / Security PIN
                    </label>
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo Mode: Any password accepted!'); }} className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span>Remember me on this workstation</span>
                  </label>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-600/30 cursor-pointer"
                >
                  {isAuthenticating ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      {selectedRoleForLogin === 'hospital' && <span>Enter Hospital Panel</span>}
                      {selectedRoleForLogin === 'blood_bank' && <span>Enter Blood Bank Panel</span>}
                      {selectedRoleForLogin === 'donor' && <span>Continue as Donor</span>}
                      {selectedRoleForLogin === 'patient' && <span>Continue as Patient</span>}
                      {selectedRoleForLogin === 'national_admin' && <span>Enter Command Center</span>}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Instant 1-Click Demo Access */}
                <button
                  type="button"
                  onClick={() => handleInstantBypass(selectedRoleForLogin)}
                  className="w-full py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>One-Click Demo Sign In ({selectedRoleForLogin.toUpperCase()})</span>
                </button>

              </form>

              {/* Extra Helper Links */}
              {selectedRoleForLogin === 'donor' && (
                <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500">
                  <span>Don't have an account? </span>
                  <button
                    onClick={onOpenRegisterModal}
                    className="font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                  >
                    Become a Donor
                  </button>
                </div>
              )}

              {selectedRoleForLogin === 'patient' && (
                <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500 space-y-2">
                  <div className="text-neutral-600 dark:text-neutral-400">
                    🚨 Need blood urgently?
                  </div>
                  <button
                    onClick={onOpenEmergencyModal}
                    className="px-4 py-2 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 hover:bg-red-100 border border-red-200 dark:border-red-900 rounded-lg font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Emergency Blood Search</span>
                  </button>
                </div>
              )}

            </div>
          )}

        </section>

        {/* ================================================== */}
        {/* 4. LIVE NETWORK STATISTICS STRIP */}
        {/* ================================================== */}
        <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                Live Network Statistics
              </h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">
              Data Source: LIVE NETWORK / VERIFIED BACKEND
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
              <div className="text-2xl mb-1">🩸</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
                {stats.registeredDonorsCount.toLocaleString()}+
              </div>
              <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mt-0.5">
                Registered Donors
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
              <div className="text-2xl mb-1">🏥</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                {facilitiesCount > 0 ? `${facilitiesCount} Hubs` : '1,240+'}
              </div>
              <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mt-0.5">
                Participating Hospitals
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
              <div className="text-2xl mb-1">🧪</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                {stats.totalUnits.toLocaleString()}+
              </div>
              <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mt-0.5">
                Active Units in Stock
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
              <div className="text-2xl mb-1">❤️</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
                18,500+
              </div>
              <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mt-0.5">
                Lives Supported
              </div>
            </div>

          </div>

        </section>

        {/* ================================================== */}
        {/* 5. DEDICATED DONATE BLOOD CTA SECTION */}
        {/* ================================================== */}
        <section className="bg-gradient-to-br from-rose-600 via-rose-700 to-red-800 text-white rounded-2xl p-8 sm:p-12 shadow-xl text-center relative overflow-hidden">
          
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Heart className="w-64 h-64 fill-white" />
          </div>

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-mono font-bold uppercase tracking-wider text-rose-100">
              ❤️ YOUR BLOOD CAN BE SOMEONE'S SECOND CHANCE
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Donate today. <br />
              Help someone tomorrow.
            </h2>

            <p className="text-sm text-rose-100 max-w-xl mx-auto">
              Safe, certified, and fully tracked. Schedule a voluntary whole blood or platelet donation at your nearest certified center.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenRegisterModal}
                className="px-8 py-4 bg-white text-rose-700 hover:bg-rose-50 rounded-xl text-sm font-bold shadow-lg shadow-black/20 inline-flex items-center gap-2 transition-all hover:scale-[1.03] cursor-pointer"
              >
                <Droplet className="w-4 h-4 fill-rose-600 text-rose-600" />
                <span>🩸 Donate Blood Now</span>
              </button>
            </div>
          </div>

        </section>

        {/* ================================================== */}
        {/* 6. EMERGENCY CTA STRIP */}
        {/* ================================================== */}
        <section className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-900 dark:text-red-200">
                Need blood urgently?
              </h4>
              <p className="text-xs text-red-700 dark:text-red-300">
                Trigger an automated Level 1 emergency crossmatch requisition across nearby hospital banks.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenEmergencyModal}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shrink-0 self-start sm:self-auto shadow-sm shadow-red-600/30 transition-all hover:scale-[1.02] cursor-pointer"
          >
            🚨 Find Emergency Blood
          </button>
        </section>

        {/* ================================================== */}
        {/* 7. TRUST INDICATORS */}
        {/* ================================================== */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 text-xs font-medium text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
            <Lock className="w-4 h-4 text-rose-600" />
            <span>🔒 Secure Access</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
            <Radio className="w-4 h-4 text-emerald-600" />
            <span>⚡ Real-Time Network</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>🤖 AI-Powered Intelligence</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
            <Building2 className="w-4 h-4 text-rose-600" />
            <span>🏥 Connected Healthcare</span>
          </div>
        </section>

      </main>

      {/* ================================================== */}
      {/* 8. FOOTER */}
      {/* ================================================== */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-8 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <span>BLOODLINK AI</span>
                <span className="text-rose-600">·</span>
                <span className="font-normal italic">"Donate Blood. Save Lives. Be Someone's Hope."</span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Every drop counts. Every donor matters.
              </p>
            </div>

            <nav className="flex items-center gap-4 text-xs font-medium">
              <a href="#about" onClick={(e) => { e.preventDefault(); alert('BloodLink AI connects donors, hospitals, blood banks and patients through predictive supply logistics.'); }} className="hover:text-rose-600 transition-colors">About</a>
              <a href="#how" onClick={(e) => { e.preventDefault(); alert('How It Works: Predictive shortage modeling alerts donors and schedules automated inter-bank cold chain transport.'); }} className="hover:text-rose-600 transition-colors">How It Works</a>
              <a href="#emergency" onClick={(e) => { e.preventDefault(); onOpenEmergencyModal(); }} className="hover:text-rose-600 transition-colors">Emergency Help</a>
              <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('HIPAA and clinical privacy standards enforced.'); }} className="hover:text-rose-600 transition-colors">Privacy</a>
              <a href="#terms" onClick={(e) => { e.preventDefault(); alert('National Blood Transfusion Council compliance agreement.'); }} className="hover:text-rose-600 transition-colors">Terms</a>
            </nav>
          </div>

          <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400">
            <span>© BloodLink AI – Predictive Blood Shortage Network. All rights reserved.</span>
            <span>Healthcare Infrastructure Protocol v3.8</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
