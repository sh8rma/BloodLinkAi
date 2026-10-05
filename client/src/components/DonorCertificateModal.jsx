import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, CheckCircle, Download, X, Heart, ShieldCheck } from 'lucide-react';

export default function DonorCertificateModal() {
  const { certificateDonor, setCertificateDonor, showToast } = useApp();

  if (!certificateDonor) return null;

  const handlePrintOrDownload = () => {
    window.print();
    showToast('Certificate print dialog launched!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-8 border-4 border-amber-400/80 shadow-2xl relative overflow-hidden text-center">
        {/* Decorative corner ribbons */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br from-amber-300 to-amber-500 rotate-45 transform pointer-events-none"></div>

        {/* Close button */}
        <button
          onClick={() => setCertificateDonor(null)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Inner Border */}
        <div className="border-2 border-dashed border-amber-300 dark:border-amber-700 p-6 rounded-2xl relative bg-amber-50/20 dark:bg-amber-950/10">
          {/* National Emblem Badge */}
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg mb-3">
            <Award className="w-8 h-8" />
          </div>

          <div className="text-[11px] uppercase tracking-widest font-extrabold text-amber-700 dark:text-amber-400">
            Government of India • Ministry of Health &amp; Family Welfare
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mt-1">
            Certificate of Life-Saving Appreciation
          </h2>
          <div className="w-32 h-0.5 bg-amber-400 mx-auto my-3"></div>

          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            This national honors certificate is proudly awarded in recognition of outstanding voluntary blood donation,
            demonstrating extraordinary compassion and commitment to humanity:
          </p>

          <div className="my-5">
            <div className="text-2xl font-serif font-black text-rose-700 dark:text-rose-400 underline decoration-amber-400 decoration-2 underline-offset-4">
              {certificateDonor.name}
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
              Registered Blood Group: <span className="font-extrabold text-rose-600">{certificateDonor.bloodGroup}</span> • Location: {certificateDonor.city}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto my-4 text-xs">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/60 shadow-2xs">
              <span className="text-[10px] text-slate-400 block">Total Donations:</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                {certificateDonor.donationCount}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/60 shadow-2xs">
              <span className="text-[10px] text-slate-400 block">Lives Saved:</span>
              <span className="text-base font-extrabold text-rose-600">
                {certificateDonor.impactScore}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/60 shadow-2xs">
              <span className="text-[10px] text-slate-400 block">Honorary Tier:</span>
              <span className="text-xs font-extrabold text-amber-600 truncate block">
                {certificateDonor.badge}
              </span>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="flex items-center justify-between pt-6 border-t border-amber-200/60 dark:border-amber-900/40 text-[11px] text-slate-500">
            <div className="text-left">
              <div className="font-mono font-bold text-slate-800 dark:text-slate-200">CERT-ID: BL-{certificateDonor.id}-{Date.now().toString().slice(-4)}</div>
              <div>National Blood Grid Registrar</div>
            </div>

            <div className="flex items-center gap-1 text-emerald-600 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>UIDAI / ABDM Verified</span>
            </div>

            <div className="text-right">
              <div className="font-serif font-bold text-slate-800 dark:text-slate-200">Director General</div>
              <div>National Health Command</div>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={() => setCertificateDonor(null)}
            className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrintOrDownload}
            className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download &amp; Print Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
