import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  AlertTriangle,
  X,
  Radio,
  Send,
  Building,
  CheckCircle2
} from 'lucide-react';

export default function EmergencyCrisisModal() {
  const { emergencyModalOpen, setEmergencyModalOpen, emergencyMode, toggleEmergencyMode, showToast } = useApp();
  
  const [reason, setReason] = useState('Multi-Vehicle Express Highway Collision — Acute O- / B+ Hemorrhage Spike');
  const [epicenterCity, setEpicenterCity] = useState('Ahmedabad');
  const [submitting, setSubmitting] = useState(false);

  if (!emergencyModalOpen) return null;

  const handleActivate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await toggleEmergencyMode(true, reason, epicenterCity);
      showToast(`Code Red Activated for ${epicenterCity}! Mass SMS broadcasts sent to all registered emergency donors.`, 'error');
      setEmergencyModalOpen(false);
    } catch (err) {
      showToast('Failed to trigger emergency mode', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      setSubmitting(true);
      await toggleEmergencyMode(false, 'Normal inventory operations restored', 'National');
      showToast('Stand down: National Emergency Mode deactivated', 'success');
      setEmergencyModalOpen(false);
    } catch (err) {
      showToast('Failed to deactivate emergency mode', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-red-300 dark:border-red-900 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-600 text-white">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              National Emergency Mode Command Override
            </h3>
          </div>
          <button
            onClick={() => setEmergencyModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {emergencyMode.active ? (
          <div className="py-4 space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 space-y-2">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-bold text-sm">
                <Radio className="w-4 h-4 animate-ping" />
                <span>CODE RED PROTOCOL CURRENTLY ACTIVE</span>
              </div>
              <div className="text-slate-700 dark:text-slate-300">
                Epicenter: <span className="font-bold text-slate-900 dark:text-white">{emergencyMode.epicenterCity}</span>
              </div>
              <div className="text-slate-700 dark:text-slate-300">
                Trigger Cause: <span className="font-medium text-slate-900 dark:text-white">{emergencyMode.reason}</span>
              </div>
              <div className="text-slate-700 dark:text-slate-300">
                Total Mobilized Donors: <span className="font-bold text-red-600">{emergencyMode.massAlertSentCount} Donors Dispatched</span>
              </div>
            </div>

            <p className="text-slate-500">
              Deactivating emergency mode will stand down regional courier sirens, restore baseline allocation priority queues, and update the national command dashboard.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEmergencyModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleDeactivate}
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
              >
                {submitting ? 'Deactivating...' : 'Stand Down / Restore Normal Ops'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleActivate} className="py-4 space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-300">
              Activating National Code Red bypasses normal elective allocations, triggers automated SMS/WhatsApp alerts to all compatible donors within a 50km radius, and engages priority cold-chain transit.
            </p>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Regional Epicenter City:
              </label>
              <select
                value={epicenterCity}
                onChange={(e) => setEpicenterCity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
              >
                <option value="Ahmedabad">Ahmedabad (Civil Hospital Acute Deficit)</option>
                <option value="New Delhi">New Delhi (National Capital Trauma Cluster)</option>
                <option value="Mumbai">Mumbai (Metropolitan Disaster Buffer)</option>
                <option value="Chennai">Chennai (South Corridor Emergency)</option>
                <option value="Hyderabad">Hyderabad (Central Regional Grid)</option>
                <option value="National">All India - National Scale Crisis</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Emergency Justification / Incident Details:
              </label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200">
              <span className="font-bold flex items-center gap-1 mb-0.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Authorization Notice:
              </span>
              This action creates a permanent audit log entry and notifies the Ministry of Health National Blood Grid dashboard.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEmergencyModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Broadcasting Code Red...' : 'Activate Code Red Emergency'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
