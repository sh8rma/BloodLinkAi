import React from 'react';
import { AlertTriangle, Users, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { BloodGroup } from '../types/bloodlink';

interface EmergencyBannerProps {
  isActive: boolean;
  region: string;
  bloodGroup: BloodGroup;
  reason: string;
  mobilizedDonorsCount: number;
  onPledgeAsDonor: () => void;
  onDeactivate: () => void;
  userRole: string;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  isActive,
  region,
  bloodGroup,
  reason,
  mobilizedDonorsCount,
  onPledgeAsDonor,
  onDeactivate,
  userRole
}) => {
  if (!isActive) return null;

  return (
    <div className="bg-red-600 dark:bg-red-900/90 text-white border-b border-red-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex items-start md:items-center gap-2.5">
            <span className="p-1 rounded bg-white/20 text-white shrink-0 mt-0.5 md:mt-0">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
            </span>
            <div className="text-xs sm:text-sm">
              <span className="font-bold tracking-wide uppercase bg-white text-red-700 px-1.5 py-0.5 rounded text-[11px] mr-2">
                NATIONAL RED ALERT
              </span>
              <span className="font-semibold text-white">
                Critical Deficit: Blood Group {bloodGroup} in {region}
              </span>
              <span className="text-red-100 hidden sm:inline ml-1.5">
                · {reason}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-red-100 bg-red-700/60 dark:bg-black/30 px-2.5 py-1 rounded-md">
              <Users className="w-3.5 h-3.5" />
              <span><strong className="text-white font-mono">{mobilizedDonorsCount}</strong> Donors Mobilized</span>
            </div>

            <button
              onClick={onPledgeAsDonor}
              className="text-xs font-semibold bg-white text-red-700 hover:bg-red-50 px-3 py-1 rounded-md transition-colors shadow-sm flex items-center gap-1"
            >
              <span>Emergency Donor Pledge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {userRole === 'national_admin' && (
              <button
                onClick={onDeactivate}
                title="Stand down Red Alert (MoH Command Authority only)"
                className="text-xs text-red-200 hover:text-white hover:bg-red-700/60 px-2 py-1 rounded transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Stand Down</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
