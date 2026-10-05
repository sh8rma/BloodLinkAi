import React from 'react';
import { Award, CheckCircle2, Download, Printer, Share2, X, ShieldCheck } from 'lucide-react';
import { Donor } from '../types/bloodlink';

interface CertificateModalProps {
  donor: Donor | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  donor,
  isOpen,
  onClose
}) => {
  if (!isOpen || !donor) return null;

  const certificateId = `BL-CERT-${donor.id.toUpperCase()}-${new Date().getFullYear()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Printable Canvas */}
        <div className="p-8 border-4 border-double border-rose-600/30 dark:border-rose-500/30 rounded-xl bg-gradient-to-b from-rose-50/40 via-white to-neutral-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 text-center relative overflow-hidden">
          
          {/* Subtle watermark seal */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full border-8 border-rose-500/10 flex items-center justify-center pointer-events-none select-none">
            <Award className="w-24 h-24 text-rose-500/15" />
          </div>

          <div className="flex items-center justify-center gap-2 text-rose-600 dark:text-rose-400 mb-2">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-xs font-bold tracking-widest uppercase font-mono">
              NATIONAL BLOOD TRANSFUSION COUNCIL
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight font-serif mt-1">
            Certificate of Voluntary Lifesaver Honor
          </h2>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 max-w-md mx-auto">
            This national clinical commendation is conferred in recognition of selfless dedication to saving human lives through voluntary blood donation.
          </p>

          <div className="my-6">
            <span className="text-xs text-neutral-400 uppercase tracking-widest">Proudly Presented To</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-1 font-serif underline decoration-rose-500/40 decoration-2 underline-offset-8">
              {donor.name}
            </div>
            <div className="text-xs text-neutral-500 mt-2 font-mono">
              Blood Group: <strong className="text-rose-600 text-sm">{donor.bloodGroup}</strong> · {donor.city}, {donor.state}
            </div>
          </div>

          {/* Impact Statement */}
          <div className="bg-white/80 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 rounded-xl p-4 max-w-lg mx-auto grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="text-[10px] text-neutral-400 uppercase">Total Donations</div>
              <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                {donor.totalDonations}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 uppercase">Lives Impacted</div>
              <div className="text-xl font-bold font-mono text-rose-600 tabular-nums">
                {donor.impactLivesSaved}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 uppercase">National Tier</div>
              <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {donor.badgeLevel}
              </div>
            </div>
          </div>

          {/* Signatures & Verification Code */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs border-t border-neutral-200 dark:border-neutral-800 pt-4">
            <div className="text-left font-mono text-[11px] text-neutral-400">
              <div>Certificate ID: <strong className="text-neutral-700 dark:text-neutral-300">{certificateId}</strong></div>
              <div>Issued: {new Date().toLocaleDateString()}</div>
              <div className="text-emerald-600 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Digitally Verified on Master Chain
              </div>
            </div>

            <div className="text-right">
              <div className="font-serif italic text-base text-neutral-800 dark:text-neutral-200">
                Dr. A. K. Varma
              </div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                Director General of Health Services
              </div>
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Certificate</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
