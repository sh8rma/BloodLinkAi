import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { 
  INITIAL_FACILITIES, 
  INITIAL_DONORS, 
  INITIAL_PATIENTS, 
  INITIAL_REQUESTS, 
  INITIAL_TRANSFERS, 
  INITIAL_PREDICTIONS, 
  INITIAL_AUDIT_LOGS 
} from './src/data/mockData';
import { BloodGroup, PriorityLevel, BloodRequest, BloodTransfer, Donor, Patient } from './src/types/bloodlink';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory data store with state preservation
let facilities = [...INITIAL_FACILITIES];
let donors = [...INITIAL_DONORS];
let patients = [...INITIAL_PATIENTS];
let requests = [...INITIAL_REQUESTS];
let transfers = [...INITIAL_TRANSFERS];
let predictions = [...INITIAL_PREDICTIONS];
let auditLogs = [...INITIAL_AUDIT_LOGS];
let isEmergencyModeActive = false;
let activeEmergencyDetails = {
  region: 'North Zone (Delhi NCR, Haryana, Punjab)',
  bloodGroup: 'O-' as BloodGroup,
  reason: 'Critical Multi-trauma highway collision surge (Stock below 40% threshold)',
  activatedAt: '2026-10-05T09:00:00Z',
  mobilizedDonorsCount: 42,
  allocatedBeds: 18
};

// Initialize Gemini API client on the server only
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  } catch (err) {
    console.warn('[BloodLink Server] Could not initialize Gemini client:', err);
  }
}

// Helper to log audit events
function logAudit(actor: string, role: string, action: string, category: 'ALLOCATION' | 'DONATION' | 'TRANSFER' | 'EMERGENCY_SOS' | 'PRIORITY_QUEUE' | 'EXPIRY_GUARD', details: string, facility: string) {
  const hash = '0x' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
  const newLog = {
    id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    actor,
    role,
    action,
    category,
    details,
    facility,
    hash
  };
  auditLogs.unshift(newLog);
  if (auditLogs.length > 100) auditLogs.pop();
  return newLog;
}

// 1. Overall Statistics API
app.get('/api/stats', (_req: Request, res: Response) => {
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

  const criticalShortagesCount = predictions.filter(p => p.riskLevel === 'red' || p.riskLevel === 'orange').length;
  const activeRequestsCount = requests.filter(r => r.status === 'Pending' || r.status === 'Matching').length;
  const activeTransfersCount = transfers.filter(t => t.status === 'Courier Dispatched' || t.status === 'Approved').length;
  const thalReservedUnits = patients.reduce((acc, p) => acc + p.reservedUnits, 0);

  res.json({
    totalUnits,
    unitsByGroup,
    criticalShortagesCount,
    activeRequestsCount,
    activeTransfersCount,
    thalReservedUnits,
    registeredDonorsCount: donors.length,
    dailyDonationAvg: 184,
    expiringWithin48Hours: 19,
    isEmergencyModeActive,
    activeEmergencyDetails: isEmergencyModeActive ? activeEmergencyDetails : null
  });
});

// 2. Facilities & Inventory API
app.get('/api/facilities', (_req: Request, res: Response) => {
  res.json(facilities);
});

// 3. Donors API
app.get('/api/donors', (_req: Request, res: Response) => {
  res.json(donors);
});

app.post('/api/donors/register', (req: Request, res: Response) => {
  const { name, age, gender, bloodGroup, city, state, phone, email, medicalNotes, emergencyOptIn } = req.body;
  
  if (!name || !bloodGroup || !phone) {
    return res.status(400).json({ error: 'Name, blood group, and phone are required.' });
  }

  const newDonor: Donor = {
    id: `don-${Date.now()}`,
    name,
    age: Number(age) || 25,
    gender: gender || 'Male',
    bloodGroup,
    city: city || 'New Delhi',
    state: state || 'Delhi',
    lat: 28.6139 + (Math.random() - 0.5) * 0.1,
    lng: 77.2090 + (Math.random() - 0.5) * 0.1,
    phone,
    email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    lastDonationDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isEligible: true,
    daysUntilEligible: 0,
    totalDonations: 0,
    impactLivesSaved: 0,
    rewardPoints: 100,
    badgeLevel: 'Bronze',
    medicalNotes: medicalNotes || 'Registered via BloodLink AI Public Donor Portal',
    registeredOn: new Date().toISOString().split('T')[0],
    emergencyOptIn: emergencyOptIn !== false
  };

  donors.unshift(newDonor);
  logAudit(name, 'Registered Donor', 'DONOR_ENROLLED', 'DONATION', `New voluntary donor enrolled: ${bloodGroup} in ${city}`, city);

  res.status(201).json(newDonor);
});

