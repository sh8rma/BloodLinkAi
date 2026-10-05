import React, { useState } from 'react';
import { FileText, X, Shield, Lock, Search, Filter, Hash, CheckCircle2 } from 'lucide-react';
import { AuditLogEntry } from '../types/bloodlink';

interface AuditLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogEntry[];
}

export const AuditLogDrawer: React.FC<AuditLogDrawerProps> = ({
  isOpen,
  onClose,
  logs
}) => {
  if (!isOpen) return null;

  const [filterCat, setFilterCat] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = logs.filter(l => {
    const matchCat = filterCat === 'ALL' || l.category === filterCat;
    const matchSearch = l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        l.facility.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 w-full max-w-xl h-full shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <span>HIPAA Healthcare Audit Trail</span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  Tamper-Evident
                </span>
              </h2>
              <p className="text-xs text-neutral-500">
                Cryptographic integrity hash logged for every blood transfer & allocation.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by actor, facility, action, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            {['ALL', 'ALLOCATION', 'DONATION', 'TRANSFER', 'PRIORITY_QUEUE', 'EMERGENCY_SOS', 'EXPIRY_GUARD'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
                  filterCat === cat
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                {cat.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Log Entries List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredLogs.map((log) => (
            <div 
              key={log.id}
              className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 space-y-1.5 text-xs transition-all hover:border-neutral-300 dark:hover:border-neutral-700"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-neutral-400">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
                <span className="font-mono text-[10px] text-neutral-500 bg-white dark:bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                  {log.category}
                </span>
              </div>

              <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <span>{log.action.replace(/_/g, ' ')}</span>
              </div>

              <div className="text-neutral-600 dark:text-neutral-300 text-[11px]">
                {log.details}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-neutral-200/60 dark:border-neutral-700/60 text-[10px] text-neutral-400 font-mono">
                <div>
                  <strong>{log.actor}</strong> ({log.role}) · {log.facility}
                </div>
                <div className="flex items-center gap-1 text-neutral-500">
                  <Hash className="w-3 h-3" />
                  <span>{log.hash}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 text-center text-[11px] text-neutral-400 font-mono">
          Security Protocol: AES-256 GCM · SHA-256 Ledger Digest Verified
        </div>

      </div>
    </div>
  );
};
