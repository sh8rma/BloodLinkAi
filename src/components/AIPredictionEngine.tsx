import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertOctagon, 
  TrendingDown, 
  Calendar, 
  MapPin, 
  Compass, 
  Activity, 
  RefreshCw, 
  Sliders, 
  CheckCircle, 
  AlertTriangle,
  Send,
  Zap,
  ShieldCheck,
  Building
} from 'lucide-react';
import { ShortagePrediction, BloodGroup, RiskLevel } from '../types/bloodlink';

interface AIPredictionEngineProps {
  predictions: ShortagePrediction[];
  onTriggerEmergencyForGroup: (group: BloodGroup, region: string, reason: string) => void;
}

export const AIPredictionEngine: React.FC<AIPredictionEngineProps> = ({
  predictions,
  onTriggerEmergencyForGroup
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<'7' | '15' | '30' | '90'>('30');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'all' | RiskLevel>('all');
  
  // Scenario simulator state
  const [activeScenario, setActiveScenario] = useState<string>('Festival Holiday Travel Surge (Diwali/Holi)');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<any>(null);

  const filterPredictions = predictions.filter(p => {
    if (selectedRiskFilter === 'all') return true;
    return p.riskLevel === selectedRiskFilter;
  });

  // Call the server endpoint /api/ai/deep-analysis
  const handleRunAiSimulation = async (scenarioToRun?: string) => {
    const sc = scenarioToRun || activeScenario;
    setIsSimulating(true);
    try {
      const response = await fetch('/api/ai/deep-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: sc,
          targetRegion: 'National Multi-Zone Matrix',
          targetBloodGroup: 'O-, A-, and Platelets'
        })
      });
      const data = await response.json();
      setAiReport(data);
    } catch (err) {
      console.error('Failed to run AI simulation:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const scenarios = [
    {
      id: 'festival',
      name: 'Festival Holiday Travel Surge (Diwali/Holi)',
      desc: '+38% highway trauma inflow, -25% voluntary campus donation turnout over 10 days'
    },
    {
      id: 'dengue',
      name: 'Post-Monsoon Dengue Thrombocytopenia Epidemic',
      desc: '+190% platelet apheresis SDP demand, severe inventory exhaustion across metros'
    },
    {
      id: 'disaster',
      name: 'Coastal Cyclone & Industrial Disaster Alert',
      desc: 'Transport corridor blockage, regional blood bank grid power isolation in East Zone'
    },
    {
      id: 'winter',
      name: 'Severe Winter Cold Wave Elective Surgical Backlog',
      desc: 'Concentrated elective surgery resume surge with low elderly donor availability'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Vision Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
            <span>Machine Learning & Neural Forecasting Layer</span>
            <span aria-hidden="true">·</span>
            <span>Epidemiological Modeling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>Predictive Blood Shortage Engine</span>
            <span className="text-xs font-mono font-normal text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
              ML v3.8 Active
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-3xl">
            Synthesizes 5-year historical hospital admission velocity, holiday traffic patterns, disease outbreak epidemiology, and component shelf-life degradation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Horizon Selector */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-medium">
            {(['7', '15', '30', '90'] as const).map(days => (
              <button
                key={days}
                onClick={() => setSelectedHorizon(days)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  selectedHorizon === days
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Model Driver Factors Indicator Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
        {[
          { label: 'Hospital Admissions', status: '+14% Surge', note: 'Trauma & ICU' },
          { label: 'Festive Calendar', status: 'In 9 Days', note: 'Diwali/Holi week' },
          { label: 'Accident Frequency', status: 'High Alert', note: 'Expressway Corridors' },
          { label: 'Disease Outbreaks', status: 'Dengue Tier-2', note: 'Platelet demand' },
          { label: 'Shelf-Life Expiry', status: '35d RBC / 5d PLT', note: 'Continuous decay' },
          { label: 'Thalassemia Queue', status: '100% Locked', note: 'Priority Level 2' },
          { label: 'Inter-Bank Transit', status: '24 min Avg ETA', note: 'Cold-chain tracked' },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-2.5">
            <div className="text-[11px] text-neutral-400 truncate">{item.label}</div>
            <div className="font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">{item.status}</div>
            <div className="text-[10px] text-neutral-500">{item.note}</div>
          </div>
        ))}
      </div>

      {/* 3. Interactive AI Scenario Simulation Studio */}
      <div className="bg-neutral-900 text-white rounded-xl p-5 border border-neutral-800 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-mono mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GEMINI 3.8 FLASH PREDICTIVE REASONING SIMULATOR</span>
            </div>
            <h2 className="text-base font-bold text-white">
              Stress-Test National Grid Under Disaster & Peak Demand Scenarios
            </h2>
          </div>

          <button
            onClick={() => handleRunAiSimulation()}
            disabled={isSimulating}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 self-start md:self-auto transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Computing Neural Forecast...' : 'Run Scenario Simulation'}</span>
          </button>
        </div>

        {/* Preset Scenarios Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {scenarios.map((sc) => {
            const isSelected = activeScenario === sc.name;
            return (
              <button
                key={sc.id}
                onClick={() => {
                  setActiveScenario(sc.name);
                  handleRunAiSimulation(sc.name);
                }}
                className={`text-left p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-950/40 text-white ring-1 ring-rose-500'
                    : 'border-neutral-800 bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300'
                }`}
              >
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>{sc.name}</span>
                  {isSelected && <CheckCircle className="w-3 h-3 text-rose-400 shrink-0" />}
                </div>
                <div className="text-[11px] text-neutral-400 mt-1 line-clamp-2">
                  {sc.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* AI Output Card */}
        {aiReport && (
          <div className="mt-5 p-4 rounded-xl bg-neutral-950/90 border border-neutral-800 space-y-3.5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-mono text-neutral-400">
                  Model Output ({aiReport.source})
                </span>
                <h3 className="text-sm font-bold text-rose-400">
                  {aiReport.result?.projectedRiskRating || 'High Deficit Warning'} · Estimated Shortfall: {aiReport.result?.projectedDeficitUnits || 280} units
                </h3>
              </div>
              <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
                Thalassemia Index: {aiReport.result?.thalassemiaSafetyIndex || '98.4% Protected'}
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {aiReport.result?.strategicAssessment}
            </p>

            {/* Tactical Directives Timeline */}
            <div>
              <div className="text-xs font-semibold text-neutral-300 mb-2">
                Automated Strategic Directives:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {aiReport.result?.tacticalDirectives?.map((dir: any, idx: number) => (
                  <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                      <span className="font-mono text-rose-400 font-semibold">{dir.priority}</span>
                      <span>Target: {dir.targetAudience}</span>
                    </div>
                    <div className="text-neutral-200">
                      {dir.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Camps Recommendation */}
            {aiReport.result?.recommendedCampLocations && (
              <div className="flex flex-wrap items-center gap-2 text-xs pt-1 border-t border-neutral-800/80">
                <span className="text-neutral-400">Recommended Priority Mobilization Sites:</span>
                {aiReport.result.recommendedCampLocations.map((loc: string, idx: number) => (
                  <span key={idx} className="bg-neutral-800 text-neutral-200 px-2 py-0.5 rounded text-[11px] font-mono">
                    {loc}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Risk Level Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            Filter Risk Severity:
          </span>
          <div className="flex items-center gap-1 p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
            {[
              { id: 'all', label: 'All Levels' },
              { id: 'red', label: 'Red (Critical)' },
              { id: 'orange', label: 'Orange (Shortage)' },
              { id: 'yellow', label: 'Yellow (Watchlist)' },
              { id: 'green', label: 'Green (Safe)' },
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRiskFilter(r.id as any)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedRiskFilter === r.id
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-semibold shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          Showing <span className="font-bold text-neutral-900 dark:text-neutral-100">{filterPredictions.length}</span> regional group forecasts for next <span className="font-bold text-neutral-900 dark:text-neutral-100">{selectedHorizon} days</span>
        </div>
      </div>

      {/* 5. Shortage Prediction Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filterPredictions.map((pred) => {
          const demand = selectedHorizon === '7' ? pred.forecastedDemand7Days :
                         selectedHorizon === '15' ? pred.forecastedDemand15Days :
                         selectedHorizon === '30' ? pred.forecastedDemand30Days :
                         pred.forecastedDemand90Days;

          const deficit = Math.max(0, demand - pred.currentStock);

          const borderColors = {
            red: 'border-red-300 dark:border-red-900/60 bg-red-50/30 dark:bg-red-950/20',
            orange: 'border-amber-300 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20',
            yellow: 'border-yellow-200 dark:border-yellow-900/40 bg-yellow-50/20 dark:bg-yellow-950/10',
            green: 'border-emerald-200 dark:border-emerald-900/40 bg-white dark:bg-neutral-900',
          }[pred.riskLevel];

          const badgeStyles = {
            red: 'text-red-700 dark:text-red-400 font-bold',
            orange: 'text-orange-700 dark:text-orange-400 font-bold',
            yellow: 'text-amber-700 dark:text-amber-400 font-semibold',
            green: 'text-emerald-700 dark:text-emerald-400 font-semibold',
          }[pred.riskLevel];

          return (
            <div 
              key={`${pred.bloodGroup}-${pred.region}`}
              className={`border rounded-xl p-4 transition-all flex flex-col justify-between ${borderColors}`}
            >
              <div>
                {/* Header: Blood Group & Risk Label */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold font-mono text-neutral-900 dark:text-neutral-100">
                      {pred.bloodGroup}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {pred.region.split('(')[0]}
                    </span>
                  </div>
                  <span className={`text-xs uppercase font-mono tracking-wider ${badgeStyles}`}>
                    {pred.riskLevel === 'red' ? 'Critical Red' : 
                     pred.riskLevel === 'orange' ? 'Shortage Risk' : 
                     pred.riskLevel === 'yellow' ? 'Watchlist' : 'Safe'}
                  </span>
                </div>

                {/* Numbers Comparison */}
                <div className="grid grid-cols-2 gap-2 my-3 p-2 rounded-lg bg-white/70 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 text-xs">
                  <div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Current Stock</div>
                    <div className="text-base font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                      {pred.currentStock}u
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400">{selectedHorizon}d Forecast</div>
                    <div className="text-base font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                      {demand}u
                    </div>
                  </div>
                </div>

                {/* Deficit callout */}
                {deficit > 0 ? (
                  <div className="text-xs text-red-600 dark:text-red-400 font-semibold mb-2">
                    Projected Deficit: -{deficit} units
                  </div>
                ) : (
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-2">
                    Estimated Buffer: +{pred.currentStock - demand} units
                  </div>
                )}

                {/* Key Drivers */}
                <div className="space-y-1 mb-3">
                  <div className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
                    Primary Predictor Drivers:
                  </div>
                  <ul className="text-[11px] text-neutral-500 dark:text-neutral-400 space-y-0.5 list-disc list-inside">
                    {pred.primaryDrivers.slice(0, 2).map((d, i) => (
                      <li key={i} className="line-clamp-1">{d}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Action & Emergency SOS Trigger */}
              <div className="border-t border-neutral-200/70 dark:border-neutral-800 pt-3 mt-1">
                <div className="text-[11px] text-neutral-600 dark:text-neutral-300 mb-2.5">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">Recommended: </span>
                  {pred.recommendedAction}
                </div>

                {pred.riskLevel === 'red' || pred.riskLevel === 'orange' ? (
                  <button
                    onClick={() => onTriggerEmergencyForGroup(pred.bloodGroup, pred.region, pred.recommendedAction)}
                    className="w-full py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Activate Emergency Donors</span>
                  </button>
                ) : (
                  <div className="text-center py-1 text-[11px] text-neutral-400">
                    Standard protocol sufficient
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
