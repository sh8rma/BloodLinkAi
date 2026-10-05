import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db/database.js';
import { ShortagePredictionEngine } from './ai/predictionEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '../client/dist');


const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;
const predictionEngine = new ShortagePredictionEngine(db);

app.use(cors());
app.use(express.json());

// Real-Time Socket Connection Handling
io.on('connection', (socket) => {
  // Send current national overview and emergency status upon connecting
  socket.emit('initial:state', {
    overview: db.getNationalOverview(),
    emergencyMode: db.emergencyMode
  });

  socket.on('disconnect', () => {
    // client disconnected
  });
});

// Helper to broadcast state changes
function broadcastUpdate(eventName, payload) {
  io.emit(eventName, payload);
  io.emit('overview:updated', db.getNationalOverview());
}

// ==========================================
// 1. NATIONAL COMMAND CENTER ENDPOINTS
// ==========================================

app.get('/api/national/overview', (req, res) => {
  res.json(db.getNationalOverview());
});

app.get('/api/hospitals', (req, res) => {
  res.json(db.hospitals);
});

app.get('/api/blood-banks', (req, res) => {
  res.json(db.bloodBanks);
});

app.get('/api/inventory', (req, res) => {
  const { facilityId, bloodGroup, component, status } = req.query;
  let items = [...db.inventory];

  if (facilityId) items = items.filter(i => i.facilityId === facilityId);
  if (bloodGroup) items = items.filter(i => i.bloodGroup === bloodGroup);
  if (component) items = items.filter(i => i.component === component);
  if (status) items = items.filter(i => i.status === status);

  res.json(items);
});

app.post('/api/inventory/add', (req, res) => {
  const { facilityId, facilityName, bloodGroup, component, units, expiryDate, temperature } = req.body;
  if (!bloodGroup || !units) {
    return res.status(400).json({ error: "Missing required inventory fields" });
  }

  const newItem = {
    id: `inv-${Date.now().toString().slice(-5)}`,
    facilityId: facilityId || "bb-1",
    facilityName: facilityName || "National Red Cross Hub",
    bloodGroup,
    component: component || "PRBC",
    units: parseInt(units, 10),
    collectionDate: new Date().toISOString().split('T')[0],
    expiryDate: expiryDate || "2026-11-10",
    temperature: temperature || "3.2°C",
    status: "available"
  };

  db.inventory.unshift(newItem);
  db.logAudit(
    "INVENTORY_UNIT_ADDED",
    req.body.actor || "Blood Bank Officer",
    "Blood Bank Management",
    newItem.facilityName,
    `Added ${newItem.units} units of ${newItem.bloodGroup} (${newItem.component}) - Batch #${newItem.id}`
  );

  broadcastUpdate('inventory:updated', newItem);
  res.status(201).json(newItem);
});

app.post('/api/inventory/update', (req, res) => {
  const { id, units, status } = req.body;
  const item = db.inventory.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: "Inventory unit not found" });

  if (units !== undefined) item.units = parseInt(units, 10);
  if (status !== undefined) item.status = status;

  db.logAudit(
    "INVENTORY_UNIT_UPDATED",
    req.body.actor || "Inventory Auditor",
    "Quality Control",
    item.facilityName,
    `Updated Batch #${id} units to ${item.units}, status: ${item.status}`
  );

  broadcastUpdate('inventory:updated', item);
  res.json(item);
});

// ==========================================
// 2. AI PREDICTION ENGINE ENDPOINTS
// ==========================================

app.get('/api/predictions', (req, res) => {
  const festivalFactor = parseFloat(req.query.festivalFactor) || 1.0;
  const outbreakFactor = parseFloat(req.query.outbreakFactor) || 1.0;
  const traumaFactor = parseFloat(req.query.traumaFactor) || 1.0;
  const admissionFactor = parseFloat(req.query.admissionFactor) || 1.0;

  const forecasts = predictionEngine.generateForecasts({
    festivalFactor,
    outbreakFactor,
    traumaFactor,
    admissionFactor
  });
  res.json(forecasts);
});

