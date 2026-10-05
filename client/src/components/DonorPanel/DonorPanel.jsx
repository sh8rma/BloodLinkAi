import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import {
  HeartHandshake,
  Award,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  Clock,
  Send,
  UserPlus,
  AlertTriangle,
  FileCheck2,
  Heart,
  Droplet
} from 'lucide-react';

export default function DonorPanel() {
  const { showToast, refreshOverview, setCertificateDonor } = useApp();
  const [donors, setDonors] = useState([]);
  const [selectedDonorId, setSelectedDonorId] = useState('dn-1');
  const [loading, setLoading] = useState(true);

  // AI Donor Matching Tool State
  const [matchCriteria, setMatchCriteria] = useState({
    bloodGroup: 'O-',
    radiusKm: 50
  });
  const [matchedResults, setMatchedResults] = useState(null);
  const [matchingLoading, setMatchingLoading] = useState(false);

  // New Donor Registration Modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newDonor, setNewDonor] = useState({
    name: '',
    age: 26,
    gender: 'Male',
    bloodGroup: 'O-',
    city: 'New Delhi',
    state: 'Delhi',
    contact: '+91 98100 12345',
    email: '',
    hemoglobin: 14.5,
    weightKg: 70
  });

  useEffect(() => {
    loadDonors();
  }, []);

  const loadDonors = async () => {
    try {
      setLoading(true);
      const list = await api.getDonors();
      setDonors(list);
    } catch (err) {
      console.error(err);
      showToast('Failed to load donors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const currentDonor = donors.find(d => d.id === selectedDonorId) || donors[0];

  const handleRunAiMatching = async (e) => {
    e?.preventDefault();
    try {
      setMatchingLoading(true);
      const results = await api.matchDonors({
        bloodGroup: matchCriteria.bloodGroup,
        lat: currentDonor ? currentDonor.lat : 28.5672,
        lng: currentDonor ? currentDonor.lng : 77.2100,
        radiusKm: matchCriteria.radiusKm
      });
      setMatchedResults(results);
      showToast(`AI Matching algorithm found ${results.totalMatchesFound} compatible lifesavers!`, 'success');
    } catch (err) {
      showToast('Failed to run AI donor match', 'error');
    } finally {
      setMatchingLoading(false);
    }
  };

  const handleRegisterDonor = async (e) => {
    e.preventDefault();
    if (!newDonor.name) {
      showToast('Please provide your name', 'error');
      return;
    }

    try {
      const created = await api.registerDonor(newDonor);
      showToast(`Welcome ${created.name}! Registered as an active ${created.bloodGroup} donor.`, 'success');
      setDonors(prev => [created, ...prev]);
      setSelectedDonorId(created.id);
      setShowRegisterModal(false);
      refreshOverview();

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      showToast('Failed to register donor', 'error');
    }
  };

  const handleOpenCertificate = (donor) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setCertificateDonor(donor);
  };

  if (loading || !currentDonor) {
    return <div className="p-12 text-center text-slate-500">Loading Donor Center...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-rose-600" />
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Donor Engagement &amp; AI Matching Network
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track donor eligibility, life-saving impact score, verified certificates, and automated geolocation dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedDonorId}
            onChange={(e) => setSelectedDonorId(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white shadow-2xs cursor-pointer focus:ring-2 focus:ring-rose-500"
          >
            {donors.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.bloodGroup} - {d.city})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register as Donor</span>
          </button>
        </div>
      </div>

      {/* Donor Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Eligibility Status */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Eligibility Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {currentDonor.eligibilityStatus}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Last Donated: {currentDonor.lastDonationDate} (Hb: {currentDonor.medicalHistory.hemoglobin} g/dL)
          </div>
        </div>

        {/* Life-Saving Impact Score */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Impact Score</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            {currentDonor.impactScore} <span className="text-xs font-normal text-slate-500">Lives Saved</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            From {currentDonor.donationCount} successful voluntary donations
          </div>
        </div>

        {/* Points & Milestone Badge */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Reward Tier</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
            {currentDonor.badge}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {currentDonor.rewardPoints} National Healthcare Reward Points
          </div>
        </div>

        {/* Certificate Button */}
        <div className="bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/40 dark:to-red-950/30 p-4 rounded-xl border border-rose-200 dark:border-rose-900 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-rose-800 dark:text-rose-200">Govt Recognition</span>
            <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">
              Verified digital certificate issued by National Blood Grid.
            </p>
          </div>
          <button
            onClick={() => handleOpenCertificate(currentDonor)}
            className="mt-3 flex items-center justify-center gap-1.5 w-full py-1.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>View Lifesaver Certificate</span>
          </button>
        </div>
      </div>

      {/* Donor Action Split: AI Matcher Simulation & Urgent Nearby Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Donor Matching Engine */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                AI Proximity Donor Matching Engine
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full">
              Haversine + Phenotype AI
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Instantly evaluates ABO/Rh red cell compatibility, geofenced distance, and voluntary donor availability score.
          </p>

          <form onSubmit={handleRunAiMatching} className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Blood Group Needed:
              </label>
              <select
                value={matchCriteria.bloodGroup}
                onChange={(e) => setMatchCriteria({ ...matchCriteria, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Geofence Radius (km):
              </label>
              <input
                type="number"
                min="5"
                max="200"
                value={matchCriteria.radiusKm}
                onChange={(e) => setMatchCriteria({ ...matchCriteria, radiusKm: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                disabled={matchingLoading}
                className="w-full py-2 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{matchingLoading ? 'Computing Neural Compatibility...' : 'Find Nearest Compatible Donors'}</span>
              </button>
            </div>
          </form>

          {/* AI Match Results */}
          {matchedResults && (
            <div className="space-y-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Compatible Types: {matchedResults.compatibleBloodGroups.join(', ')}</span>
                <span className="font-bold text-rose-600">{matchedResults.totalMatchesFound} Donors Ranked</span>
              </div>

              {matchedResults.matchedDonors.slice(0, 3).map((match, idx) => (
                <div
                  key={match.id}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        #{idx + 1} {match.name}
                      </span>
                      <span className="px-1.5 py-0.2 text-[10px] font-extrabold rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        {match.bloodGroup}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {match.city} • {match.distanceKm} km away • Response ETA: ~{match.estimatedResponseTimeMin} min
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      {match.aiMatchScore}% Score
                    </div>
                    <button
                      onClick={() => showToast(`Emergency donor notification dispatched to ${match.name}!`, 'success')}
                      className="mt-1 px-2 py-0.5 text-[10px] font-semibold bg-rose-600 text-white rounded-md hover:bg-rose-700 cursor-pointer"
                    >
                      Alert Donor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Nearby Urgent Requests & Pledge */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Urgent Blood Shortages in Your Region
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              City: {currentDonor.city}
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-700 dark:text-red-300">
                  Critical Emergency: AIIMS Trauma ICU
                </span>
                <span className="text-xs font-extrabold text-red-600">O- &amp; B+ Needed</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Polytrauma multi-vehicle casualty ward facing immediate deficit. Verified walk-ins prioritized.
              </p>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-red-200/60 dark:border-red-900/40">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> 8.4 km from your coordinates
                </span>
                <button
                  onClick={() => showToast(`Donation appointment confirmed at AIIMS Trauma Center for ${currentDonor.name}!`, 'success')}
                  className="px-3 py-1 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-2xs transition cursor-pointer"
                >
                  Pledge Donation
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                  Thalassemia Regular Daycare Transfusion
                </span>
                <span className="text-xs font-extrabold text-rose-600">Leukodepleted PRBC</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Scheduled transfusion for chronic pediatric care patient due in 3 days. Regular matched donor requested.
              </p>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-rose-200/60 dark:border-rose-900/40">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> 11.2 km from your location
                </span>
                <button
                  onClick={() => showToast(`Pledged unit reserved for Thalassemia Care protocol!`, 'success')}
                  className="px-3 py-1 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-2xs transition cursor-pointer"
                >
                  Schedule Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Register as a Lifesaving Donor
            </h3>

            <form onSubmit={handleRegisterDonor} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Vikramaditya Sen"
                  value={newDonor.name}
                  onChange={(e) => setNewDonor({ ...newDonor, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Age:</label>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    value={newDonor.age}
                    onChange={(e) => setNewDonor({ ...newDonor, age: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Gender:</label>
                  <select
                    value={newDonor.gender}
                    onChange={(e) => setNewDonor({ ...newDonor, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Blood Group:</label>
                  <select
                    value={newDonor.bloodGroup}
                    onChange={(e) => setNewDonor({ ...newDonor, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">City:</label>
                  <input
                    type="text"
                    value={newDonor.city}
                    onChange={(e) => setNewDonor({ ...newDonor, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Contact:</label>
                  <input
                    type="text"
                    value={newDonor.contact}
                    onChange={(e) => setNewDonor({ ...newDonor, contact: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Hemoglobin (g/dL):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newDonor.hemoglobin}
                    onChange={(e) => setNewDonor({ ...newDonor, hemoglobin: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Weight (kg):</label>
                  <input
                    type="number"
                    value={newDonor.weightKg}
                    onChange={(e) => setNewDonor({ ...newDonor, weightKg: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                >
                  Join Lifesaver Network
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
