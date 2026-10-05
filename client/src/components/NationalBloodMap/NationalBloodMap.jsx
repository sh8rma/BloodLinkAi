import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import L from 'leaflet';
import {
  MapPin,
  Building2,
  Warehouse,
  Users,
  Truck,
  Layers,
  Send,
  Clock,
  Sparkles,
  Radio,
  Thermometer
} from 'lucide-react';

export default function NationalBloodMap() {
  const { showToast, refreshOverview, setActiveTab } = useApp();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const [hospitals, setHospitals] = useState([]);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [donors, setDonors] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter Toggles
  const [filters, setFilters] = useState({
    showHospitals: true,
    showBloodBanks: true,
    showDonors: true,
    showTransfers: true
  });

  const [selectedEntity, setSelectedEntity] = useState(null);

  useEffect(() => {
    loadMapEntities();
  }, []);

  const loadMapEntities = async () => {
    try {
      setLoading(true);
      const [hospList, bankList, donorList, transList] = await Promise.all([
        api.getHospitals(),
        api.getBloodBanks(),
        api.getDonors(),
        api.getTransfers()
      ]);
      setHospitals(hospList);
      setBloodBanks(bankList);
      setDonors(donorList);
      setTransfers(transList);
    } catch (err) {
      console.error(err);
      showToast('Failed to load map data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current || loading) return;

    // Destroy existing map if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Center map around central India (Delhi / Central)
    const map = L.map(mapContainerRef.current).setView([21.7679, 78.8718], 5);
    mapInstanceRef.current = map;

    // High quality OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | BloodLink AI GIS',
      maxZoom: 18
    }).addTo(map);

    // Marker collections
    const markers = [];

    // 1. Hospital Markers (Red)
    if (filters.showHospitals) {
      hospitals.forEach((hosp) => {
        const hospIcon = L.divIcon({
          className: 'custom-hosp-marker',
          html: `<div style="background-color: #dc2626; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); font-size: 14px;">🏥</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = L.marker([hosp.lat, hosp.lng], { icon: hospIcon }).addTo(map);
        marker.on('click', () => {
          setSelectedEntity({ type: 'hospital', data: hosp });
        });
        markers.push(marker);
      });
    }

    // 2. Blood Bank Markers (Blue)
    if (filters.showBloodBanks) {
      bloodBanks.forEach((bank) => {
        const bankIcon = L.divIcon({
          className: 'custom-bank-marker',
          html: `<div style="background-color: #2563eb; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); font-size: 14px;">🩸</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = L.marker([bank.lat, bank.lng], { icon: bankIcon }).addTo(map);
        marker.on('click', () => {
          setSelectedEntity({ type: 'bloodbank', data: bank });
        });
        markers.push(marker);
      });
    }

    // 3. Registered Donors (Emerald)
    if (filters.showDonors) {
      donors.forEach((donor) => {
        const donorIcon = L.divIcon({
          className: 'custom-donor-marker',
          html: `<div style="background-color: #10b981; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); font-size: 11px;">❤️</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([donor.lat, donor.lng], { icon: donorIcon }).addTo(map);
        marker.on('click', () => {
          setSelectedEntity({ type: 'donor', data: donor });
        });
        markers.push(marker);
      });
    }

    // 4. In-Transit Fleet / Transfers
    if (filters.showTransfers) {
      transfers.forEach((tr) => {
        const isDrone = tr.transportMode?.includes('Drone');
        const transitIcon = L.divIcon({
          className: 'custom-transit-marker',
          html: `<div style="background-color: #f59e0b; color: white; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 0 12px rgba(245, 158, 11, 0.8); font-size: 16px;">${isDrone ? '🚁' : '🚑'}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([tr.lat, tr.lng], { icon: transitIcon }).addTo(map);
        marker.on('click', () => {
          setSelectedEntity({ type: 'transfer', data: tr });
        });
        markers.push(marker);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading, filters, hospitals, bloodBanks, donors, transfers]);

  const handleDispatchNewTransfer = async () => {
    try {
      const tr = await api.createTransfer({
        sourceFacility: "Rotary Metro Central Blood Bank, Mumbai",
        destinationFacility: "Tata Memorial Cancer Center, Mumbai",
        bloodGroup: "B+",
        component: "PRBC",
        units: 4,
        transportMode: "Autonomous Medical Cold-Chain Drone"
      });
      showToast(`Dispatched Emergency Medical Drone #${tr.driverOrDroneId}!`, 'success');
      loadMapEntities();
      refreshOverview();
    } catch (err) {
      showToast('Failed to dispatch transfer', 'error');
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Map Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-600 text-white">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Smart Geographic Blood Exchange Network
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Live nationwide geospatial GIS tracking of hospitals, blood reserve banks, active donors, and cold-chain transit drones.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Checkboxes */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilters({ ...filters, showHospitals: !filters.showHospitals })}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
              filters.showHospitals ? 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/60 dark:text-red-300' : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
          >
            <span>🏥 Hospitals</span>
          </button>
          <button
            onClick={() => setFilters({ ...filters, showBloodBanks: !filters.showBloodBanks })}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
              filters.showBloodBanks ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300' : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
          >
            <span>🩸 Blood Banks</span>
          </button>
          <button
            onClick={() => setFilters({ ...filters, showDonors: !filters.showDonors })}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
              filters.showDonors ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
          >
            <span>❤️ Donors</span>
          </button>
          <button
            onClick={() => setFilters({ ...filters, showTransfers: !filters.showTransfers })}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
              filters.showTransfers ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300' : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
          >
            <span>🚁 Fleet Transit</span>
          </button>

          <button
            onClick={handleDispatchNewTransfer}
            className="px-3 py-1 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition cursor-pointer shadow-xs ml-2"
          >
            + Dispatch Drone
          </button>
        </div>
      </div>

      {/* Main Map Container & Sidebar Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive Leaflet Map View */}
        <div className="lg:col-span-8 bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-[560px] relative shadow-inner">
          <div ref={mapContainerRef} className="w-full h-full"></div>

          {/* Map Overlay Badge */}
          <div className="absolute top-3 left-14 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-md text-xs font-semibold text-slate-800 dark:text-slate-200 pointer-events-none flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>National GPS Live Grid Telemetry Active</span>
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between h-[560px] overflow-y-auto">
          {selectedEntity ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600">
                  {selectedEntity.type.toUpperCase()} DETAILS
                </span>
                <button
                  onClick={() => setSelectedEntity(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Clear Selection
                </button>
              </div>

              {selectedEntity.type === 'hospital' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {selectedEntity.data.name}
                  </h3>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">City / State:</span>
                      <span className="font-semibold">{selectedEntity.data.city}, {selectedEntity.data.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Blood Stock:</span>
                      <span className="font-bold text-rose-600">{selectedEntity.data.currentStock} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Daily Burn Rate:</span>
                      <span className="font-semibold">{selectedEntity.data.dailyUsageRate} units/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ICU Bed Capacity:</span>
                      <span className="font-semibold">{selectedEntity.data.icuBeds} / {selectedEntity.data.beds} Beds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Emergency Phone:</span>
                      <span className="font-mono">{selectedEntity.data.contact}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('hospital')}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition cursor-pointer"
                  >
                    Open Hospital Action Panel
                  </button>
                </div>
              )}

              {selectedEntity.type === 'bloodbank' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {selectedEntity.data.name}
                  </h3>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Available Reserves:</span>
                      <span className="font-bold text-rose-600">{selectedEntity.data.currentStock} / {selectedEntity.data.capacity} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Chamber Temp:</span>
                      <span className="font-semibold text-emerald-600">{selectedEntity.data.tempTelemetry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Active Couriers:</span>
                      <span className="font-semibold">{selectedEntity.data.activeCouriers} Emergency Units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">License Number:</span>
                      <span className="font-mono">{selectedEntity.data.licenseNo}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('bloodbank')}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition cursor-pointer"
                  >
                    Manage Facility Inventory
                  </button>
                </div>
              )}

              {selectedEntity.type === 'donor' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {selectedEntity.data.name}
                  </h3>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Blood Group:</span>
                      <span className="font-extrabold text-rose-600">{selectedEntity.data.bloodGroup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Eligibility:</span>
                      <span className="font-bold text-emerald-600">{selectedEntity.data.eligibilityStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Lives Saved:</span>
                      <span className="font-bold">{selectedEntity.data.impactScore} Lives</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Reward Badge:</span>
                      <span className="font-semibold text-amber-500">{selectedEntity.data.badge}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast(`Emergency donation request dispatched to ${selectedEntity.data.name}!`, 'success')}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition cursor-pointer"
                  >
                    Send Direct Emergency Request
                  </button>
                </div>
              )}

              {selectedEntity.type === 'transfer' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-600">{selectedEntity.data.trackingId}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {selectedEntity.data.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {selectedEntity.data.units} Units of {selectedEntity.data.bloodGroup} ({selectedEntity.data.component})
                  </h3>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 space-y-1.5">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Source:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{selectedEntity.data.sourceFacility}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Destination:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{selectedEntity.data.destinationFacility}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-500">Transport:</span>
                      <span className="font-semibold">{selectedEntity.data.transportMode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cold-Chain:</span>
                      <span className="font-semibold text-emerald-600">{selectedEntity.data.temperatureMonitoring}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Live ETA:</span>
                      <span className="font-extrabold text-rose-600">~{selectedEntity.data.currentEtaMinutes} Minutes</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-rose-600" />
                <span>Live Fleet &amp; Cold-Chain Transits</span>
              </h3>

              <div className="space-y-2.5">
                {transfers.map((tr) => (
                  <div
                    key={tr.id}
                    onClick={() => setSelectedEntity({ type: 'transfer', data: tr })}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 hover:border-slate-300 transition cursor-pointer text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-600">{tr.trackingId}</span>
                      <span className="text-rose-600 font-extrabold">{tr.units}x {tr.bloodGroup}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 truncate">
                      {tr.transportMode} → {tr.destinationFacility}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-[10px]">
                      <span className="text-emerald-600 font-medium">{tr.temperatureMonitoring.split(' ')[0]} Chilled</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">ETA ~{tr.currentEtaMinutes} min</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200">
                <span className="font-bold block mb-0.5">Map Instructions:</span>
                Click on any map marker (Hospital, Blood Bank, Donor, or Drone) to view live inventory and trigger instant transfers.
              </div>
            </div>
          )}

          <div className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-200 dark:border-slate-800">
            National GIS Telemetry Grid • OpenStreetMap Layer
          </div>
        </div>
      </div>
    </div>
  );
}