app.post('/api/predictions/simulate', (req, res) => {
  const scenario = req.body;
  const forecasts = predictionEngine.generateForecasts(scenario);

  db.logAudit(
    "AI_SCENARIO_SIMULATION_EXECUTED",
    req.body.actor || "AI Policy Analyst",
    "National Command AI",
    "National Command Center",
    `Simulated What-If scenario: Outbreak=${scenario.outbreakFactor || 1.0}x, Festive=${scenario.festivalFactor || 1.0}x, Trauma=${scenario.traumaFactor || 1.0}x`
  );

  res.json(forecasts);
});

app.get('/api/transfers/recommendations', (req, res) => {
  const recommendations = predictionEngine.generateTransferRecommendations();
  res.json(recommendations);
});

// ==========================================
// 3. TRANSFERS & LOGISTICS ENDPOINTS
// ==========================================

app.get('/api/transfers', (req, res) => {
  res.json(db.transfers);
});

app.post('/api/transfers/create', (req, res) => {
  const { sourceFacility, destinationFacility, bloodGroup, component, units, transportMode } = req.body;
  
  const newTransfer = {
    id: `tr-${Date.now().toString().slice(-5)}`,
    trackingId: `BL-XFER-${Math.floor(1000 + Math.random() * 9000)}`,
    sourceFacility: sourceFacility || "National Red Cross Hub, Delhi",
    destinationFacility: destinationFacility || "AIIMS National Medical Institute",
    bloodGroup: bloodGroup || "O-",
    component: component || "PRBC",
    units: parseInt(units, 10) || 2,
    transportMode: transportMode || "Autonomous Medical Cold-Chain Drone",
    driverOrDroneId: transportMode?.includes("Drone") ? `AERO-MED-0${Math.floor(1 + Math.random() * 8)}` : `EMS-VAN-${Math.floor(10 + Math.random() * 80)}`,
    temperatureMonitoring: "3.2°C (Cold-chain Verified Active)",
    currentEtaMinutes: Math.floor(8 + Math.random() * 20),
    status: "In-Transit",
    lat: 28.5800 + (Math.random() - 0.5) * 0.05,
    lng: 77.2100 + (Math.random() - 0.5) * 0.05,
    dispatchedAt: new Date().toISOString()
  };

  db.transfers.unshift(newTransfer);
  db.logAudit(
    "DISPATCH_INTER_FACILITY_TRANSFER",
    req.body.actor || "AI Logistics Dispatcher",
    "Logistics Command",
    newTransfer.sourceFacility,
    `Dispatched ${newTransfer.units} units of ${newTransfer.bloodGroup} ${newTransfer.component} to ${newTransfer.destinationFacility} via ${newTransfer.transportMode}`
  );

  broadcastUpdate('transfer:dispatched', newTransfer);
  res.status(201).json(newTransfer);
});

// ==========================================
// 4. BLOOD REQUESTS & HOSPITAL ENDPOINTS
// ==========================================

app.get('/api/requests', (req, res) => {
  res.json(db.requests);
});

