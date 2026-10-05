import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  Send, 
  ShieldAlert, 
  Smartphone, 
  MessageSquare, 
  Mail, 
  Bell, 
  CheckCircle2 
} from 'lucide-react';
import { BloodGroup } from '../types/bloodlink';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivate: (region: string, bloodGroup: BloodGroup, reason: string) => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  onActivate
}) => {
  if (!isOpen) return null;

  const [region, setRegion] = useState<string>('North Zone (Delhi NCR, Haryana, Punjab)');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [reason, setReason] = useState<string>('Critical multi-vehicle expressway collision, 6 patients requiring massive hemorrhage protocol.');
  const [selectedChannels, setSelectedChannels] = useState<{ sms: boolean; whatsapp: boolean; push: boolean; email: boolean }>({
    sms: true,
    whatsapp: true,
    push: true,
    email: true
  });
  const [isDispatched, setIsDispatched] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatched(true);
    setTimeout(() => {
      onActivate(region, bloodGroup, reason);
      setIsDispatched(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-red-600/30">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Declare National Red Alert Emergency
            </h2>
            <p className="text-xs text-neutral-500">
              Dispatches multi-channel SMS, WhatsApp, and App push alerts to verified donors.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Region */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Affected Crisis Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="North Zone (Delhi NCR, Haryana, Punjab)">North Zone (Delhi NCR, Haryana, Punjab)</option>
              <option value="West Zone (Mumbai, Pune, Gujarat)">West Zone (Mumbai, Pune, Gujarat)</option>
              <option value="South Zone (Bengaluru, Hyderabad, Chennai)">South Zone (Bengaluru, Hyderabad, Chennai)</option>
              <option value="East Zone (Kolkata, Bhubaneswar, Guwahati)">East Zone (Kolkata, Bhubaneswar, Guwahati)</option>
              <option value="Nationwide High Alert">Nationwide High Alert</option>
            </select>
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Critical Blood Group in Shortage
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['O-', 'A-', 'B-', 'AB-', 'O+', 'A+', 'B+', 'AB+'] as BloodGroup[]).map(g => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setBloodGroup(g)}
                  className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all ${
                    bloodGroup === g
                      ? 'border-red-600 bg-red-600 text-white shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Emergency Reason */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Clinical Emergency Justification
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Mass casualty trauma protocol activated at trauma ICU..."
              className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-500"
              required
            />
          </div>

          {/* Multi-Channel Notification Dispatch Matrix */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Simulated Multi-Channel Broadcast Channels:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedChannels.sms}
                  onChange={(e) => setSelectedChannels({ ...selectedChannels, sms: e.target.checked })}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <Smartphone className="w-3.5 h-3.5 text-neutral-500" />
                <span>Priority SMS Blast</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedChannels.whatsapp}
                  onChange={(e) => setSelectedChannels({ ...selectedChannels, whatsapp: e.target.checked })}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp API Alert</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedChannels.push}
                  onChange={(e) => setSelectedChannels({ ...selectedChannels, push: e.target.checked })}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>Mobile App Push</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedChannels.email}
                  onChange={(e) => setSelectedChannels({ ...selectedChannels, email: e.target.checked })}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                <span>Hospital Flash Email</span>
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isDispatched}
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md shadow-red-600/30"
            >
              {isDispatched ? (
                <>
                  <CheckCircle2 className="w-4 h-4 animate-spin" />
                  <span>Transmitting Crisis Broadcasts...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Activate Red Alert & Dispatch Donors</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
