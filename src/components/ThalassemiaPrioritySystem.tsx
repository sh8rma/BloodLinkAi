import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Lock, 
  Calendar, 
  ShieldCheck, 
  AlertCircle, 
  UserCheck, 
  Clock, 
  Activity, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { Patient, BloodGroup, PriorityLevel } from '../types/bloodlink';

interface ThalassemiaPrioritySystemProps {
  patients: Patient[];
  onReserveUnitsForPatient: (patientId: string, units: number) => void;
}

export const ThalassemiaPrioritySystem: React.FC<ThalassemiaPrioritySystemProps> = ({
  patients,
  onReserveUnitsForPatient
}) => {
  const [selectedDiseaseFilter, setSelectedDiseaseFilter] = useState<string>('All');
  const [activePatient, setActivePatient] = useState<Patient | null>(patients[0] || null);

  const diseases = [
    'All',
    'Thalassemia Major',
    'Sickle Cell Disease',
    'Hemophilia A/B',
    'Chronic Renal Failure (Dialysis)'
  ];

  const filteredPatients = patients.filter(p => {
    if (selectedDiseaseFilter === 'All') return true;
    return p.disease === selectedDiseaseFilter;
  });

  const totalReservedUnits = patients.reduce((acc, p) => acc + p.reservedUnits, 0);
  const totalRequiredUnits = patients.reduce((acc, p) => acc + p.unitsRequiredPerSession, 0);
  const coveragePercent = Math.round((totalReservedUnits / (totalRequiredUnits || 1)) * 100);

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Vision Statement */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
            <span>Specialized Chronic Care Module</span>
            <span aria-hidden="true">·</span>
            <span>Priority Queue Level 2 Protected</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>Thalassemia & Chronic Disease Priority System</span>
            <span className="text-xs font-mono font-normal text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
              Zero-Shortage Guarantee
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-3xl">
            Protects recurring lifetime transfusion patients with automated 30-day phenotypic pre-booking, preventing emergency trauma stock diversion.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-mono text-indigo-900 dark:text-indigo-200">
            <span>National Coverage: </span>
            <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{coveragePercent}% Guaranteed</strong>
          </div>
        </div>
      </div>

      {/* 2. Four-Tier Medical Priority Architecture Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-rose-600" />
          <span>National 4-Tier Medical Priority Allocation Framework</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          <div className="p-3 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50/30 dark:bg-red-950/20">
            <div className="flex items-center justify-between font-mono font-bold text-red-700 dark:text-red-400 mb-1">
              <span>LEVEL 1</span>
              <span>IMMEDIATE</span>
            </div>
            <div className="font-semibold text-neutral-900 dark:text-neutral-100">Life-Threatening Emergency</div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Trauma ICU, massive post-partum hemorrhage, acute arterial rupture.
            </div>
          </div>

          <div className="p-3 rounded-lg border border-indigo-300 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-400/40">
            <div className="flex items-center justify-between font-mono font-bold text-indigo-700 dark:text-indigo-400 mb-1">
              <span>LEVEL 2 (THIS MODULE)</span>
              <span>LOCKED</span>
            </div>
            <div className="font-semibold text-neutral-900 dark:text-neutral-100">Thalassemia & Chronic Needs</div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Pre-booked 5 days in advance. Cannot be diverted for non-Level 1 events.
            </div>
          </div>

          <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20">
            <div className="flex items-center justify-between font-mono font-bold text-amber-700 dark:text-amber-400 mb-1">
              <span>LEVEL 3</span>
              <span>SCHEDULED</span>
            </div>
            <div className="font-semibold text-neutral-900 dark:text-neutral-100">Urgent Scheduled Surgeries</div>
            <div className="text-[11px] text-neutral-500 mt-1">
              CABG cardiac procedures, orthopedic joint reconstructions, oncology.
            </div>
          </div>

          <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
            <div className="flex items-center justify-between font-mono font-bold text-neutral-600 dark:text-neutral-400 mb-1">
              <span>LEVEL 4</span>
              <span>ROUTINE</span>
            </div>
            <div className="font-semibold text-neutral-900 dark:text-neutral-100">Regular Elective Procedures</div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Day-care surgeries, mild anemia corrections, non-urgent requisitions.
            </div>
          </div>

        </div>
      </div>

      {/* 3. Automated Monthly Reservation Dashboard */}
      <div className="bg-gradient-to-br from-indigo-900 via-neutral-900 to-black text-white rounded-xl p-5 border border-indigo-950 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-800/60 pb-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AUTONOMOUS THALASSEMIA RESERVATION ENGINE</span>
            </div>
            <h2 className="text-base font-bold text-white">
              Automated 30-Day Phenotypic Blood Lock Schedule
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="bg-indigo-950/80 px-3 py-1.5 rounded-lg border border-indigo-800 text-neutral-300">
              Active Enrolled: <strong className="text-white font-bold">{patients.length} Patients</strong>
            </div>
            <div className="bg-indigo-950/80 px-3 py-1.5 rounded-lg border border-indigo-800 text-neutral-300">
              Reserved Units: <strong className="text-indigo-400 font-bold">{totalReservedUnits} units</strong>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <div className="text-indigo-300 font-semibold mb-1">Automatic Next Date Calculation</div>
            <div className="text-neutral-300 text-[11px]">
              Engine monitors patient weight, previous transfusion dates, and ferritin trends to accurately project the exact day Hb falls below 9.0 g/dL.
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <div className="text-indigo-300 font-semibold mb-1">Inventory Lock Protocol</div>
            <div className="text-neutral-300 text-[11px]">
              5 days before scheduled transfusion, 2 phenotypically crossmatched PRBC units are locked with a tamper-evident reservation code in the parent DB.
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <div className="text-indigo-300 font-semibold mb-1">Donor Circle Dispatch</div>
            <div className="text-neutral-300 text-[11px]">
              If hospital inventory drops below 1 unit, the system triggers push alerts to the patient's dedicated 5-donor voluntary lifesaver circle.
            </div>
          </div>
        </div>
      </div>

      {/* 4. Filter by Chronic Disease */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-medium">
          {diseases.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDiseaseFilter(d)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedDiseaseFilter === d
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-semibold shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="text-xs text-neutral-500 font-mono">
          {filteredPatients.length} Enrolled Chronic Patients
        </div>
      </div>

      {/* 5. Patient Roster & Transfusion Lock Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-3">Condition</th>
                <th className="py-3 px-3">Group</th>
                <th className="py-3 px-3">Treating Center</th>
                <th className="py-3 px-3">Frequency</th>
                <th className="py-3 px-3">Next Transfusion</th>
                <th className="py-3 px-3 text-right">Units Reserved</th>
                <th className="py-3 px-3">Reservation Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredPatients.map((pat) => {
                const isReady = pat.reservationStatus === 'Locked & Ready';
                return (
                  <tr key={pat.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {pat.name}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {pat.age} yrs · Ferritin: {pat.ferritinLevelUgL} µg/L
                      </div>
                    </td>

                    <td className="py-3 px-3 text-neutral-700 dark:text-neutral-300 font-medium">
                      {pat.disease}
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                        {pat.bloodGroup}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">
                      {pat.hospitalName}
                    </td>

                    <td className="py-3 px-3 font-mono text-neutral-700 dark:text-neutral-300">
                      Every {pat.transfusionFrequencyDays}d
                    </td>

                    <td className="py-3 px-3 font-mono text-neutral-900 dark:text-neutral-100 font-semibold">
                      {pat.nextScheduledTransfusion}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                      {pat.reservedUnits} / {pat.unitsRequiredPerSession}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                        isReady 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {isReady ? <Lock className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        <span>{pat.reservationStatus}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {pat.reservedUnits < pat.unitsRequiredPerSession ? (
                        <button
                          onClick={() => onReserveUnitsForPatient(pat.id, 1)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold transition-colors shadow-xs"
                        >
                          Lock +1 Unit
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-mono font-medium">
                          Guaranteed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