app.post('/api/requests/create', (req, res) => {
  const { requestingFacilityId, requestingFacilityName, bloodGroup, component, units, priority, patientName, condition } = req.body;

  const priorityLabels = {
    1: "Level 1: Life-Threatening Emergency",
    2: "Level 2: Thalassemia Monthly Transfusion",
    3: "Level 3: Scheduled Surgeries",
    4: "Level 4: Regular Patient Requests"
  };

  const newRequest = {
    id: `req-${Date.now().toString().slice(-5)}`,
    requestingFacilityId: requestingFacilityId || "hosp-1",
    requestingFacilityName: requestingFacilityName || "AIIMS National Medical Institute",
    bloodGroup: bloodGroup || "O-",
    component: component || "PRBC",
    units: parseInt(units, 10) || 2,
    priority: parseInt(priority, 10) || 1,
    priorityLabel: priorityLabels[priority] || "Level 1: Life-Threatening Emergency",
    patientName: patientName || "Emergency Trauma Patient",
    condition: condition || "Urgent Resuscitation",
    status: "Pending Transfer",
    timestamp: new Date().toISOString(),
    aiRecommendation: `AI prioritized queue position #${db.requests.filter(r => r.priority <= (priority || 1)).length + 1}. Auto-alert dispatched.`
  };

  db.requests.unshift(newRequest);

  db.logAudit(
    `REQUEST_CREATED_PRIORITY_${newRequest.priority}`,
    req.body.actor || "Chief Medical Officer",
    "Hospital Administration",
    newRequest.requestingFacilityName,
    `Raised ${newRequest.priorityLabel} for ${newRequest.units} units of ${newRequest.bloodGroup} (${newRequest.patientName})`
  );

  // If Priority 1, trigger urgent notification
  if (newRequest.priority === 1) {
    db.dispatchNotification(
      "NEARBY_COMPATIBLE_DONORS_BROADCAST",
      "SMS & WhatsApp Priority",
      "LEVEL_1_EMERGENCY_ALERT",
      `CRITICAL ALERT: Level 1 Blood Request at ${newRequest.requestingFacilityName}`,
      `Urgent requirement for ${newRequest.units} units of ${newRequest.bloodGroup} for trauma patient ${newRequest.patientName}.`
    );
  }

  broadcastUpdate('request:created', newRequest);
  res.status(201).json(newRequest);
});

app.post('/api/requests/:id/dispatch', (req, res) => {
  const { id } = req.params;
  const request = db.requests.find(r => r.id === id);
  if (!request) return res.status(404).json({ error: "Request not found" });

  request.status = "Dispatched";
  db.logAudit(
    "REQUEST_DISPATCHED",
    req.body.actor || "Transfusion Lead",
    "Hospital Panel",
    request.requestingFacilityName,
    `Request #${id} for ${request.bloodGroup} (${request.units} units) marked as Dispatched & In-Transit.`
  );

  broadcastUpdate('request:updated', request);
  res.json(request);
});

// ==========================================
// 5. DONOR PANEL & AI MATCHING
// ==========================================

app.get('/api/donors', (req, res) => {
  res.json(db.donors);
});

app.post('/api/donors/register', (req, res) => {
  const { name, age, gender, bloodGroup, city, state, lat, lng, contact, email, hemoglobin, weightKg } = req.body;
  if (!name || !bloodGroup) {
    return res.status(400).json({ error: "Name and blood group are required" });
  }

  const newDonor = {
    id: `dn-${Date.now().toString().slice(-5)}`,
    name,
    age: parseInt(age, 10) || 28,
    gender: gender || "Male",
    bloodGroup,
    city: city || "New Delhi",
    state: state || "Delhi",
    lat: parseFloat(lat) || 28.6139,
    lng: parseFloat(lng) || 77.2090,
    contact: contact || "+91 98000 00000",
    email: email || "donor@example.com",
    lastDonationDate: new Date().toISOString().split('T')[0],
    eligibilityStatus: "Eligible Now",
    daysUntilEligible: 0,
    donationCount: 1,
    impactScore: 3,
    rewardPoints: 100,
    badge: "Welcome Lifesaver",
    medicalHistory: {
      hemoglobin: parseFloat(hemoglobin) || 14.0,
      weightKg: parseFloat(weightKg) || 68,
      bp: "120/80",
      chronicConditions: "None"
    },
    readyForEmergencyCall: true
  };

  db.donors.unshift(newDonor);
  db.logAudit(
    "DONOR_REGISTERED",
    newDonor.name,
    "Registered Citizen Donor",
    newDonor.city,
    `New donor registered with blood group ${newDonor.bloodGroup}, ready for emergency activations.`
  );

  db.dispatchNotification(
    newDonor.contact,
    "SMS & WhatsApp",
    "REGISTRATION_WELCOME",
    "Welcome to BloodLink AI Network",
    `Thank you ${newDonor.name} for registering as a ${newDonor.bloodGroup} lifesaver. You will receive notifications when nearby hospitals need your blood type.`
  );

  broadcastUpdate('donor:registered', newDonor);
  res.status(201).json(newDonor);
});

