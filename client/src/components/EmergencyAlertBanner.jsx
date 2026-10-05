import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, Radio, Send, XCircle } from 'lucide-react';
import { api } from '../services/api';

export default function EmergencyAlertBanner() {
  const { emergencyMode, toggleEmergencyMode, showToast, setActiveTab } = useApp();

  if (!emergencyMode?.active) return null;

  const handleBroadcastAgain = async () => {
    try {
      await api.broadcastEmergency({
        bloodGroup: "O- & RARE GROUPS",
        location: emergencyMode.epicenterCity,
        urgencyMessage: `CRITICAL ALERT: Emergency protocol active in ${emergencyMode.epicenterCity}. Immediate mobilization requested.`
      });
      showToast("Mass SMS & WhatsApp distress call dispatched to all registered emergency donors!", "success");
    } catch (err) {
      showToast("Failed to dispatch mass alert", "error");
    }
  };

  const handleDeactivate = async () => {
    await toggleEmergencyMode(false, "Normal inventory operations restored", "National");
  };

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-lg emergency-radar sticky top-[95px] z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Alert Message */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-white/20 text-white animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-wide uppercase text-xs bg-black/30 px-2 py-0.5 rounded-full border border-white/20 flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-red-200 animate-ping" />
                  National Code Red Emergency Protocol
                </span>
                <span className="text-xs text-red-100 font-mono">
                  Activated: {new Date(emergencyMode.activatedAt || Date.now()).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm font-medium text-white mt-0.5">
                <span className="font-bold underline decoration-white/50">{emergencyMode.reason}</span>
                {' '}— Region: <span className="font-semibold">{emergencyMode.epicenterCity}</span>. All regional O- and rare blood group protocols are on priority override.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setActiveTab('map')}
              className="px-3 py-1.5 text-xs font-semibold bg-white text-red-700 rounded-lg hover:bg-red-50 shadow-xs transition cursor-pointer"
            >
              View Crisis Map
            </button>
            <button
              onClick={handleBroadcastAgain}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-950/60 hover:bg-red-950 border border-white/30 text-white rounded-lg transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast SOS to Donors ({emergencyMode.massAlertSentCount || 6})</span>
            </button>
            <button
              onClick={handleDeactivate}
              title="Deactivate Crisis Mode"
              className="p-1.5 rounded-lg text-red-200 hover:text-white hover:bg-black/20 transition cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
