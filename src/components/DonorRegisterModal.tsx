import React, { useState } from 'react';
import { UserPlus, X, CheckCircle2, Shield, Heart } from 'lucide-react';
import { BloodGroup } from '../types/bloodlink';

interface DonorRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (donorData: any) => void;
}

export const DonorRegisterModal: React.FC<DonorRegisterModalProps> = ({
  isOpen,
  onClose,
  onRegister
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    age: 26,
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    bloodGroup: 'O+' as BloodGroup,
    city: 'New Delhi',
    state: 'Delhi',
    phone: '',
    email: '',
    medicalNotes: 'Hemoglobin 14.2 g/dL, weight 68kg, healthy voluntary donor',
    emergencyOptIn: true
  });

  const [healthChecks, setHealthChecks] = useState({
    ageWeightOk: true,
    hemoglobinOk: true,
    noTattoosSixMonths: true,
    noInfections: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    onRegister(formData);
    onClose();
  };

  const isEligible = healthChecks.ageWeightOk && healthChecks.hemoglobinOk && healthChecks.noTattoosSixMonths && healthChecks.noInfections;

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
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Lifesaver Voluntary Donor Enrollment
            </h2>
            <p className="text-xs text-neutral-500">
              Join the national emergency network to receive smart geo-fenced transfusion alerts.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Name & Blood Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sen"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Blood Group *
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono font-bold"
              >
                {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Age (18 – 65) *
              </label>
              <input
                type="number"
                min={18}
                max={65}
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Phone Number (WhatsApp Active) *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                State *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Clinical Health Pre-Screening Checklist */}
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-2">
            <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-rose-600" />
              <span>Medical Safety Pre-Screening</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-neutral-600 dark:text-neutral-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={healthChecks.ageWeightOk}
                  onChange={(e) => setHealthChecks({ ...healthChecks, ageWeightOk: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Weight &ge; 45kg</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={healthChecks.hemoglobinOk}
                  onChange={(e) => setHealthChecks({ ...healthChecks, hemoglobinOk: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Hemoglobin &ge; 12.5 g/dL</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={healthChecks.noTattoosSixMonths}
                  onChange={(e) => setHealthChecks({ ...healthChecks, noTattoosSixMonths: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>No tattoos in past 6 months</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={healthChecks.noInfections}
                  onChange={(e) => setHealthChecks({ ...healthChecks, noInfections: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Free from bloodborne illness</span>
              </label>
            </div>
          </div>

          {/* Emergency SOS Opt-in */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="emergencyOpt"
              checked={formData.emergencyOptIn}
              onChange={(e) => setFormData({ ...formData, emergencyOptIn: e.target.checked })}
              className="rounded text-rose-600 focus:ring-rose-500 mt-0.5"
            />
            <label htmlFor="emergencyOpt" className="text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
              <strong>Emergency SOS Broadcast:</strong> Allow BloodLink AI to notify me via SMS/WhatsApp if a critical trauma patient nearby requires my blood group.
            </label>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!isEligible}
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md shadow-rose-600/30"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Complete Lifesaver Registration</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
