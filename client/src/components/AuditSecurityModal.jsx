import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  ShieldCheck,
  FileText,
  X,
  Lock,
  Key,
  CheckCircle2,
  AlertCircle,
  Copy,
  Hash
} from 'lucide-react';

export default function AuditSecurityModal() {
  const { auditModalOpen, setAuditModalOpen, verifyModalOpen, setVerifyModalOpen, showToast } = useApp();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Aadhaar Verification Form
  const [aadhaarNumber, setAadhaarNumber] = useState('5481 9204 8831');
  const [name, setName] = useState('Dr. Vikramaditya Sen');
  const [verifiedResult, setVerifiedResult] = useState(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (auditModalOpen) {
      loadAuditLogs();
    }
  }, [auditModalOpen]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAadhaar = async (e) => {
    e.preventDefault();
    try {
      setVerifying(true);
      const res = await api.verifyAadhaar({ aadhaarNumber, name });
      setVerifiedResult(res);
      showToast('Identity successfully authenticated via ABDM e-KYC gateway!', 'success');
    } catch (err) {
      showToast('Aadhaar verification failed', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const handleCopyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    showToast('SHA-256 cryptographic hash copied to clipboard', 'info');
  };

  if (!auditModalOpen && !verifyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {verifyModalOpen ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            ) : (
              <FileText className="w-5 h-5 text-rose-600" />
            )}
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {verifyModalOpen ? 'National Healthcare Identity Verification (e-KYC)' : 'Immutable Cryptographic Audit Ledger'}
            </h3>
          </div>
          <button
            onClick={() => {
              setAuditModalOpen(false);
              setVerifyModalOpen(false);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {verifyModalOpen ? (
            <div className="space-y-4 text-xs">
              <p className="text-slate-500 dark:text-slate-400">
                BloodLink AI enforces ABDM &amp; HIPAA-compliant zero-trust identity verification to guarantee chain of custody for all blood donations and transfers.
              </p>

              <form onSubmit={handleVerifyAadhaar} className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Legal Name:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    12-Digit Aadhaar / National Health ID:
                  </label>
                  <input
                    type="text"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{verifying ? 'Verifying with UIDAI Mock Gateway...' : 'Authenticate Identity'}</span>
                </button>
              </form>

              {verifiedResult && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Identity Verified Successfully</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 space-y-1">
                    <div>Masked ID: <span className="font-mono font-bold">{verifiedResult.maskedAadhaar}</span></div>
                    <div>Gateway: <span>{verifiedResult.authMechanism}</span></div>
                    <div>Compliance Standard: <span className="font-semibold text-emerald-600">{verifiedResult.complianceStandard}</span></div>
                    <div>Timestamp: <span>{new Date(verifiedResult.verificationTimestamp).toLocaleString()}</span></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <p className="text-slate-500 dark:text-slate-400">
                Every blood collection, priority request, automated reservation, and drone transit is signed into an immutable SHA-256 ledger.
              </p>

              {loading ? (
                <div className="text-center py-8 text-slate-400">Loading audit records...</div>
              ) : (
                <div className="space-y-2.5">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {log.action}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      <p className="text-slate-600 dark:text-slate-300">
                        {log.details}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Actor: {log.actor} ({log.role})</span>
                        <span>Facility: {log.facility}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-[10px] text-slate-400 font-mono">
                        <span className="truncate max-w-sm">Hash: {log.hash}</span>
                        <button
                          onClick={() => handleCopyHash(log.hash)}
                          title="Copy SHA-256 hash"
                          className="hover:text-slate-600 cursor-pointer p-0.5"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
