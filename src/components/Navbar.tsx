import React from 'react';
import { 
  Activity, 
  ShieldAlert, 
  FileText, 
  Moon, 
  Sun, 
  Radio,
  LogOut
} from 'lucide-react';
import { UserRole } from '../types/bloodlink';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isEmergencyActive: boolean;
  onOpenEmergencyModal: () => void;
  onOpenAuditLogs: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  userRole,
  onRoleChange,
  isDarkMode,
  onToggleDarkMode,
  isEmergencyActive,
  onOpenEmergencyModal,
  onOpenAuditLogs,
  onLogout
}) => {
  const navItems = [
    { id: 'command', label: 'Command Center' },
    { id: 'prediction', label: 'AI Predictor' },
    { id: 'donors', label: 'Donor Hub' },
    { id: 'hospitals', label: 'Hospitals' },
    { id: 'bloodbanks', label: 'Blood Banks' },
    { id: 'thalassemia', label: 'Thalassemia Priority' },
    { id: 'gis', label: 'GIS Network' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Single text element wordmark with subtle live status */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onTabChange('command')} 
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-sm shadow-rose-500/20 group-hover:bg-rose-700 transition-colors">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                  BloodLink <span className="text-rose-600 dark:text-rose-400">AI</span>
                </span>
              </div>
            </button>
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE NATIONAL GRID</span>
            </div>
          </div>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions & system controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role Switcher */}
            <div className="hidden sm:flex items-center gap-1 text-xs">
              <label htmlFor="role-select" className="text-neutral-500 dark:text-neutral-400 sr-only">Role</label>
              <select
                id="role-select"
                value={userRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
              >
                <option value="national_admin">Role: MoH National Admin</option>
                <option value="hospital">Role: Hospital Lead Doctor</option>
                <option value="blood_bank">Role: Blood Bank Director</option>
                <option value="donor">Role: Voluntary Donor</option>
                <option value="patient">Role: Thalassemia Patient</option>
              </select>
            </div>

            {/* Audit Logs button */}
            <button
              onClick={onOpenAuditLogs}
              title="View HIPAA Healthcare Audit Logs"
              className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4" />
            </button>

            {/* Dark Mode toggle */}
            <button
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Emergency SOS Button */}
            <button
              onClick={onOpenEmergencyModal}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all shadow-sm ${
                isEmergencyActive
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{isEmergencyActive ? 'RED ALERT ACTIVE' : 'EMERGENCY SOS'}</span>
            </button>

            {/* Switch Portal / Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                title="Exit to BloodLink AI Gateway"
                className="px-2.5 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg flex items-center gap-1 transition-colors border border-neutral-200 dark:border-neutral-700 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Switch Portal</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile secondary navigation scroller */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-neutral-200 dark:border-neutral-800 text-xs">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-2.5 py-1 rounded whitespace-nowrap ${
                currentTab === item.id
                  ? 'bg-rose-600 text-white font-medium'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {item.label}
            </button>
          ))}
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-2.5 py-1 rounded whitespace-nowrap text-rose-600 font-semibold"
            >
              Exit to Gateway
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

