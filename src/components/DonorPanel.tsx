import React, { useState } from 'react';
import { 
  Heart, 
  Award, 
  Calendar, 
  MapPin, 
  Phone, 
  UserPlus, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  ArrowRight,
  Shield,
  Zap,
  Gift
} from 'lucide-react';
import { Donor, BloodRequest, BloodGroup } from '../types/bloodlink';

interface DonorPanelProps {
  donors: Donor[];
  requests: BloodRequest[];
  onOpenRegisterModal: () => void;
  onPledgeToRequest: (donorId: string, requestId: string) => void;
  onViewCertificate: (donor: Donor) => void;
}

export const DonorPanel: React.FC<DonorPanelProps> = ({
  donors,
  requests,
  onOpenRegisterModal,
  onPledgeToRequest,
  onViewCertificate
}) => {
  // Current active logged in donor profile (first donor as default or selectable)
  const [selectedDonorId, setSelectedDonorId] = useState<string>(donors[0]?.id || 'don-1');
  const [bloodGroupFilter, setBloodGroupFilter] = useState<string>('All');

  const activeDonor = donors.find(d => d.id === selectedDonorId) || donors[0];

  // Urgent pending requests matching current donor's blood group or universal
  const matchingRequests = requests.filter(r => {
    if (r.status === 'Fulfilled' || r.status === 'Cancelled') return false;
    if (activeDonor?.bloodGroup === 'O-') return true; // Universal donor can match any request
    if (activeDonor?.bloodGroup === 'O+') {
      return r.bloodGroup.includes('+'); // Can donate to any Rh positive
    }
    return r.bloodGroup === activeDonor?.bloodGroup;
  });

  const filteredDonors = donors.filter(d => {
    if (bloodGroupFilter === 'All') return true;
    return d.bloodGroup === bloodGroupFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* 1. Header with Breadcrumb & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
            <span>Voluntary Donor Mobilization</span>
            <span aria-hidden="true">·</span>
            <span>National Lifesaver Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>Donor Hub & Smart Matching</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-3xl">
            AI-driven donor dispatch matches ABO/Rh compatibility, proximity geo-coordinates, and medical rest cycles to save critical patients.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenRegisterModal}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-rose-600/20 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register as Lifesaver Donor</span>
          </button>
        </div>
      </div>

      {/* 2. Donor Profile Cockpit Card (When logged in as or viewing a donor) */}
      {activeDonor && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-600 flex items-center justify-center text-white text-xl font-bold font-mono shadow-md shadow-rose-600/20 shrink-0">
                {activeDonor.bloodGroup}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    {activeDonor.name}
                  </h2>
                  <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                    {activeDonor.badgeLevel}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  <span>{activeDonor.age} yrs · {activeDonor.gender}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {activeDonor.city}, {activeDonor.state}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {activeDonor.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Certificate Download Action */}
              <button
                onClick={() => onViewCertificate(activeDonor)}
                className="px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <FileCheck className="w-3.5 h-3.5 text-rose-600" />
                <span>Verified Certificate</span>
              </button>

              {/* Donor Switcher for Demo & Admin Testing */}
              <select
                value={selectedDonorId}
                onChange={(e) => setSelectedDonorId(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                {donors.map(d => (
                  <option key={d.id} value={d.id}>
                    Switch Donor: {d.name} ({d.bloodGroup})
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Donor Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            
            {/* Eligibility Status */}
            <div className="bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800">
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Current Eligibility</div>
              <div className="flex items-center gap-1.5 mt-1">
                {activeDonor.isEligible ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      Eligible Now
                    </span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-sm font-mono tabular-nums">
                      Eligible in {activeDonor.daysUntilEligible}d
                    </span>
                  </>
                )}
              </div>
              <div className="text-[10px] text-neutral-400 mt-1">
                Last Donated: {activeDonor.lastDonationDate}
              </div>
            </div>

            {/* Impact Metric */}
            <div className="bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800">
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Life Impact Score</div>
              <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums mt-0.5">
                {activeDonor.impactLivesSaved} Lives Saved
              </div>
              <div className="text-[10px] text-neutral-400 mt-1">
                {activeDonor.totalDonations} completed donations
              </div>
            </div>

            {/* Karma & Reward Points */}
            <div className="bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800">
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Lifesaver Karma</div>
              <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums mt-0.5">
                {activeDonor.rewardPoints} pts
              </div>
              <div className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1">
                <Gift className="w-3 h-3 text-amber-500" />
                <span>Next reward tier at 1,500</span>
              </div>
            </div>

            {/* Medical Screening Notes */}
            <div className="bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800">
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Clinical Verification</div>
              <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-1 truncate">
                {activeDonor.medicalNotes}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                Hemoglobin Verified OK
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 3. AI Smart Donor Matching: Live Urgent Requests Matching Donor */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-rose-600" />
              <span>Emergency Requests Matching {activeDonor?.name}'s Blood Profile ({activeDonor?.bloodGroup})</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Proximity geofenced hospital requests prioritized by clinical urgency level (1 to 4).
            </p>
          </div>

          <span className="text-xs font-mono text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
            {matchingRequests.length} Matches Found
          </span>
        </div>

        {matchingRequests.length === 0 ? (
          <div className="text-center py-8 text-neutral-400 text-xs">
            No critical shortages matching your blood group in your immediate region right now. Thank you for staying ready on standby!
          </div>
        ) : (
          <div className="space-y-3">
            {matchingRequests.map((req) => {
              const isUrgent = req.priorityLevel === 1;
              return (
                <div 
                  key={req.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    isUrgent 
                      ? 'border-red-300 dark:border-red-900/60 bg-red-50/20 dark:bg-red-950/20' 
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${
                        isUrgent 
                          ? 'bg-red-600 text-white' 
                          : 'bg-indigo-600 text-white'
                      }`}>
                        Level {req.priorityLevel} {isUrgent ? 'EMERGENCY' : 'CHRONIC'}
                      </span>
                      <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                        {req.hospitalName}
                      </span>
                      <span className="text-xs text-neutral-500">
                        · {req.city}
                      </span>
                    </div>

                    <div className="text-xs text-neutral-700 dark:text-neutral-300">
                      <strong>Patient Case:</strong> {req.patientCase}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-neutral-500 font-mono">
                      <span>Requirement: <strong>{req.unitsRequested} units {req.bloodGroup} {req.component}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Fulfilled: {req.unitsFulfilled}/{req.unitsRequested}</span>
                      <span aria-hidden="true">·</span>
                      <span>Requested {new Date(req.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    <button
                      onClick={() => onPledgeToRequest(activeDonor.id, req.id)}
                      disabled={!activeDonor.isEligible}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>{activeDonor.isEligible ? 'Pledge 1 Unit' : 'Cooldown Active'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. National Voluntary Donor Community Directory */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              National Voluntary Donor Community ({filteredDonors.length} registered)
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Pre-screened lifesavers with automated notification routing.
            </p>
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
            {['All', 'O-', 'A-', 'B-', 'AB-', 'O+', 'A+', 'B+', 'AB+'].map(g => (
              <button
                key={g}
                onClick={() => setBloodGroupFilter(g)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  bloodGroupFilter === g
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-semibold shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3 px-4">Donor Name</th>
                <th className="py-3 px-3">Blood Group</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3 text-center">Eligibility</th>
                <th className="py-3 px-3 text-right">Donations</th>
                <th className="py-3 px-3 text-right">Lives Saved</th>
                <th className="py-3 px-3">Tier Badge</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredDonors.map((d) => (
                <tr key={d.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                    {d.name}
                    <div className="text-[11px] font-normal text-neutral-500">{d.phone}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                      {d.bloodGroup}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">
                    {d.city}, {d.state}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {d.isEligible ? (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        Eligible
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
                        Rest ({d.daysUntilEligible}d)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-neutral-800 dark:text-neutral-200">
                    {d.totalDonations}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                    {d.impactLivesSaved}
                  </td>
                  <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">
                    {d.badgeLevel}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onViewCertificate(d)}
                      className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                    >
                      Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