app.post('/api/donors/match', (req, res) => {
  const { bloodGroup, lat, lng, radiusKm } = req.body;
  if (!bloodGroup) {
    return res.status(400).json({ error: "bloodGroup is required for matching" });
  }

  const userLat = parseFloat(lat) || 28.5672; // default Delhi AIIMS
  const userLng = parseFloat(lng) || 77.2100;
  const matches = db.matchDonorsForEmergency({
    bloodGroup,
    lat: userLat,
    lng: userLng,
    radiusKm: parseFloat(radiusKm) || 50
  });

  res.json({
    bloodGroupRequested: bloodGroup,
    compatibleBloodGroups: db.getCompatibleDonors(bloodGroup),
    totalMatchesFound: matches.length,
    matchedDonors: matches
  });
});

// ==========================================
// 6. PATIENT PORTAL & THALASSEMIA MODULE
// ==========================================

app.get('/api/patients', (req, res) => {
  res.json(db.patients);
});

app.post('/api/patients/register', (req, res) => {
  const { name, age, gender, disease, bloodGroup, hospitalName, frequencyDays, unitsRequired, currentHb } = req.body;

  const newPatient = {
    id: `pat-${Date.now().toString().slice(-5)}`,
    name,
    age: parseInt(age, 10) || 20,
    gender: gender || "Male",
    disease: disease || "Thalassemia Major",
    bloodGroup,
    hospitalId: "hosp-1",
    hospitalName: hospitalName || "AIIMS National Medical Institute",
    frequencyDays: parseInt(frequencyDays, 10) || 21,
    lastTransfusionDate: new Date().toISOString().split('T')[0],
    nextTransfusionDate: new Date(Date.now() + (parseInt(frequencyDays, 10) || 21) * 86400000).toISOString().split('T')[0],
    daysRemaining: parseInt(frequencyDays, 10) || 21,
    unitsRequired: parseInt(unitsRequired, 10) || 2,
    componentNeeded: "Leukodepleted PRBC",
    priorityLevel: disease.includes("Thalassemia") ? 2 : 3,
    status: "Auto-Scheduled by AI",
    reservedUnitIds: [],
    currentHb: parseFloat(currentHb) || 8.5,
    targetHb: 12.0,
    aadhaarVerified: true
  };

  db.patients.unshift(newPatient);
  db.logAudit(
    "PATIENT_REGISTERED_CHRONIC_PROTOCOL",
    req.body.actor || "Clinical Care Coordinator",
    "Hematology Center",
    newPatient.hospitalName,
    `Registered patient ${newPatient.name} for ${newPatient.disease} protocol (${newPatient.frequencyDays}-day cycle, Hb: ${newPatient.currentHb})`
  );

  broadcastUpdate('patient:registered', newPatient);
  res.status(201).json(newPatient);
});

app.get('/api/thalassemia/patients', (req, res) => {
  const chronicPatients = db.patients.filter(p =>
    p.disease.toLowerCase().includes("thalassemia") ||
    p.disease.toLowerCase().includes("sickle") ||
    p.disease.toLowerCase().includes("chronic")
  );
  res.json(chronicPatients);
});

// Automated Monthly Blood Booking for Thalassemia
app.post('/api/thalassemia/reserve-advance', (req, res) => {
  const { patientId } = req.body;
  const patient = db.patients.find(p => p.id === patientId);
  if (!patient) return res.status(404).json({ error: "Patient not found" });

  // Find suitable available unit
  const candidateUnit = db.inventory.find(i =>
    i.bloodGroup === patient.bloodGroup &&
    i.component.includes("PRBC") &&
    i.status === "available"
  );

  if (candidateUnit) {
    candidateUnit.status = "reserved";
    candidateUnit.reservedForPatientId = patient.id;
    patient.status = "Blood Reserved & Queued (Level 2 Priority Lock)";
    patient.reservedUnitIds.push(candidateUnit.id);
  } else {
    patient.status = "Cross-Facility Donor Sourcing Active";
  }

  db.logAudit(
    "THALASSEMIA_MONTHLY_ADVANCE_RESERVATION",
    "Autonomous Chronic Care AI",
    "Thalassemia Priority Engine",
    patient.hospitalName,
    `Successfully locked blood reservation for Thalassemia Patient #${patient.id} (${patient.name}) due on ${patient.nextTransfusionDate}`
  );

  db.dispatchNotification(
    patient.name,
    "SMS & Mobile App",
    "THALASSEMIA_RESERVATION_SECURED",
    "Monthly Transfusion Blood Reserved",
    `BloodLink AI has safely locked ${patient.unitsRequired} units of leukodepleted blood for your upcoming transfusion on ${patient.nextTransfusionDate}.`
  );

  broadcastUpdate('thalassemia:reserved', { patient, reservedUnit: candidateUnit });
  res.json({ success: true, patient, candidateUnit });
});

