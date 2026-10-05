import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import {
  Warehouse,
  Thermometer,
  Clock,
  Plus,
  Send,
  AlertTriangle,
  CheckCircle,
  Truck,
  Droplet,
  Radio,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

export default function BloodBankPanel() {
  const { showToast, refreshOverview } = useApp();
  const [bloodBanks, setBloodBanks] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState('bb-1');
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state for adding inventory
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    bloodGroup: 'O+',
    component: 'PRBC',
    units: 50,
    expiryDate: '2026-11-15',
    temperature: '3.2°C'
  });

  useEffect(() => {
    loadBankData();
  }, [selectedBankId]);

  const loadBankData = async () => {
    try {
      setLoading(true);
      const [banks, inv] = await Promise.all([
        api.getBloodBanks(),
        api.getInventory()
      ]);
      setBloodBanks(banks);
      setInventory(inv);
    } catch (err) {
      console.error(err);
      showToast('Failed to load blood bank data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const currentBank = bloodBanks.find(b => b.id === selectedBankId) || bloodBanks[0];
  const bankInventory = inventory.filter(i => i.facilityId === selectedBankId);

  // Expiring batches in < 5 days
  const expiringBatches = bankInventory.filter(i => i.status === 'expiring-soon');

  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      const added = await api.addInventory({
        facilityId: currentBank.id,
        facilityName: currentBank.name,
        bloodGroup: newItem.bloodGroup,
        component: newItem.component,
        units: newItem.units,
        expiryDate: newItem.expiryDate,
        temperature: newItem.temperature
      });

      showToast(`Added ${added.units} units of ${added.bloodGroup} to storage rack!`, 'success');
      setInventory(prev => [added, ...prev]);
      setShowAddModal(false);
      refreshOverview();
    } catch (err) {
      showToast('Failed to add blood unit', 'error');
    }
  };

  const handleExpiryReallocation = async (batch) => {
    try {
      const transfer = await api.createTransfer({
        sourceFacility: currentBank.name,
        destinationFacility: "AIIMS National Medical Institute (High Burn Trauma ICU)",
        bloodGroup: batch.bloodGroup,
        component: batch.component,
        units: batch.units,
        transportMode: "Express Cold-Chain Medical Van"
      });

      showToast(`Expiry Prevention Transfer #${transfer.trackingId} dispatched to AIIMS!`, 'success');
      refreshOverview();
      loadBankData();
    } catch (err) {
      showToast('Failed to dispatch transfer', 'error');
    }
  };

  if (loading || !currentBank) {
    return <div className="p-12 text-center text-slate-500">Loading Blood Bank Management...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header & Bank Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Warehouse className="w-6 h-6 text-rose-600" />
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Blood Bank Facility &amp; Cold-Chain Management
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time batch tracking, cold-chain temperature telemetry, and automated blood expiry prevention.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedBankId}
            onChange={(e) => setSelectedBankId(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white shadow-2xs cursor-pointer focus:ring-2 focus:ring-rose-500"
          >
            {bloodBanks.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.city})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Batch</span>
          </button>
        </div>
      </div>

      {/* Facility Telemetry & Cold-Chain Monitors */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Cold-Chain Telemetry */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">PRBC Chiller Telemetry</span>
            <Thermometer className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {currentBank.tempTelemetry.split(' ')[0]}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Optimal Range: 2°C to 6°C</span>
          </div>
        </div>

        {/* Platelet Agitator */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Platelet Agitator</span>
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            22.1°C
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            Continuous mechanical rotation verified
          </div>
        </div>

        {/* Plasma Freezer */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Deep Freeze FFP</span>
            <Thermometer className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            -25.4°C
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">
            Compliant with WHO/FDA standard (&lt; -20°C)
          </div>
        </div>

        {/* Active Couriers / Drones */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Logistics Fleet</span>
            <Truck className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {currentBank.activeCouriers} <span className="text-xs text-slate-400 font-normal">Vehicles</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            License: <span className="font-mono">{currentBank.licenseNo}</span>
          </div>
        </div>
      </div>

      {/* Signature Expiry Prevention Radar Alert */}
      {expiringBatches.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 p-4 rounded-xl border border-amber-300 dark:border-amber-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500 text-white mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <span>Smart Expiry Prevention Radar Triggered</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-extrabold uppercase">
                    Zero-Waste Algorithm
                  </span>
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                  Identified {expiringBatches.reduce((s, b) => s + b.units, 0)} units reaching shelf-life expiry within 48-72 hours.
                  Automated matching recommends instant transfer to high-turnover trauma centers.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {expiringBatches.map(batch => (
                <button
                  key={batch.id}
                  onClick={() => handleExpiryReallocation(batch)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-2xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>Reallocate Batch #{batch.id} ({batch.bloodGroup})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Facility Inventory Table */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Droplet className="w-5 h-5 text-rose-600" />
            <span>Vault Storage Inventory — {currentBank.name}</span>
          </h3>
          <span className="text-xs text-slate-500">
            Capacity: {currentBank.currentStock} / {currentBank.capacity} units
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="pb-2.5">Batch ID</th>
                <th className="pb-2.5">Blood Group</th>
                <th className="pb-2.5">Component</th>
                <th className="pb-2.5">Units</th>
                <th className="pb-2.5">Collected</th>
                <th className="pb-2.5">Expiry Date</th>
                <th className="pb-2.5">Storage Temp</th>
                <th className="pb-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {bankInventory.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition">
                  <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">{item.id}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      {item.bloodGroup}
                    </span>
                  </td>
                  <td className="py-3 text-slate-800 dark:text-slate-200 font-medium">{item.component}</td>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">{item.units} units</td>
                  <td className="py-3 text-slate-500">{item.collectionDate}</td>
                  <td className="py-3">
                    <span className={item.status === 'expiring-soon' ? 'text-amber-600 font-bold' : 'text-slate-600 dark:text-slate-400'}>
                      {item.expiryDate}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-slate-500">{item.temperature}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'expiring-soon' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      item.status === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                      item.status === 'low' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300' :
                      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Batch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Register Collected Blood Batch
            </h3>

            <form onSubmit={handleAddInventory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Facility:
                </label>
                <input
                  type="text"
                  disabled
                  value={currentBank.name}
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Blood Group:
                  </label>
                  <select
                    value={newItem.bloodGroup}
                    onChange={(e) => setNewItem({ ...newItem, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Component:
                  </label>
                  <select
                    value={newItem.component}
                    onChange={(e) => setNewItem({ ...newItem, component: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="PRBC">PRBC (Packed Red Cells)</option>
                    <option value="Platelets">Platelet Concentrates</option>
                    <option value="FFP">Fresh Frozen Plasma</option>
                    <option value="Cryoprecipitate">Cryoprecipitate</option>
                    <option value="Whole Blood">Whole Blood</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Units Count:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newItem.units}
                    onChange={(e) => setNewItem({ ...newItem, units: e.target.value })}
                    className="w-full px-3 py-2 font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Storage Chamber Temp:
                  </label>
                  <input
                    type="text"
                    value={newItem.temperature}
                    onChange={(e) => setNewItem({ ...newItem, temperature: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expiry Date:
                </label>
                <input
                  type="date"
                  value={newItem.expiryDate}
                  onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                >
                  Confirm &amp; Store Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
