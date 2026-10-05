import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import {
  UserCheck,
  Calendar,
  ShieldCheck,
  Clock,
  Droplet,
  FileText,
  AlertCircle,
  PlusCircle,
  Activity,
  CheckCircle2
} from 'lucide-react';

export default function PatientPortal() {
  const { showToast, refreshOverview, setActiveTab } = useApp();
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('pat-1');
  const [loading, setLoading] = useState(true);

  // Patient Registration Modal State
  const [showRegModal, setShowRegModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: 16,
    gender: 'Male',
    disease: 'Thalassemia Major',
    bloodGroup: 'B+',
    hospitalName: 'Tata Memorial Mumbai',
    frequencyDays: 21,
    unitsRequired: 2,
    currentHb: 8.4
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const list = await api.getPatients();
      setPatients(list);
    } catch (err) {
      console.error(err);
      showToast('Failed to load patient data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    if (!newPatient.name) {
      showToast('Please specify patient name', 'error');
      return;
    }

    try {
      const created = await api.registerPatient(newPatient);
      showToast(`Registered patient profile for ${created.name}!`, 'success');
      setPatients(prev => [created, ...prev]);
      setSelectedPatientId(created.id);
      setShowRegModal(false);
      refreshOverview();
    } catch (err) {
      showToast('Failed to register patient', 'error');
    }
  };

  if (loading || !currentPatient) {
    return <div className="p-12 text-center text-slate-500">Loading Patient Portal...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header & Patient Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-rose-600" />
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Patient Transfusion &amp; Reservation Portal
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Personalized transfusion schedule, reserved unit verification, priority queue, and treatment logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white shadow-2xs cursor-pointer focus:ring-2 focus:ring-rose-500"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.disease} - {p.bloodGroup})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowRegModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Patient</span>
          </button>
        </div>
      </div>

      {/* Patient Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Next Transfusion Countdown */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Next Scheduled Transfusion</span>
            <Calendar className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {currentPatient.nextTransfusionDate}
          </div>
          <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Due in {currentPatient.daysRemaining} days ({currentPatient.frequencyDays}-day cycle)</span>
          </div>
        </div>

        {/* Reserved Units Status */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Blood Reservation</span>
            <Droplet className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white truncate">
            {currentPatient.status}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Requirement: {currentPatient.unitsRequired} units ({currentPatient.componentNeeded})
          </div>
        </div>

        {/* Hemoglobin Monitoring */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Hemoglobin Telemetry</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {currentPatient.currentHb} <span className="text-xs font-normal text-slate-500">g/dL</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Target Pre-Transfusion: &gt; 9.5 g/dL (Post: {currentPatient.targetHb} g/dL)
          </div>
        </div>

        {/* Priority & Verification */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Priority Level</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400">
            Level {currentPatient.priorityLevel} Queue
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ABDM / Aadhaar e-KYC Verified</span>
          </div>
        </div>
      </div>

      {/* Transfusion Cadence & Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scheduled Booking Details */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-600" />
              <span>Transfusion Cadence &amp; Advance Lock</span>
            </h3>
            {currentPatient.disease.includes('Thalassemia') && (
              <button
                onClick={() => setActiveTab('thalassemia')}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer underline"
              >
                Open Thalassemia Module →
              </button>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500">Hospital Facility:</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{currentPatient.hospitalName}</div>
              </div>
              <div>
                <span className="text-slate-500">Blood Phenotype:</span>
                <div className="font-extrabold text-rose-600 text-sm mt-0.5">{currentPatient.bloodGroup}</div>
              </div>
              <div>
                <span className="text-slate-500">Special Protocol:</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{currentPatient.componentNeeded}</div>
              </div>
              <div>
                <span className="text-slate-500">Last Transfusion Date:</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{currentPatient.lastTransfusionDate}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-750 text-xs">
              <span className="text-slate-500">Reserved Blood Units:</span>
              <div className="mt-1 flex items-center gap-2">
                {currentPatient.reservedUnitIds.length > 0 ? (
                  currentPatient.reservedUnitIds.map(uid => (
                    <span key={uid} className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-mono font-bold">
                      Batch #{uid} (Locked &amp; Cross-Matched)
                    </span>
                  ))
                ) : (
                  <span className="text-amber-600 font-semibold">
                    Automatic allocation in progress by AI Predictive Engine
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Treatment History */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-600" />
            <span>Transfusion History Log</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span>{currentPatient.lastTransfusionDate} — Regular Transfusion</span>
                <span className="text-emerald-600 font-bold">Completed</span>
              </div>
              <p className="text-slate-500 mt-1">
                2 Units of Leukodepleted PRBC administered at {currentPatient.hospitalName}. Post-transfusion Hb: 11.8 g/dL. No adverse reactions.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span>1 Month Prior — Scheduled Transfusion</span>
                <span className="text-emerald-600 font-bold">Completed</span>
              </div>
              <p className="text-slate-500 mt-1">
                2 Units administered. Verified zero febrile non-hemolytic transfusion reactions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Registration Modal */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Register Patient for Chronic Transfusion Protocol
            </h3>

            <form onSubmit={handleRegisterPatient} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Patient Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sneha Mukherjee"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Blood Group:</label>
                  <select
                    value={newPatient.bloodGroup}
                    onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Clinical Condition:</label>
                  <select
                    value={newPatient.disease}
                    onChange={(e) => setNewPatient({ ...newPatient, disease: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Thalassemia Major">Thalassemia Major</option>
                    <option value="Sickle Cell Disease">Sickle Cell Disease</option>
                    <option value="Hemophilia">Hemophilia</option>
                    <option value="Aplastic Anemia">Aplastic Anemia</option>
                    <option value="Surgical / Trauma">Surgical / Trauma</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Cycle Cadence (Days):</label>
                  <input
                    type="number"
                    value={newPatient.frequencyDays}
                    onChange={(e) => setNewPatient({ ...newPatient, frequencyDays: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Units per Cycle:</label>
                  <input
                    type="number"
                    value={newPatient.unitsRequired}
                    onChange={(e) => setNewPatient({ ...newPatient, unitsRequired: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Treating Hospital:</label>
                <input
                  type="text"
                  value={newPatient.hospitalName}
                  onChange={(e) => setNewPatient({ ...newPatient, hospitalName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRegModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                >
                  Save Patient Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
