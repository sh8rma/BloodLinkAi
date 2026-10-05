import React, { useState } from 'react';
import { PlusCircle, X, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { BloodGroup, BloodComponent, PriorityLevel, Facility } from '../types/bloodlink';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilities: Facility[];
  onSubmitRequest: (requestData: any) => void;
}

export const NewRequestModal: React.FC<NewRequestModalProps> = ({
  isOpen,
  onClose,
  facilities,
  onSubmitRequest
}) => {
  if (!isOpen) return null;

  const hospitals = facilities.filter(f => f.type === 'hospital');

  const [hospitalId, setHospitalId] = useState<string>(hospitals[0]?.id || 'fac-2');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [component, setComponent] = useState<BloodComponent>('PRBC (Packed Red Blood Cells)');
  const [unitsRequested, setUnitsRequested] = useState<number>(2);
  const [priorityLevel, setPriorityLevel] = useState<PriorityLevel>(1);
  const [patientCase, setPatientCase] = useState<string>('Trauma ICU resuscitation - Acute severe hemorrhage');
  const [urgencyReason, setUrgencyReason] = useState<string>('Hemoglobin 5.8 g/dL with active hypotensive shock');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRequest({
      hospitalId,
      bloodGroup,
      component,
      unitsRequested,
      priorityLevel,
      patientCase,
      urgencyReason
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-rose-600/30">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Create Clinical Blood Requisition
            </h2>
            <p className="text-xs text-neutral-500">
              Routes demand to nearest blood bank with priority queue allocation.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Hospital Center */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Requisitioning Hospital Center *
            </label>
            <select
              value={hospitalId}
              onChange={(e) => setHospitalId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>{h.name} ({h.city})</option>
              ))}
            </select>
          </div>

          {/* 4-Tier Medical Priority Framework */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Medical Priority Classification *
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { level: 1, title: 'Level 1: Life-Threatening', desc: 'Trauma ICU, massive hemorrhage, shock', color: 'border-red-500 text-red-700 dark:text-red-400' },
                { level: 2, title: 'Level 2: Thalassemia / Chronic', desc: 'Pre-scheduled monthly transfusion', color: 'border-indigo-500 text-indigo-700 dark:text-indigo-400' },
                { level: 3, title: 'Level 3: Scheduled Surgeries', desc: 'Cardiac bypass, oncology, major ortho', color: 'border-amber-500 text-amber-700 dark:text-amber-400' },
                { level: 4, title: 'Level 4: Regular Elective', desc: 'Non-emergency day-care operations', color: 'border-neutral-400 text-neutral-700 dark:text-neutral-300' }
              ].map(p => (
                <button
                  type="button"
                  key={p.level}
                  onClick={() => setPriorityLevel(p.level as PriorityLevel)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    priorityLevel === p.level
                      ? `${p.color} bg-rose-50/40 dark:bg-rose-950/20 ring-1 ring-rose-500`
                      : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                  }`}
                >
                  <div className="font-bold text-[11px] font-mono">{p.title}</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Blood Group & Component */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Required Blood Group *
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono font-bold"
              >
                {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Component *
              </label>
              <select
                value={component}
                onChange={(e) => setComponent(e.target.value as BloodComponent)}
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="PRBC (Packed Red Blood Cells)">PRBC (Packed Red Blood Cells)</option>
                <option value="Platelet Concentrates (SDP/RDP)">Platelet Concentrates (SDP/RDP)</option>
                <option value="FFP (Fresh Frozen Plasma)">FFP (Fresh Frozen Plasma)</option>
                <option value="Cryoprecipitate">Cryoprecipitate</option>
                <option value="Whole Blood">Whole Blood</option>
              </select>
            </div>
          </div>

          {/* Units Required */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Number of Units Required (1 – 10) *
            </label>
            <input
              type="number"
              min={1}
              max={10}
              required
              value={unitsRequested}
              onChange={(e) => setUnitsRequested(Number(e.target.value))}
              className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono font-bold"
            />
          </div>

          {/* Patient Case Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Clinical Case Diagnostic Summary *
            </label>
            <input
              type="text"
              required
              value={patientCase}
              onChange={(e) => setPatientCase(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* Urgency Reason */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Clinical Indicator / Laboratory Findings
            </label>
            <input
              type="text"
              value={urgencyReason}
              onChange={(e) => setUrgencyReason(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md shadow-rose-600/30"
            >
              <Activity className="w-4 h-4" />
              <span>Broadcast Clinical Requisition</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
