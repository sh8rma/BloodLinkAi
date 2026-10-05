import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import EmergencyAlertBanner from './components/EmergencyAlertBanner';
import NationalDashboard from './components/NationalDashboard/NationalDashboard';
import HospitalPanel from './components/HospitalPanel/HospitalPanel';
import BloodBankPanel from './components/BloodBankPanel/BloodBankPanel';
import DonorPanel from './components/DonorPanel/DonorPanel';
import PatientPortal from './components/PatientPortal/PatientPortal';
import ThalassemiaModule from './components/ThalassemiaModule/ThalassemiaModule';
import AIMachineLearning from './components/AIMachineLearning/AIMachineLearning';
import NationalBloodMap from './components/NationalBloodMap/NationalBloodMap';

import AuditSecurityModal from './components/AuditSecurityModal';
import EmergencyCrisisModal from './components/EmergencyCrisisModal';
import NotificationDrawer from './components/NotificationDrawer';
import DonorCertificateModal from './components/DonorCertificateModal';

import {
  ShieldCheck,
  Heart,
  Radio,
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

function MainContent() {
  const { activeTab, toast } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'hospital':
        return <HospitalPanel />;
      case 'bloodbank':
        return <BloodBankPanel />;
      case 'donor':
        return <DonorPanel />;
      case 'patient':
        return <PatientPortal />;
      case 'thalassemia':
        return <ThalassemiaModule />;
      case 'ai':
        return <AIMachineLearning />;
      case 'map':
        return <NationalBloodMap />;
      case 'national':
      default:
        return <NationalDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <EmergencyAlertBanner />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-xl shadow-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-all transform animate-slide-up flex items-center gap-3 border-slate-200 dark:border-slate-800">
          <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600">
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-600" />
            ) : toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Radio className="w-5 h-5 text-blue-600 animate-pulse" />
            )}
          </div>
          <div className="text-xs font-semibold leading-snug">
            {toast.message}
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActiveView()}
      </main>

      {/* Enterprise Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              BloodLink AI Enterprise
            </span>
            <span>• National Blood Shortage Prevention Network</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>HIPAA / ABDM Compliant</span>
            </span>
            <span className="flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-rose-600" />
              <span>Real-Time WebSocket Mesh</span>
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>SHA-256 Cryptographic Audit Ledger</span>
            </span>
          </div>

          <div>
            Built with Life-Saving Predictive Intelligence
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <AuditSecurityModal />
      <EmergencyCrisisModal />
      <NotificationDrawer />
      <DonorCertificateModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
