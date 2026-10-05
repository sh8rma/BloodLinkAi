import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { api } from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [overview, setOverview] = useState(null);
  const [emergencyMode, setEmergencyMode] = useState({ active: false });
  const [activeTab, setActiveTab] = useState('national'); // 'national', 'hospital', 'bloodbank', 'donor', 'patient', 'thalassemia', 'ai', 'map'
  const [darkMode, setDarkMode] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  
  // Modals & Drawers
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [certificateDonor, setCertificateDonor] = useState(null);

  // Live Toast Banner
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const refreshOverview = async () => {
    try {
      const data = await api.getOverview();
      setOverview(data);
      if (data.emergencyMode) {
        setEmergencyMode(data.emergencyMode);
      }
    } catch (err) {
      console.error('Failed to load national overview:', err);
    }
  };

  useEffect(() => {
    refreshOverview();

    // Dark mode HTML class sync
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Socket.IO real-time connection
    const socket = io();

    socket.on('connect', () => {
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('initial:state', (data) => {
      if (data.overview) setOverview(data.overview);
      if (data.emergencyMode) setEmergencyMode(data.emergencyMode);
    });

    socket.on('overview:updated', (data) => {
      setOverview(data);
      if (data.emergencyMode) setEmergencyMode(data.emergencyMode);
    });

    socket.on('emergency:toggled', (newEmergency) => {
      setEmergencyMode(newEmergency);
      if (newEmergency.active) {
        showToast(`🚨 RED ALERT: Emergency Mode Activated for ${newEmergency.epicenterCity}!`, 'error');
      } else {
        showToast('Stand down: National Emergency Mode Deactivated', 'success');
      }
    });

    socket.on('request:created', (req) => {
      showToast(`New Blood Request: ${req.units} units of ${req.bloodGroup} at ${req.requestingFacilityName}`, 'warning');
      refreshOverview();
    });

    socket.on('transfer:dispatched', (tr) => {
      showToast(`Transfer Dispatched: ${tr.units} units of ${tr.bloodGroup} via ${tr.transportMode}`, 'info');
      refreshOverview();
    });

    socket.on('donor:registered', (donor) => {
      showToast(`New Donor Registered: ${donor.name} (${donor.bloodGroup})`, 'success');
      refreshOverview();
    });

    socket.on('thalassemia:reserved', (payload) => {
      showToast(`Thalassemia Auto-Reservation: Blood locked for ${payload.patient.name}`, 'success');
      refreshOverview();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const toggleEmergencyMode = async (active, reason, epicenterCity) => {
    try {
      const res = await api.toggleEmergency({
        active,
        reason,
        epicenterCity,
        actor: "National Health Command Authority"
      });
      setEmergencyMode(res);
      refreshOverview();
      return res;
    } catch (err) {
      console.error('Failed to toggle emergency mode:', err);
      showToast('Error toggling emergency mode', 'error');
    }
  };

  return (
    <AppContext.Provider
      value={{
        overview,
        emergencyMode,
        activeTab,
        setActiveTab,
        darkMode,
        setDarkMode,
        socketConnected,
        toast,
        showToast,
        refreshOverview,
        toggleEmergencyMode,
        auditModalOpen,
        setAuditModalOpen,
        verifyModalOpen,
        setVerifyModalOpen,
        notifDrawerOpen,
        setNotifDrawerOpen,
        emergencyModalOpen,
        setEmergencyModalOpen,
        certificateDonor,
        setCertificateDonor
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
