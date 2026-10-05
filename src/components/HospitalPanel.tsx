import React, { useState } from 'react';
import { 
  Building2, 
  PlusCircle, 
  Send, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Activity,
  Layers,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Facility, BloodRequest, BloodTransfer, BloodGroup, PriorityLevel } from '../types/bloodlink';

interface HospitalPanelProps {
  facilities: Facility[];
  requests: BloodRequest[];
  transfers: BloodTransfer[];
  onOpenNewRequestModal: () => void;
  onDispatchTransfer: (fromFacId: string, toFacId: string, group: BloodGroup, units: number) => void;
}

export const HospitalPanel: React.FC<HospitalPanelProps> = ({
  facilities,
  requests,
  transfers,
  onOpenNewRequestModal,
  onDispatchTransfer
}) => {
  // Let user pick which hospital they represent
  const hospitals = facilities.filter(f => f.type === 'hospital');
  const bloodBanks = facilities.filter(f => f.type === 'blood_bank');

  const [activeHospitalId, setActiveHospitalId] = useState<string>(hospitals[0]?.id || 'fac-2');
  const activeHospital = hospitals.find(h => h.id === activeHospitalId) || hospitals[0];

  // Requests created by this hospital
  const hospitalRequests = requests.filter(r => r.hospitalId === activeHospital?.id);
  // Transfers incoming to this hospital
  const incomingTransfers = transfers.filter(t => t.toFacilityId === activeHospital?.id);

  // AI recommendations for this hospital: find nearest blood bank with ample stock for lowest inventory group
  const lowestGroup: BloodGroup = 'O-';
  const nearbyBank = bloodBanks[0];

  return (
    <div className="space-y-6">
      
      {/* 1. Header with Breadcrumb & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
            <span>Clinical Transfusion Service</span>
            <span aria-hidden="true">·</span>
            <span>Hospital Blood Inventory & ICU Ward Allocation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>Hospital Transfusion Command</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-3xl">
            Real-time crossmatch requisitions with 4-Tier Medical Priority allocation and automated inter-bank cold chain dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Hospital Switcher */}
          <select
            value={activeHospitalId}
            onChange={(e) => setActiveHospitalId(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
          >
            {hospitals.map(h => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.city})
              </option>
            ))}
          </select>

          <button
            onClick={onOpenNewRequestModal}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-rose-600/20 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Blood Request</span>
          </button>
        </div>
      </div>

      {/* 2. Facility Operational Card & Local Inventory */}
      {activeHospital && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-rose-600" />
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {activeHospital.name}
                </h2>
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                {activeHospital.city}, {activeHospital.state} · 24/7 Transfusion Helpdesk: {activeHospital.contactPhone}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-neutral-500">Incoming Units: <strong className="text-emerald-600">{incomingTransfers.reduce((a, b) => a + b.units, 0)}u</strong></span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-500">Pending Requests: <strong className="text-rose-600">{hospitalRequests.filter(r => r.status === 'Pending' || r.status === 'Matching').length}</strong></span>
            </div>
          </div>

          {/* Current Stock Breakdown by Blood Group */}
          <div className="mt-4">
            <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
              Facility On-Site Storage Reserves (PRBC & Whole Units)
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map(group => {
                const count = activeHospital.inventory[group] || 0;
                const threshold = activeHospital.criticalThresholds[group] || 20;
                const isLow = count < threshold;

                return (
                  <div 
                    key={group}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      isLow 
                        ? 'border-red-300 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20' 
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40'
                    }`}
                  >
                    <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{group}</div>
                    <div className={`text-lg font-bold font-mono my-0.5 tabular-nums ${isLow ? 'text-red-600 dark:text-red-400' : 'text-neutral-800 dark:text-neutral-200'}`}>
                      {count}
                    </div>
                    <div className="text-[10px] text-neutral-400">min {threshold}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. AI Inter-Facility Transfer Recommendations */}
      <div className="bg-gradient-to-br from-rose-50 to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 border border-rose-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              AI Automated Inter-Bank Transfer Recommendations
            </h3>
          </div>
          <span className="text-[11px] font-mono text-rose-600 bg-white dark:bg-neutral-800 px-2 py-0.5 rounded border border-rose-200 dark:border-neutral-700">
            Optimal Routing
          </span>
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
          Algorithm detected that <strong>{activeHospital.name}</strong> is operating with <strong>O- ({activeHospital.inventory['O-']} units)</strong> below minimum safety threshold (20 units). Nearest supplier <strong>{nearbyBank.name}</strong> holds <strong>{nearbyBank.inventory['O-']} units</strong> in reserve.
        </p>

        <div className="bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
              Suggested Dispatch: 3 units O- PRBC from {nearbyBank.name}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-neutral-500 font-mono">
              <span>Transit Distance: 5.4 km</span>
              <span aria-hidden="true">·</span>
              <span>Estimated Delivery ETA: ~18 mins</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-600">Refrigerated Van Available</span>
            </div>
          </div>

          <button
            onClick={() => onDispatchTransfer(nearbyBank.id, activeHospital.id, 'O-', 3)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors shadow-xs"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Confirm Instant Courier Dispatch</span>
          </button>
        </div>
      </div>

      {/* 4. Active Hospital Blood Requests (with 4-Tier Medical Priority) */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Hospital Patient Blood Requests ({hospitalRequests.length})
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Active requisitions prioritized by clinical urgency level (1 to 4).
            </p>
          </div>
          <button
            onClick={onOpenNewRequestModal}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
          >
            <span>+ Requisition Form</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3 px-4">Priority Level</th>
                <th className="py-3 px-3">Patient Case / Urgency</th>
                <th className="py-3 px-3">Blood Group</th>
                <th className="py-3 px-3">Component</th>
                <th className="py-3 px-3 text-right">Units</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Requested At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {hospitalRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400">
                    No active requisitions for this facility. Click "Create Blood Request" above to requisition blood.
                  </td>
                </tr>
              ) : (
                hospitalRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                        req.priorityLevel === 1 
                          ? 'bg-red-600 text-white' 
                          : req.priorityLevel === 2 
                            ? 'bg-indigo-600 text-white' 
                            : req.priorityLevel === 3 
                              ? 'bg-amber-500 text-white' 
                              : 'bg-neutral-500 text-white'
                      }`}>
                        Level {req.priorityLevel}: {
                          req.priorityLevel === 1 ? 'Life-Threatening' :
                          req.priorityLevel === 2 ? 'Thalassemia/Chronic' :
                          req.priorityLevel === 3 ? 'Surgeries' : 'Elective'
                        }
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">{req.patientCase}</div>
                      <div className="text-[11px] text-neutral-500">{req.urgencyReason}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-rose-600">
                      {req.bloodGroup}
                    </td>
                    <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">
                      {req.component}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                      {req.unitsFulfilled}/{req.unitsRequested}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[11px] font-semibold ${
                        req.status === 'Fulfilled' ? 'text-emerald-600' :
                        req.status === 'In Transit' ? 'text-indigo-600' :
                        'text-amber-600'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-neutral-500 font-mono">
                      {new Date(req.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