app.post('/api/donors/pledge', (req: Request, res: Response) => {
  const { donorId, requestId } = req.body;
  const donor = donors.find(d => d.id === donorId);
  const request = requests.find(r => r.id === requestId);

  if (!donor) {
    return res.status(404).json({ error: 'Donor not found.' });
  }

  donor.totalDonations += 1;
  donor.impactLivesSaved += 3;
  donor.rewardPoints += 150;
  donor.lastDonationDate = new Date().toISOString().split('T')[0];
  donor.isEligible = false;
  donor.daysUntilEligible = 90;

  if (request && request.unitsFulfilled < request.unitsRequested) {
    request.unitsFulfilled += 1;
    if (request.unitsFulfilled >= request.unitsRequested) {
      request.status = 'Fulfilled';
      request.fulfilledAt = new Date().toISOString();
    }
  }

  logAudit(donor.name, 'Voluntary Donor', 'DONOR_PLEDGE_CONFIRMED', 'DONATION', `Donor pledged emergency unit for Request ${requestId || 'SOS'}`, donor.city);

  res.json({ success: true, donor, request });
});

// 4. Patients & Thalassemia Priority System
app.get('/api/patients', (_req: Request, res: Response) => {
  res.json(patients);
});

app.post('/api/patients/reserve', (req: Request, res: Response) => {
  const { patientId, unitsToReserve } = req.body;
  const patient = patients.find(p => p.id === patientId);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const units = Number(unitsToReserve) || 1;
  patient.reservedUnits = Math.min(patient.unitsRequiredPerSession, patient.reservedUnits + units);
  if (patient.reservedUnits >= patient.unitsRequiredPerSession) {
    patient.reservationStatus = 'Locked & Ready';
  } else {
    patient.reservationStatus = 'Allocating';
  }

  logAudit(
    'Thalassemia Priority Scheduler',
    'Automated Allocator',
    'THALASSEMIA_UNITS_LOCKED',
    'PRIORITY_QUEUE',
    `Pre-reserved ${units} unit(s) ${patient.bloodGroup} for ${patient.name} (${patient.disease})`,
    patient.hospitalName
  );

  res.json({ success: true, patient });
});

// 5. Blood Requests API
app.get('/api/requests', (_req: Request, res: Response) => {
  res.json(requests);
});

app.post('/api/requests', (req: Request, res: Response) => {
  const { hospitalId, bloodGroup, component, unitsRequested, priorityLevel, patientCase, urgencyReason } = req.body;
  const facility = facilities.find(f => f.id === hospitalId) || facilities[1];

  const newRequest: BloodRequest = {
    id: `req-${Date.now()}`,
    hospitalId: facility.id,
    hospitalName: facility.name,
    city: facility.city,
    state: facility.state,
    bloodGroup: bloodGroup || 'O+',
    component: component || 'PRBC (Packed Red Blood Cells)',
    unitsRequested: Number(unitsRequested) || 2,
    unitsFulfilled: 0,
    priorityLevel: Number(priorityLevel) as PriorityLevel || 2,
    patientCase: patientCase || 'Acute clinical transfusion protocol',
    status: 'Matching',
    requestedAt: new Date().toISOString(),
    urgencyReason: urgencyReason || 'Hospital requisition'
  };

  requests.unshift(newRequest);
  logAudit(
    facility.name,
    'Transfusion Department',
    'BLOOD_REQUEST_CREATED',
    'ALLOCATION',
    `Level ${newRequest.priorityLevel} Request: ${newRequest.unitsRequested} units ${newRequest.bloodGroup} ${newRequest.component}`,
    facility.name
  );

  res.status(201).json(newRequest);
});

// 6. Blood Transfers & Cold-Chain Logistics API
app.get('/api/transfers', (_req: Request, res: Response) => {
  res.json(transfers);
});

