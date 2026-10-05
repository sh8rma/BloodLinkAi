import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { EmergencyBanner } from './components/EmergencyBanner';
import { NationalCommandCenter } from './components/NationalCommandCenter';
import { AIPredictionEngine } from './components/AIPredictionEngine';
import { DonorPanel } from './components/DonorPanel';
import { HospitalPanel } from './components/HospitalPanel';
import { BloodBankPanel } from './components/BloodBankPanel';
import { ThalassemiaPrioritySystem } from './components/ThalassemiaPrioritySystem';
import { GISExchangeMap } from './components/GISExchangeMap';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { CertificateModal } from './components/CertificateModal';
import { DonorRegisterModal } from './components/DonorRegisterModal';
import { NewRequestModal } from './components/NewRequestModal';
import { AuditLogDrawer } from './components/AuditLogDrawer';
import { LoginGateway } from './components/LoginGateway';
import { 
  Facility, 
  Donor, 
  Patient, 
  BloodRequest, 
  BloodTransfer, 
  ShortagePrediction, 
  AuditLogEntry, 
  BloodGroup, 
  UserRole 
} from './types/bloodlink';
import { 
  INITIAL_FACILITIES, 
  INITIAL_DONORS, 
  INITIAL_PATIENTS, 
  INITIAL_REQUESTS, 
  INITIAL_TRANSFERS, 
  INITIAL_PREDICTIONS, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';

export default function App() {
  // Navigation & Role State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>('command');
  const [userRole, setUserRole] = useState<UserRole>('national_admin');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Core Data States initialized with rich defaults and synced via backend
  const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [donors, setDonors] = useState<Donor[]>(INITIAL_DONORS);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [requests, setRequests] = useState<BloodRequest[]>(INITIAL_REQUESTS);
  const [transfers, setTransfers] = useState<BloodTransfer[]>(INITIAL_TRANSFERS);
  const [predictions, setPredictions] = useState<ShortagePrediction[]>(INITIAL_PREDICTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Emergency Red Alert Mode State
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);
  const [emergencyDetails, setEmergencyDetails] = useState({
    region: 'North Zone (Delhi NCR, Haryana, Punjab)',
    bloodGroup: 'O-' as BloodGroup,
    reason: 'Critical Multi-trauma highway collision surge',
    mobilizedDonorsCount: 42
  });

  // Modals state
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState<boolean>(false);
  const [selectedCertDonor, setSelectedCertDonor] = useState<Donor | null>(null);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState<boolean>(false);

  // Sync dark mode class on document root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Initial fetch from backend APIs
  const fetchAllData = async () => {
    try {
      const [facRes, donRes, patRes, reqRes, trnRes, predRes, audRes, statsRes] = await Promise.all([
        fetch('/api/facilities'),
        fetch('/api/donors'),
        fetch('/api/patients'),
        fetch('/api/requests'),
        fetch('/api/transfers'),
        fetch('/api/predictions'),
        fetch('/api/audit-logs'),
        fetch('/api/stats')
      ]);

      if (facRes.ok) setFacilities(await facRes.json());
      if (donRes.ok) setDonors(await donRes.json());
      if (patRes.ok) setPatients(await patRes.json());
      if (reqRes.ok) setRequests(await reqRes.json());
      if (trnRes.ok) setTransfers(await trnRes.json());
      if (predRes.ok) setPredictions(await predRes.json());
      if (audRes.ok) setAuditLogs(await audRes.json());

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setIsEmergencyActive(statsData.isEmergencyModeActive);
        if (statsData.activeEmergencyDetails) {
          setEmergencyDetails(statsData.activeEmergencyDetails);
        }
      }
    } catch (err) {
      console.warn('Backend syncing offline or starting up, using local state model:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // When role changes, optionally route to the most relevant view
  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    if (role === 'donor') setCurrentTab('donors');
    else if (role === 'patient') setCurrentTab('thalassemia');
    else if (role === 'hospital') setCurrentTab('hospitals');
    else if (role === 'blood_bank') setCurrentTab('bloodbanks');
    else if (role === 'national_admin') setCurrentTab('command');
  };

  const handleLogin = (role: UserRole) => {
    handleRoleChange(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Compute aggregate stats dynamically
  let totalUnits = 0;
  const unitsByGroup: Record<BloodGroup, number> = {
    'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0,
    'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0
  };

  facilities.forEach(f => {
    (Object.keys(f.inventory) as BloodGroup[]).forEach(g => {
      const count = f.inventory[g] || 0;
      totalUnits += count;
      unitsByGroup[g] = (unitsByGroup[g] || 0) + count;
    });
  });

  const stats = {
    totalUnits,
    unitsByGroup,
    criticalShortagesCount: predictions.filter(p => p.riskLevel === 'red' || p.riskLevel === 'orange').length,
    activeRequestsCount: requests.filter(r => r.status === 'Pending' || r.status === 'Matching').length,
    activeTransfersCount: transfers.filter(t => t.status === 'Courier Dispatched' || t.status === 'Approved').length,
    thalReservedUnits: patients.reduce((acc, p) => acc + p.reservedUnits, 0),
    registeredDonorsCount: donors.length,
    dailyDonationAvg: 184,
    expiringWithin48Hours: 19
  };

  // Action Handlers
  const handleRegisterDonor = async (donorData: any) => {
    try {
      const res = await fetch('/api/donors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donorData)
      });
      if (res.ok) {
        const newDonor = await res.json();
        setDonors(prev => [newDonor, ...prev]);
        fetchAllData();
      }
    } catch {
      // Local fallback
      const localDonor: Donor = {
        ...donorData,
        id: `don-${Date.now()}`,
        lastDonationDate: '2026-05-01',
        isEligible: true,
        daysUntilEligible: 0,
        totalDonations: 0,
        impactLivesSaved: 0,
        rewardPoints: 100,
        badgeLevel: 'Bronze',
        registeredOn: new Date().toISOString().split('T')[0]
      };
      setDonors(prev => [localDonor, ...prev]);
    }
  };

  const handlePledgeToRequest = async (donorId: string, requestId: string) => {
    try {
      const res = await fetch('/api/donors/pledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donorId, requestId })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch {
      // Local fallback
      setDonors(prev => prev.map(d => {
        if (d.id === donorId) {
          return {
            ...d,
            totalDonations: d.totalDonations + 1,
            impactLivesSaved: d.impactLivesSaved + 3,
            rewardPoints: d.rewardPoints + 150,
            isEligible: false,
            daysUntilEligible: 90
          };
        }
        return d;
      }));
    }
  };

  const handleReserveUnits = async (patientId: string, units: number) => {
    try {
      const res = await fetch('/api/patients/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, unitsToReserve: units })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch {
      // Local fallback
      setPatients(prev => prev.map(p => {
        if (p.id === patientId) {
          const newReserved = Math.min(p.unitsRequiredPerSession, p.reservedUnits + units);
          return {
            ...p,
            reservedUnits: newReserved,
            reservationStatus: newReserved >= p.unitsRequiredPerSession ? 'Locked & Ready' : 'Allocating'
          };
        }
        return p;
      }));
    }
  };

  const handleCreateRequest = async (requestData: any) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch {
      // Local fallback
      const fac = facilities.find(f => f.id === requestData.hospitalId) || facilities[1];
      const localReq: BloodRequest = {
        ...requestData,
        id: `req-${Date.now()}`,
        hospitalName: fac.name,
        city: fac.city,
        state: fac.state,
        unitsFulfilled: 0,
        status: 'Matching',
        requestedAt: new Date().toISOString()
      };
      setRequests(prev => [localReq, ...prev]);
    }
  };

  const handleDispatchTransfer = async (fromFacId: string, toFacId: string, group: BloodGroup, units: number) => {
    try {
      const res = await fetch('/api/transfers/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromFacilityId: fromFacId,
          toFacilityId: toFacId,
          bloodGroup: group,
          component: 'PRBC (Packed Red Blood Cells)',
          units
        })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch {
      // Local fallback
      const fromFac = facilities.find(f => f.id === fromFacId) || facilities[0];
      const toFac = facilities.find(f => f.id === toFacId) || facilities[1];
      const localTrn: BloodTransfer = {
        id: `trn-${Date.now()}`,
        fromFacilityId: fromFac.id,
        fromFacilityName: fromFac.name,
        toFacilityId: toFac.id,
        toFacilityName: toFac.name,
        bloodGroup: group,
        component: 'PRBC (Packed Red Blood Cells)',
        units,
        status: 'Courier Dispatched',
        requestedAt: new Date().toISOString(),
        estimatedArrivalMinutes: 20,
        currentTempCelsius: 3.7,
        vehiclePlate: 'MED-EMS-9912',
        driverPhone: '+91-98765-43210',
        distanceKm: 8.5
      };
      setTransfers(prev => [localTrn, ...prev]);
    }
  };

  const handleActivateEmergency = async (region: string, bloodGroup: BloodGroup, reason: string) => {
    try {
      const res = await fetch('/api/emergency/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region, bloodGroup, reason })
      });
      if (res.ok) {
        setIsEmergencyActive(true);
        setEmergencyDetails({
          region,
          bloodGroup,
          reason,
          mobilizedDonorsCount: 48
        });
        fetchAllData();
      }
    } catch {
      setIsEmergencyActive(true);
      setEmergencyDetails({
        region,
        bloodGroup,
        reason,
        mobilizedDonorsCount: 48
      });
    }
  };

  const handleDeactivateEmergency = async () => {
    try {
      await fetch('/api/emergency/deactivate', { method: 'POST' });
    } finally {
      setIsEmergencyActive(false);
      fetchAllData();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <LoginGateway
          onLogin={handleLogin}
          onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
          onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          stats={{
            registeredDonorsCount: stats.registeredDonorsCount,
            totalUnits: stats.totalUnits,
            activeRequestsCount: stats.activeRequestsCount,
            activeTransfersCount: stats.activeTransfersCount
          }}
          facilitiesCount={facilities.length}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />

        {/* Global Modals accessible from Gateway */}
        <EmergencySOSModal
          isOpen={isEmergencyModalOpen}
          onClose={() => setIsEmergencyModalOpen(false)}
          onActivate={handleActivateEmergency}
        />

        <DonorRegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onRegister={handleRegisterDonor}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      
      {/* Top Navigation Bar adhering to the Top Bar Contract */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        userRole={userRole}
        onRoleChange={handleRoleChange}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isEmergencyActive={isEmergencyActive}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenAuditLogs={() => setIsAuditDrawerOpen(true)}
        onLogout={handleLogout}
      />

      {/* Emergency Alert Banner (Shown during active Red Alert) */}
      <EmergencyBanner
        isActive={isEmergencyActive}
        region={emergencyDetails.region}
        bloodGroup={emergencyDetails.bloodGroup}
        reason={emergencyDetails.reason}
        mobilizedDonorsCount={emergencyDetails.mobilizedDonorsCount}
        onPledgeAsDonor={() => {
          setCurrentTab('donors');
        }}
        onDeactivate={handleDeactivateEmergency}
        userRole={userRole}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {currentTab === 'command' && (
          <NationalCommandCenter
            stats={stats}
            facilities={facilities}
            predictions={predictions}
            auditLogs={auditLogs}
            onNavigateTab={setCurrentTab}
            onTriggerEmergency={() => setIsEmergencyModalOpen(true)}
          />
        )}

        {currentTab === 'prediction' && (
          <AIPredictionEngine
            predictions={predictions}
            onTriggerEmergencyForGroup={(group, region, reason) => {
              handleActivateEmergency(region, group, reason);
            }}
          />
        )}

        {currentTab === 'donors' && (
          <DonorPanel
            donors={donors}
            requests={requests}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            onPledgeToRequest={handlePledgeToRequest}
            onViewCertificate={(donor) => setSelectedCertDonor(donor)}
          />
        )}

        {currentTab === 'hospitals' && (
          <HospitalPanel
            facilities={facilities}
            requests={requests}
            transfers={transfers}
            onOpenNewRequestModal={() => setIsNewRequestModalOpen(true)}
            onDispatchTransfer={handleDispatchTransfer}
          />
        )}

        {currentTab === 'bloodbanks' && (
          <BloodBankPanel
            facilities={facilities}
            transfers={transfers}
            onDispatchTransfer={handleDispatchTransfer}
            onNavigateToTab={setCurrentTab}
          />
        )}

        {currentTab === 'thalassemia' && (
          <ThalassemiaPrioritySystem
            patients={patients}
            onReserveUnitsForPatient={handleReserveUnits}
          />
        )}

        {currentTab === 'gis' && (
          <GISExchangeMap
            facilities={facilities}
            transfers={transfers}
            donors={donors}
            onDispatchTransfer={handleDispatchTransfer}
          />
        )}

      </main>

      {/* Quiet Healthcare Compliance Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-6 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900 dark:text-neutral-100">BloodLink AI</span>
            <span aria-hidden="true">·</span>
            <span>National Predictive Blood Shortage Prevention Network</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>HIPAA Compliant</span>
            <span aria-hidden="true">·</span>
            <span>4-Tier Priority Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Shortage Thalassemia Shield</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <EmergencySOSModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onActivate={handleActivateEmergency}
      />

      <DonorRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegisterDonor}
      />

      <NewRequestModal
        isOpen={isNewRequestModalOpen}
        onClose={() => setIsNewRequestModalOpen(false)}
        facilities={facilities}
        onSubmitRequest={handleCreateRequest}
      />

      <CertificateModal
        donor={selectedCertDonor}
        isOpen={!!selectedCertDonor}
        onClose={() => setSelectedCertDonor(null)}
      />

      <AuditLogDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        logs={auditLogs}
      />

    </div>
  );
}
