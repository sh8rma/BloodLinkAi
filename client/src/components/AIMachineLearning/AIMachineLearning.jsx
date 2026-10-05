import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import {
  Cpu,
  Sparkles,
  Sliders,
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
  Calendar,
  Layers,
  Activity,
  RefreshCw,
  Flame,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

export default function AIMachineLearning() {
  const { showToast } = useApp();
  const [horizon, setHorizon] = useState(15); // 7, 15, 30, 90
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);

  // Scenario Simulator Parameters
  const [scenario, setScenario] = useState({
    festivalFactor: 1.0,
    outbreakFactor: 1.0,
    traumaFactor: 1.0,
    admissionFactor: 1.0
  });
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async (overrides = scenario) => {
    try {
      setLoading(true);
      const data = await api.simulateScenario(overrides);
      setPredictions(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to compute AI forecast', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyScenario = async () => {
    setSimulating(true);
    await fetchPredictions(scenario);
    showToast('AI Model re-evaluated risk matrix across all horizons!', 'success');
    setSimulating(false);
  };

  const handleQuickPreset = (preset) => {
    let newScen = { festivalFactor: 1.0, outbreakFactor: 1.0, traumaFactor: 1.0, admissionFactor: 1.0 };
    if (preset === 'diwali') {
      newScen = { festivalFactor: 2.0, outbreakFactor: 1.0, traumaFactor: 1.4, admissionFactor: 1.1 };
      showToast('Applied "Festive Holiday Slump" simulation preset', 'info');
    } else if (preset === 'dengue') {
      newScen = { festivalFactor: 1.0, outbreakFactor: 2.6, traumaFactor: 1.1, admissionFactor: 1.4 };
      showToast('Applied "Monsoon Dengue Platelet Epidemic" preset', 'info');
    } else if (preset === 'trauma') {
      newScen = { festivalFactor: 1.0, outbreakFactor: 1.0, traumaFactor: 2.2, admissionFactor: 1.3 };
      showToast('Applied "Mass Highway Collision Crisis" preset', 'info');
    } else {
      showToast('Reset scenario parameters to national baseline', 'info');
    }
    setScenario(newScen);
    fetchPredictions(newScen);
  };

  if (loading && !predictions) {
    return <div className="p-12 text-center text-slate-500">Loading AI Machine Learning Core...</div>;
  }

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const getRiskStyle = (risk) => {
    switch (risk) {
      case 'Red':
        return { badge: 'bg-red-600 text-white', border: 'border-red-500/80', bg: 'bg-red-50/60 dark:bg-red-950/30' };
      case 'Orange':
        return { badge: 'bg-amber-600 text-white', border: 'border-amber-500/80', bg: 'bg-amber-50/60 dark:bg-amber-950/30' };
      case 'Yellow':
        return { badge: 'bg-yellow-500 text-slate-900', border: 'border-yellow-400', bg: 'bg-yellow-50/60 dark:bg-yellow-950/20' };
      default:
        return { badge: 'bg-emerald-600 text-white', border: 'border-emerald-500/80', bg: 'bg-emerald-50/60 dark:bg-emerald-950/20' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-rose-600 to-indigo-600 text-white shadow-md">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  AI Blood Shortage Prediction Engine
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-900">
                  GB-MHTS Core
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Multi-horizon predictive forecasting (7d, 15d, 30d, 90d) factoring historical consumption, festival slumps, outbreaks &amp; trauma surges.
              </p>
            </div>
          </div>
        </div>

        {/* Horizon Selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {[7, 15, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setHorizon(d)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                horizon === d
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {d} Days Forecast
            </button>
          ))}
        </div>
      </div>

      {/* Interactive "What-If" Scenario Simulator */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl border border-indigo-900/60 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold">
              Interactive "What-If" Scenario Simulator &amp; Stress Testing
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuickPreset('diwali')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white/10 hover:bg-white/20 text-indigo-200 cursor-pointer"
            >
              🎉 Festive Slump
            </button>
            <button
              onClick={() => handleQuickPreset('dengue')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white/10 hover:bg-white/20 text-indigo-200 cursor-pointer"
            >
              🦟 Dengue Outbreak
            </button>
            <button
              onClick={() => handleQuickPreset('trauma')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white/10 hover:bg-white/20 text-indigo-200 cursor-pointer"
            >
              🚗 Highway Trauma
            </button>
            <button
              onClick={() => handleQuickPreset('baseline')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white/10 hover:bg-white/20 text-indigo-200 cursor-pointer"
            >
              🔄 Reset Baseline
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Festive Slump */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-indigo-200">Holiday Donation Slump:</span>
              <span className="text-amber-400 font-bold">{scenario.festivalFactor.toFixed(1)}x Factor</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.1"
              value={scenario.festivalFactor}
              onChange={(e) => setScenario({ ...scenario, festivalFactor: parseFloat(e.target.value) })}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Simulates -35% donor turnout during holidays</span>
          </div>

          {/* Outbreak Surge */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-indigo-200">Disease Outbreak (Dengue):</span>
              <span className="text-rose-400 font-bold">{scenario.outbreakFactor.toFixed(1)}x Factor</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="3.0"
              step="0.1"
              value={scenario.outbreakFactor}
              onChange={(e) => setScenario({ ...scenario, outbreakFactor: parseFloat(e.target.value) })}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Multiplies platelet &amp; whole blood demand</span>
          </div>

          {/* Trauma Spike */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-indigo-200">Accident / Disaster Surge:</span>
              <span className="text-red-400 font-bold">{scenario.traumaFactor.toFixed(1)}x Factor</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.1"
              value={scenario.traumaFactor}
              onChange={(e) => setScenario({ ...scenario, traumaFactor: parseFloat(e.target.value) })}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Acute drain on universal O- &amp; B+ reserves</span>
          </div>

          {/* Hospital Admission Rate */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-indigo-200">Admission Rate Multiplier:</span>
              <span className="text-emerald-400 font-bold">{scenario.admissionFactor.toFixed(1)}x Factor</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="2.0"
              step="0.1"
              value={scenario.admissionFactor}
              onChange={(e) => setScenario({ ...scenario, admissionFactor: parseFloat(e.target.value) })}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Scales elective surgery bed occupancy</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <button
            onClick={handleApplyScenario}
            disabled={simulating}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{simulating ? 'Re-evaluating Neural Weights...' : 'Execute What-If Model Recalculation'}</span>
          </button>
        </div>
      </div>

      {/* Forecast Output Cards for Selected Horizon */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{horizon}-Day Depletion Forecast &amp; Deficit Prediction</span>
            <span className="text-xs font-normal text-slate-500">
              (Multi-horizon output based on active scenario parameters)
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bloodGroups.map((bg) => {
            const groupData = predictions?.bloodGroupForecasts?.[bg];
            if (!groupData) return null;
            const hData = groupData.horizons[`day_${horizon}`];
            if (!hData) return null;

            const style = getRiskStyle(hData.riskLevel);

            return (
              <div
                key={bg}
                className={`p-4 rounded-xl border-2 ${style.border} ${style.bg} transition-all shadow-2xs hover:shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {bg}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Stock: {groupData.currentStock}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 text-xs font-extrabold rounded-md uppercase tracking-wider ${style.badge}`}>
                    {hData.riskBadge}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50">
                    <span className="text-slate-400 block text-[10px]">Projected Demand:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {hData.projectedDemand} <span className="text-[10px] font-normal text-slate-400">units</span>
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50">
                    <span className="text-slate-400 block text-[10px]">Expected Inflow:</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                      {hData.projectedInflow} <span className="text-[10px] font-normal text-slate-400">units</span>
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500">Buffer Remaining:</span>
                  <span className={`font-extrabold ${hData.daysOfSupply <= 3 ? 'text-red-600' : 'text-slate-800 dark:text-slate-200'}`}>
                    {hData.daysOfSupply} Days of Supply
                  </span>
                </div>

                {hData.netDeficit > 0 && (
                  <div className="mt-2 text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Projected Shortage Deficit: -{hData.netDeficit} units</span>
                  </div>
                )}

                <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 italic">
                  {groupData.primaryDeficitReason}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Regional Shortage Risk Matrix & Model Transparency Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Risk Matrix */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-600" />
            <span>Regional Shortage Vulnerability Matrix</span>
          </h3>

          <div className="space-y-3">
            {predictions?.regionalForecasts?.map((reg) => (
              <div
                key={reg.name}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    {reg.name}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Hub: {reg.primaryHospital} • High-Risk Phenotypes: {reg.deficitGroups.join(', ')}
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    reg.risk === 'Red' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                    reg.risk === 'Orange' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
                  }`}>
                    {reg.risk} Alert ({reg.shortageProb}% Prob)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Machine Learning Model Performance Metrics */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>ML Architecture &amp; Calibration Metrics</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px]">Algorithm Architecture:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {predictions?.modelMetrics?.algorithm}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px]">R² Goodness of Fit</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
                  {predictions?.modelMetrics?.r2Score}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px]">Mean Absolute Error</span>
                <span className="font-extrabold text-rose-600 dark:text-rose-400 text-base">
                  {predictions?.modelMetrics?.meanAbsoluteError}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px]">Confidence Interval</span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 text-base">
                  {predictions?.modelMetrics?.predictionIntervalConfidence}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px] font-semibold">Feature Weight Importance:</span>
              <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300">
                <span>Historical Hospital Burn Rate</span>
                <span className="font-bold">35%</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300">
                <span>Festival &amp; Holiday Slump Penalties</span>
                <span className="font-bold">18%</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300">
                <span>Vector-Borne Disease Epidemics</span>
                <span className="font-bold">16%</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300">
                <span>Highway Trauma &amp; Emergency Incidents</span>
                <span className="font-bold">14%</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300">
                <span>Shelf-Life Expiry Decay</span>
                <span className="font-bold">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