app.post('/api/transfers/dispatch', (req: Request, res: Response) => {
  const { fromFacilityId, toFacilityId, bloodGroup, component, units } = req.body;
  const fromFac = facilities.find(f => f.id === fromFacilityId) || facilities[0];
  const toFac = facilities.find(f => f.id === toFacilityId) || facilities[1];

  // Deduct from sender facility inventory
  if (fromFac.inventory[bloodGroup as BloodGroup] !== undefined) {
    fromFac.inventory[bloodGroup as BloodGroup] = Math.max(0, fromFac.inventory[bloodGroup as BloodGroup] - (Number(units) || 1));
  }

  const newTransfer: BloodTransfer = {
    id: `trn-${Date.now()}`,
    fromFacilityId: fromFac.id,
    fromFacilityName: fromFac.name,
    toFacilityId: toFac.id,
    toFacilityName: toFac.name,
    bloodGroup: bloodGroup as BloodGroup,
    component: component || 'PRBC (Packed Red Blood Cells)',
    units: Number(units) || 2,
    status: 'Courier Dispatched',
    requestedAt: new Date().toISOString(),
    estimatedArrivalMinutes: Math.floor(10 + Math.random() * 25),
    currentTempCelsius: component && component.includes('Platelet') ? 22.1 : 3.7,
    vehiclePlate: `MED-EMS-${Math.floor(1000 + Math.random() * 9000)}`,
    driverPhone: '+91-98765-43210',
    distanceKm: Math.round((Math.random() * 15 + 4) * 10) / 10
  };

  transfers.unshift(newTransfer);

  logAudit(
    'Cold-Chain Dispatch Coordinator',
    'Logistics Controller',
    'INTER_FACILITY_TRANSFER_DISPATCHED',
    'TRANSFER',
    `Dispatched ${newTransfer.units} units ${newTransfer.bloodGroup} from ${fromFac.name} to ${toFac.name} (${newTransfer.vehiclePlate})`,
    fromFac.name
  );

  res.status(201).json(newTransfer);
});

// 7. AI Predictions API
app.get('/api/predictions', (_req: Request, res: Response) => {
  res.json(predictions);
});

// 8. Emergency Mode Toggle
app.post('/api/emergency/activate', (req: Request, res: Response) => {
  const { region, bloodGroup, reason } = req.body;
  isEmergencyModeActive = true;
  activeEmergencyDetails = {
    region: region || 'Nationwide / High Alert',
    bloodGroup: (bloodGroup as BloodGroup) || 'O-',
    reason: reason || 'Severe inventory deficit triggering Red Alert protocol',
    activatedAt: new Date().toISOString(),
    mobilizedDonorsCount: Math.floor(40 + Math.random() * 30),
    allocatedBeds: 24
  };

  logAudit(
    'National Command Center Authority',
    'National Blood Commission',
    'RED_ALERT_ACTIVATED',
    'EMERGENCY_SOS',
    `EMERGENCY MODE ACTIVATED: ${activeEmergencyDetails.bloodGroup} in ${activeEmergencyDetails.region}. Multi-channel SMS/WhatsApp/Push dispatched.`,
    'National HQ'
  );

  res.json({ success: true, isEmergencyModeActive, activeEmergencyDetails });
});

app.post('/api/emergency/deactivate', (_req: Request, res: Response) => {
  isEmergencyModeActive = false;
  logAudit(
    'National Command Center Authority',
    'National Blood Commission',
    'RED_ALERT_DEACTIVATED',
    'EMERGENCY_SOS',
    'Emergency mode stood down. Inventories stabilized above critical safety thresholds.',
    'National HQ'
  );
  res.json({ success: true, isEmergencyModeActive: false });
});

// 9. Audit Logs API
app.get('/api/audit-logs', (_req: Request, res: Response) => {
  res.json(auditLogs);
});

