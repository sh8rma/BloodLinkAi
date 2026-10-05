import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import {
  Building2,
  Droplet,
  PlusCircle,
  AlertOctagon,
  Sparkles,
  Truck,
  CheckCircle2,
  Clock,
  Send,
  UserCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function HospitalPanel() {
  const { showToast, refreshOverview, setActiveTab } = useApp();
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState('hosp-1');
  const [requests, setRequests] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    bloodGroup: 'O-',
    component: 'PRBC',
    units: 2,
    priority: '1',
    patientName: '',
    condition: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadHospitalData();
  }, []);

  const loadHospitalData = async () => {
    try {
      setLoading(true);
      const [hospList, reqList, recList] = await Promise.all([
        api.getHospitals(),
        api.getRequests(),
        api.getTransferRecommendations()
      ]);
      setHospitals(hospList);
      setRequests(reqList);
      setRecommendations(recList);
    } catch (err) {
      console.error(err);
      showToast('Failed to load hospital panel data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const currentHospital = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0];

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.condition) {
      showToast('Please specify patient name and medical condition', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const created = await api.createRequest({
        requestingFacilityId: currentHospital.id,
        requestingFacilityName: currentHospital.name,
        bloodGroup: formData.bloodGroup,
        component: formData.component,
        units: parseInt(formData.units, 10),
        priority: parseInt(formData.priority, 10),
        patientName: formData.patientName,
        condition: formData.condition
      });

      showToast(`Request created successfully: Priority Level ${formData.priority}!`, 'success');
      setRequests(prev => [created, ...prev]);
      setFormData({
        bloodGroup: 'O-',
        component: 'PRBC',
        units: 2,
        priority: '1',
        patientName: '',
        condition: ''
      });
      refreshOverview();
    } catch (err) {
      showToast('Failed to create blood request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptRecommendation = async (rec) => {
    try {
      const transfer = await api.createTransfer({
        sourceFacility: rec.sourceBankName,
        destinationFacility: rec.targetHospitalName,
        bloodGroup: rec.bloodGroup,
        component: 'PRBC',
        units: rec.recommendedUnits,
        transportMode: rec.recommendedTransport
      });
      showToast(`Dispatched transfer #${transfer.trackingId} via ${transfer.transportMode}!`, 'success');
      refreshOverview();
      loadHospitalData();
    } catch (err) {
      showToast('Failed to dispatch transfer', 'error');
    }
  };

  const handleMarkDispatched = async (requestId) => {
    try {
      await api.dispatchRequest(requestId);
      showToast('Request status updated to Dispatched', 'info');
      loadHospitalData();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  if (loading || !currentHospital) {
    return <div className="p-12 text-center text-slate-500">Loading Hospital Data...</div>;
  }

  const priorityColorMap = {
    1: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300',
    2: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300',
    3: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300',
    4: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300'
  };

  return (
    <div className="space-y-6">
      {/* Header & Hospital Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-rose-600" />
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Hospital Transfusion &amp; Emergency Hub
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time on-site blood stock tracking, prioritized transfusion queue, and AI transfer recommendations.
          </p>
        </div>

        {/* Hospital Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Hospital:</label>
          <select
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white shadow-2xs cursor-pointer focus:ring-2 focus:ring-rose-500"
          >
            {hospitals.map(h => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hospital Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">On-Site Reserve</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {currentHospital.currentStock} <span className="text-xs text-slate-400 font-normal">units</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Threshold: {currentHospital.criticalThreshold} units
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily Consumption Rate</span>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {currentHospital.dailyUsageRate} <span className="text-xs text-slate-400 font-normal">units/day</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ~{Math.round(currentHospital.currentStock / currentHospital.dailyUsageRate * 10) / 10} days of supply remaining
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">ICU &amp; Trauma Capacity</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {currentHospital.icuBeds} <span className="text-xs text-slate-400 font-normal">ICU Beds</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {currentHospital.beds} total inpatient beds ({currentHospital.tier})
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Facility Shortage Status</span>
          <div className="mt-2">
            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
              currentHospital.status === 'Critical Emergency' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
              currentHospital.status === 'Shortage Risk' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
              currentHospital.status === 'Watchlist' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300' :
              'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              {currentHospital.status}
            </span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">
            {currentHospital.contact}
          </div>
        </div>
      </div>

      {/* Main Action Split: Raise Blood Request & AI Transfer Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Raise Request Form */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <PlusCircle className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Raise Prioritized Blood Request
            </h3>
          </div>

          <form onSubmit={handleCreateRequest} className="space-y-4">
            {/* Priority Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Medical Priority Level:
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
              >
                <option value="1">Level 1: Life-Threatening Emergency (Immediate)</option>
                <option value="2">Level 2: Thalassemia Monthly Transfusion</option>
                <option value="3">Level 3: Scheduled Surgeries &amp; Transfusions</option>
                <option value="4">Level 4: Regular Requests</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Blood Group:
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Component:
                </label>
                <select
                  value={formData.component}
                  onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="PRBC">PRBC (Red Cells)</option>
                  <option value="Platelets">Platelet Concentrates</option>
                  <option value="FFP">Fresh Frozen Plasma</option>
                  <option value="Cryoprecipitate">Cryoprecipitate</option>
                  <option value="Whole Blood">Whole Blood</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Units:
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.units}
                  onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Patient Name / Bed #:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gurpreet Singh (Bed 12)"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Clinical Condition / Indication:
              </label>
              <input
                type="text"
                placeholder="e.g. Polytrauma Ruptured Spleen or Thalassemia Protocol"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting to National Grid...' : 'Submit Priority Request'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: AI Transfer Recommendations */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                AI Cross-Facility Transfer Recommendations
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
              Automated Route Optimization
            </span>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-extrabold rounded-md bg-rose-600 text-white">
                      {rec.bloodGroup}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {rec.recommendedUnits} units from {rec.sourceBankName}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> ETA ~{rec.estimatedTransitMinutes} min
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  {rec.rationale}
                </p>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <Truck className="w-3.5 h-3.5 text-blue-500" />
                    <span>Mode: {rec.recommendedTransport}</span>
                    <span>({rec.distanceKm} km)</span>
                  </div>

                  <button
                    onClick={() => handleAcceptRecommendation(rec)}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition cursor-pointer"
                  >
                    <span>Accept &amp; Dispatch</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Blood Requests Table */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Droplet className="w-5 h-5 text-rose-600" />
            <span>Active Hospital Blood Requests &amp; Transfusions</span>
          </h3>
          <span className="text-xs text-slate-500">{requests.length} requests in queue</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="pb-2.5">Request ID</th>
                <th className="pb-2.5">Priority</th>
                <th className="pb-2.5">Patient / Indication</th>
                <th className="pb-2.5">Blood &amp; Units</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5">AI Recommendation</th>
                <th className="pb-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition">
                  <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">{req.id}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${priorityColorMap[req.priority] || priorityColorMap[4]}`}>
                      Level {req.priority}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{req.patientName}</div>
                    <div className="text-[11px] text-slate-500">{req.condition}</div>
                  </td>
                  <td className="py-3">
                    <div className="font-extrabold text-rose-600 dark:text-rose-400">{req.bloodGroup}</div>
                    <div className="text-[11px] text-slate-500">{req.units} units ({req.component})</div>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      req.status === 'Dispatched' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                      req.status.includes('Reserved') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 text-[11px] text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {req.aiRecommendation || 'Queued for automatic matching'}
                  </td>
                  <td className="py-3 text-right">
                    {req.status !== 'Dispatched' && (
                      <button
                        onClick={() => handleMarkDispatched(req.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-700 dark:text-slate-300 transition cursor-pointer"
                      >
                        Mark Dispatched
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
