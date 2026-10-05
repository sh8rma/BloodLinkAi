import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import {
  Dna,
  Calendar,
  Lock,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Droplet,
  Users,
  Activity,
  Heart
} from 'lucide-react';

export default function ThalassemiaModule() {
  const { showToast, refreshOverview } = useApp();
  const [chronicPatients, setChronicPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservingId, setReservingId] = useState(null);

  // Simulation parameters for hemoglobin decay curve
  const [simDays, setSimDays] = useState(21);
  const [simStartHb, setSimStartHb] = useState(12.0);
  const [decayRate, setDecayRate] = useState(0.18); // g/dL per day

  useEffect(() => {
    loadChronicPatients();
  }, []);

  const loadChronicPatients = async () => {
    try {
      setLoading(true);
      const list = await api.getThalassemiaPatients();
      setChronicPatients(list);
    } catch (err) {
      console.error(err);
      showToast('Failed to load chronic patient registry', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdvanceReservation = async (patientId) => {
    try {
      setReservingId(patientId);
      const res = await api.reserveThalassemiaAdvance(patientId);
      if (res.success) {
        showToast(`Successfully locked blood reservation for ${res.patient.name}!`, 'success');
        refreshOverview();
        loadChronicPatients();
      }
    } catch (err) {
      showToast('Failed to reserve blood unit', 'error');
    } finally {
      setReservingId(null);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Loading Thalassemia Care Network...</div>;
  }

  // Calculate day-by-day Hb decay simulation points
  const hbDataPoints = Array.from({ length: simDays + 1 }, (_, i) => {
    const hb = Math.max(simStartHb - i * decayRate, 6.0);
    return { day: i, hb: Math.round(hb * 10) / 10 };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-600 text-white">
              <Dna className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Thalassemia &amp; Chronic Transfusion Priority Center
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                  Level 2 Priority Lock
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Automated monthly reservation engine, hemoglobin decay forecasting, and leukocyte-depleted buffer allocation.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Zero Inventory Conflict Protocol Active</span>
          </span>
        </div>
      </div>

      {/* 4 Priority Levels Reference Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-red-700 dark:text-red-300">Level 1 Priority</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1">Life-Threatening Emergency</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            Polytrauma, massive postpartum hemorrhage, acute arterial rupture. Zero wait time allocation.
          </p>
        </div>

        <div className="p-3.5 rounded-xl border-2 border-rose-500 dark:border-rose-600 bg-rose-50/70 dark:bg-rose-950/40 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-rose-700 dark:text-rose-300">Level 2 Priority</span>
            <span className="px-1.5 py-0.2 text-[9px] font-bold bg-rose-600 text-white rounded-md">Automated</span>
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1">Thalassemia &amp; Sickle Cell</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            Predictive 21-28 day recurrence lock. Units reserved 5 days in advance to prevent preemption.
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-blue-700 dark:text-blue-300">Level 3 Priority</span>
            <Clock className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1">Scheduled Surgeries</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            Elective cardiovascular, orthopedic and oncology surgeries scheduled with 48h buffer.
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-slate-600 dark:text-slate-400">Level 4 Priority</span>
            <Activity className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1">Regular Requests</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            Stable inpatient replenishment, outpatient anemia management, elective holding inventory.
          </p>
        </div>
      </div>

      {/* Hemoglobin Decay Predictor & Advance Auto-Booking Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Hemoglobin Decay Model */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Predictive Hb Depletion Curve Model
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              Hb(t) = Hb₀ - α·t
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Models individual patient red-blood cell breakdown kinetics. When predicted Hb drops below 8.8 g/dL,
            the system automatically triggers a Level 2 Leukodepleted PRBC reservation order.
          </p>

          {/* Interactive Sliders */}
          <div className="grid grid-cols-2 gap-4 mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-850 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1 text-slate-700 dark:text-slate-300">
                <span>Cycle Duration:</span>
                <span className="text-rose-600 font-bold">{simDays} Days</span>
              </div>
              <input
                type="range"
                min="14"
                max="35"
                value={simDays}
                onChange={(e) => setSimDays(parseInt(e.target.value, 10))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1 text-slate-700 dark:text-slate-300">
                <span>Decay Rate (α):</span>
                <span className="text-rose-600 font-bold">{decayRate} g/dL/day</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.30"
                step="0.02"
                value={decayRate}
                onChange={(e) => setDecayRate(parseFloat(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Visual Mini Chart Representation */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between text-xs font-semibold mb-2 text-slate-600 dark:text-slate-400">
              <span>Post-Transfusion Peak: {simStartHb} g/dL</span>
              <span className="text-red-500 font-bold">Transfusion Threshold: 8.5 g/dL</span>
            </div>

            <div className="h-32 flex items-end gap-1.5 pt-4">
              {hbDataPoints.map((pt) => {
                const heightPct = Math.min(Math.max(((pt.hb - 5) / (12 - 5)) * 100, 10), 100);
                const isUnderThreshold = pt.hb <= 8.5;
                return (
                  <div key={pt.day} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    <div
                      className={`w-full rounded-t-sm transition-all ${
                        isUnderThreshold ? 'bg-red-500' : 'bg-rose-500 hover:bg-rose-400'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    ></div>
                    {/* Tooltip on hover */}
                    <div className="absolute -top-7 hidden group-hover:block bg-black text-white text-[10px] px-1.5 py-0.5 rounded-sm whitespace-nowrap z-20">
                      Day {pt.day}: {pt.hb} g/dL
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
              <span>Day 0 (Transfused)</span>
              <span>Day {Math.round(simDays / 2)} (Buffer Window)</span>
              <span>Day {simDays} (Next Transfusion)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Automated Monthly Reservation Queue */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Reservation System &amp; Priority Queue
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {chronicPatients.length} Patients Active
            </span>
          </div>

          <div className="space-y-3">
            {chronicPatients.map((patient) => {
              const isReserved = patient.status.includes('Reserved');

              return (
                <div
                  key={patient.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {patient.name} ({patient.age}y)
                        </span>
                        <span className="px-2 py-0.2 rounded-md text-xs font-extrabold bg-rose-600 text-white">
                          {patient.bloodGroup}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {patient.disease} • {patient.hospitalName}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isReserved
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {patient.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-750 text-xs">
                    <div>
                      <span className="text-slate-400">Cycle:</span>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        Every {patient.frequencyDays} Days
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Due Date:</span>
                      <div className="font-bold text-rose-600">
                        {patient.nextTransfusionDate} ({patient.daysRemaining}d left)
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Units Needed:</span>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {patient.unitsRequired}x Leukodepleted
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Current Hb: <span className="font-bold text-slate-700 dark:text-slate-300">{patient.currentHb} g/dL</span>
                    </span>

                    {!isReserved ? (
                      <button
                        onClick={() => handleAdvanceReservation(patient.id)}
                        disabled={reservingId === patient.id}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{reservingId === patient.id ? 'Locking Units...' : 'Advance Monthly Lock'}</span>
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Units Secured &amp; Cross-Matched
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