// ==========================================
// 7. EMERGENCY MODE & CRISIS BROADCAST
// ==========================================

app.get('/api/emergency/status', (req, res) => {
  res.json(db.emergencyMode);
});

app.post('/api/emergency/toggle', (req, res) => {
  const { active, reason, epicenterCity, actor } = req.body;
  const updatedStatus = db.toggleEmergency(active, reason, epicenterCity, actor);
  broadcastUpdate('emergency:toggled', updatedStatus);
  res.json(updatedStatus);
});

app.post('/api/emergency/broadcast', (req, res) => {
  const { bloodGroup, location, urgencyMessage } = req.body;
  
  const notif = db.dispatchNotification(
    `ALL_COMPATIBLE_DONORS_FOR_${bloodGroup || 'ALL'}`,
    "Push Notification, SMS & WhatsApp",
    "MASS_EMERGENCY_BROADCAST",
    `RED SOS: Critical Blood Shortage in ${location || 'Regional Emergency Center'}`,
    urgencyMessage || `Immediate requirement for ${bloodGroup} blood. Emergency response units on standby.`
  );

  db.logAudit(
    "MASS_EMERGENCY_BROADCAST_TRIGGERED",
    req.body.actor || "National Crisis Authority",
    "Emergency Services",
    location || "National Command Center",
    `Dispatched emergency broadcast for ${bloodGroup}. Notification ID #${notif.id}`
  );

  broadcastUpdate('notification:dispatched', notif);
  res.json({ success: true, notification: notif });
});

// ==========================================
// 8. SECURITY, COMPLIANCE & AUDIT TRAIL
// ==========================================

app.get('/api/audit-logs', (req, res) => {
  res.json(db.auditLogs);
});

app.get('/api/notifications', (req, res) => {
  res.json(db.notifications);
});

app.post('/api/verify-aadhaar', (req, res) => {
  const { aadhaarNumber, name } = req.body;
  if (!aadhaarNumber || aadhaarNumber.replace(/\s+/g, '').length < 12) {
    return res.status(400).json({ error: "Invalid 12-digit Aadhaar Number" });
  }

  const maskedAadhaar = `XXXX-XXXX-${aadhaarNumber.slice(-4)}`;
  const verifiedRecord = {
    verified: true,
    maskedAadhaar,
    verificationTimestamp: new Date().toISOString(),
    authMechanism: "UIDAI e-KYC Mock Biometric / OTP Gateway",
    complianceStandard: "ABDM & HIPAA Level 4 Security Protocol",
    message: `Identity verified for ${name || 'User'}. Verified health locker linked.`
  };

  db.logAudit(
    "AADHAAR_IDENTITY_VERIFIED",
    name || "Citizen / Doctor",
    "Security Gateway",
    "National Identity Provider",
    `Successfully verified identity for ${maskedAadhaar} via e-KYC`
  );

  res.json(verifiedRecord);
});

// Serve frontend static files
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Start Server
server.listen(PORT, () => {
  console.log(`[BloodLink AI] Server running on http://localhost:${PORT}`);
  console.log(`[BloodLink AI] National Central Database initialized with ${db.inventory.length} inventory batches, ${db.hospitals.length} hospitals, ${db.donors.length} donors.`);
});