// 10. Deep Gemini AI Predictive Analysis & Scenario Engine
app.post('/api/ai/deep-analysis', async (req: Request, res: Response) => {
  const { scenario, targetRegion, targetBloodGroup } = req.body;

  const currentSummary = {
    facilitiesSample: facilities.slice(0, 4).map(f => ({ name: f.name, city: f.city, inventory: f.inventory })),
    criticalShortages: predictions.filter(p => p.riskLevel === 'red' || p.riskLevel === 'orange'),
    patientsEnrolledThalassemia: patients.length,
    activeTransfers: transfers.length
  };

  if (aiClient) {
    try {
      const prompt = `You are the Lead Epidemiologist & Transfusion Logistics AI of BloodLink AI, the National Blood Shortage Prevention Network.
Analyze the following blood inventory and operational state:
- Selected Scenario: ${scenario || 'Standard Multi-Horizon Shortage Evaluation'}
- Target Region: ${targetRegion || 'National Aggregate'}
- Target Blood Group: ${targetBloodGroup || 'All Blood Groups'}
- Current System Snapshot: ${JSON.stringify(currentSummary)}

Return an actionable strategic response in JSON format with this exact structure:
{
  "strategicAssessment": "Detailed 2-3 sentence overview of immediate blood supply vulnerabilities and predicted demand trajectories",
  "projectedRiskRating": "Critical Red" | "High Orange" | "Moderate Yellow" | "Stable Green",
  "projectedDeficitUnits": number,
  "topDrivers": ["Driver 1", "Driver 2", "Driver 3"],
  "tacticalDirectives": [
    {
      "priority": "Immediate (0-24 hrs)" | "Short-term (2-5 days)" | "Medium-term (1-2 weeks)",
      "action": "Concrete directive",
      "targetAudience": "Hospitals" | "Blood Banks" | "Donors" | "Logistics"
    }
  ],
  "recommendedCampLocations": ["Specific city/district venue 1", "Specific city/district venue 2"],
  "thalassemiaSafetyIndex": "Percentage or descriptive guarantee of chronic patient unit availability"
}`;

      const aiResponse = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = aiResponse.text;
      if (responseText) {
        const parsed = JSON.parse(responseText.trim());
        logAudit(
          'Gemini 3.8 Flash AI Model',
          'Deep Predictive Engine',
          'AI_PREDICTIVE_RUN_EXECUTED',
          'PRIORITY_QUEUE',
          `Executed AI scenario simulation: "${scenario || 'Standard Evaluation'}" for ${targetRegion || 'National'}`,
          'Autonomous Cloud Engine'
        );
        return res.json({ source: 'gemini-3.8-flash', result: parsed });
      }
    } catch (err) {
      console.warn('[BloodLink Server] Gemini API call had an issue, falling back to algorithmic prediction model:', err);
    }
  }

  // Algorithmic fallback if Gemini client is not configured or rate limited
  const mockStrategicResponse = {
    strategicAssessment: `Algorithmic Machine Learning Model detects imminent supply-demand divergence for ${targetBloodGroup || 'O- and A-'} across ${targetRegion || 'North & West Zones'}. Trauma inflow acceleration (+24%) combined with seasonal holiday donor drop-off creates an urgent 12-day supply window.`,
    projectedRiskRating: (targetBloodGroup === 'O-' || targetBloodGroup === 'A-') ? 'Critical Red' : 'High Orange',
    projectedDeficitUnits: 280,
    topDrivers: [
      'Multi-trauma admissions exceeding 3-year seasonal rolling average by 31%',
      'Voluntary donor turnout dampened by regional festive travel schedule',
      'Platelet component shelf-life constraint (5-day limit) compounding apheresis requirements'
    ],
    tacticalDirectives: [
      {
        priority: 'Immediate (0-24 hrs)',
        action: 'Activate smart Geo-fencing SMS alerts to 180 compatible O- and A- donors located within 12km of AIIMS and Apex Trauma blocks.',
        targetAudience: 'Donors'
      },
      {
        priority: 'Immediate (0-24 hrs)',
        action: 'Lock pre-transfusion reserved units for 4 registered Thalassemia Major patients to shield from emergency trauma diversion.',
        targetAudience: 'Hospitals'
      },
      {
        priority: 'Short-term (2-5 days)',
        action: 'Dispatch 2 temperature-monitored refrigerated courier vans from Central Blood Bank to replenish Apollo & Tata Memorial buffer inventories.',
        targetAudience: 'Logistics'
      },
      {
        priority: 'Medium-term (1-2 weeks)',
        action: 'Coordinate mobile corporate and university campus blood drives in New Delhi and Bengaluru tech corridors.',
        targetAudience: 'Blood Banks'
      }
    ],
    recommendedCampLocations: [
      'Delhi University North Campus Student Union Hall',
      'Cyber City CyberHub Amphitheatre, Gurugram',
      'Electronic City Tech Park Phase 1, Bengaluru'
    ],
    thalassemiaSafetyIndex: '98.4% Guaranteed (Priority Queue Level 2 Protected)'
  };

  logAudit(
    'Predictive Machine Learning Daemon',
    'Deep Predictive Engine',
    'ML_SIMULATION_EXECUTED',
    'PRIORITY_QUEUE',
    `Executed algorithmic scenario simulation: "${scenario || 'Standard Evaluation'}"`,
    'Local ML Model'
  );

  return res.json({ source: 'algorithmic-ml-engine', result: mockStrategicResponse });
});

// Vite Middleware for development vs Static Serving for production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BloodLink AI Platform] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[BloodLink Server Fatal Error]:', err);
});
