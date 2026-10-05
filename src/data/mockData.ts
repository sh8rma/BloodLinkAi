import { Facility, Donor, Patient, BloodRequest, BloodTransfer, ShortagePrediction, AuditLogEntry, BloodGroup } from '../types/bloodlink';

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    name: 'National Blood Transfusion Centre (Central HQ)',
    type: 'blood_bank',
    city: 'New Delhi',
    state: 'Delhi',
    lat: 28.6139,
    lng: 77.2090,
    contactPhone: '+91-11-2309-8800',
    contactEmail: 'central@nbtc.gov.in',
    inventory: {
      'A+': 320, 'A-': 45, 'B+': 410, 'B-': 38,
      'AB+': 180, 'AB-': 18, 'O+': 520, 'O-': 28
    },
    criticalThresholds: {
      'A+': 100, 'A-': 40, 'B+': 120, 'B-': 35,
      'AB+': 60, 'AB-': 25, 'O+': 150, 'O-': 50
    },
    distanceKm: 0
  },
  {
    id: 'fac-2',
    name: 'AIIMS Apex Trauma & Transfusion Institute',
    type: 'hospital',
    city: 'New Delhi',
    state: 'Delhi',
    lat: 28.5672,
    lng: 77.2100,
    contactPhone: '+91-11-2658-8500',
    contactEmail: 'trauma-blood@aiims.edu',
    inventory: {
      'A+': 140, 'A-': 12, 'B+': 180, 'B-': 15,
      'AB+': 75, 'AB-': 6, 'O+': 210, 'O-': 8
    },
    criticalThresholds: {
      'A+': 80, 'A-': 25, 'B+': 100, 'B-': 20,
      'AB+': 40, 'AB-': 15, 'O+': 120, 'O-': 30
    },
    distanceKm: 5.4
  },
  {
    id: 'fac-3',
    name: 'Tata Memorial Cancer & Hematology Center',
    type: 'hospital',
    city: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0178,
    lng: 72.8478,
    contactPhone: '+91-22-2417-7000',
    contactEmail: 'hemato@tmc.gov.in',
    inventory: {
      'A+': 110, 'A-': 8, 'B+': 145, 'B-': 11,
      'AB+': 55, 'AB-': 4, 'O+': 160, 'O-': 5
    },
    criticalThresholds: {
      'A+': 90, 'A-': 30, 'B+': 110, 'B-': 25,
      'AB+': 50, 'AB-': 20, 'O+': 140, 'O-': 35
    },
    distanceKm: 14.2
  },
  {
    id: 'fac-4',
    name: 'Red Cross State Blood Bank Western Division',
    type: 'blood_bank',
    city: 'Mumbai',
    state: 'Maharashtra',
    lat: 18.9322,
    lng: 72.8335,
    contactPhone: '+91-22-2266-1524',
    contactEmail: 'mumbai@redcross.org',
    inventory: {
      'A+': 280, 'A-': 34, 'B+': 360, 'B-': 28,
      'AB+': 130, 'AB-': 14, 'O+': 410, 'O-': 22
    },
    criticalThresholds: {
      'A+': 100, 'A-': 35, 'B+': 120, 'B-': 30,
      'AB+': 50, 'AB-': 20, 'O+': 130, 'O-': 40
    },
    distanceKm: 18.6
  },
  {
    id: 'fac-5',
    name: 'Apollo Speciality & Thalassemia Care Hospital',
    type: 'hospital',
    city: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    contactPhone: '+91-80-2630-4050',
    contactEmail: 'thalassemia@apollo.blr',
    inventory: {
      'A+': 95, 'A-': 14, 'B+': 130, 'B-': 9,
      'AB+': 42, 'AB-': 5, 'O+': 175, 'O-': 12
    },
    criticalThresholds: {
      'A+': 70, 'A-': 20, 'B+': 85, 'B-': 20,
      'AB+': 35, 'AB-': 15, 'O+': 110, 'O-': 25
    },
    distanceKm: 22.0
  },
  {
    id: 'fac-6',
    name: 'Rotary Metro Life Saver Blood Bank',
    type: 'blood_bank',
    city: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9352,
    lng: 77.6245,
    contactPhone: '+91-80-2553-6900',
    contactEmail: 'lifesaver@rotaryblr.org',
    inventory: {
      'A+': 210, 'A-': 22, 'B+': 240, 'B-': 19,
      'AB+': 90, 'AB-': 11, 'O+': 320, 'O-': 16
    },
    criticalThresholds: {
      'A+': 80, 'A-': 30, 'B+': 90, 'B-': 25,
      'AB+': 40, 'AB-': 15, 'O+': 100, 'O-': 30
    },
    distanceKm: 28.5
  },
  {
    id: 'fac-7',
    name: 'NIMS University Teaching Hospital & Trauma Block',
    type: 'hospital',
    city: 'Hyderabad',
    state: 'Telangana',
    lat: 17.4156,
    lng: 78.4750,
    contactPhone: '+91-40-2348-9000',
    contactEmail: 'bloodtrans@nims.edu.in',
    inventory: {
      'A+': 135, 'A-': 16, 'B+': 160, 'B-': 14,
      'AB+': 62, 'AB-': 7, 'O+': 195, 'O-': 11
    },
    criticalThresholds: {
      'A+': 75, 'A-': 25, 'B+': 90, 'B-': 20,
      'AB+': 40, 'AB-': 15, 'O+': 115, 'O-': 28
    },
    distanceKm: 34.0
  }
];

export const INITIAL_DONORS: Donor[] = [
  {
    id: 'don-1',
    name: 'Aarav Sharma',
    age: 29,
    gender: 'Male',
    bloodGroup: 'O-',
    city: 'New Delhi',
    state: 'Delhi',
    lat: 28.5800,
    lng: 77.2200,
    phone: '+91 98101 23456',
    email: 'aarav.sharma@example.com',
    lastDonationDate: '2026-05-15',
    isEligible: true,
    daysUntilEligible: 0,
    totalDonations: 14,
    impactLivesSaved: 42,
    rewardPoints: 1400,
    badgeLevel: 'Platinum Hero',
    medicalNotes: 'Universal O- donor, Hb 14.8 g/dL, regular whole blood donor',
    registeredOn: '2022-03-10',
    emergencyOptIn: true
  },
  {
    id: 'don-2',
    name: 'Priyanka Sen',
    age: 26,
    gender: 'Female',
    bloodGroup: 'A-',
    city: 'New Delhi',
    state: 'Delhi',
    lat: 28.6250,
    lng: 77.1950,
    phone: '+91 98711 54321',
    email: 'priyanka.sen@example.com',
    lastDonationDate: '2026-07-28',
    isEligible: true,
    daysUntilEligible: 0,
    totalDonations: 8,
    impactLivesSaved: 24,
    rewardPoints: 850,
    badgeLevel: 'Gold',
    medicalNotes: 'Hb 13.2 g/dL, Platelet apheresis eligible',
    registeredOn: '2023-01-14',
    emergencyOptIn: true
  },
  {
    id: 'don-3',
    name: 'Karthik Subramanian',
    age: 34,
    gender: 'Male',
    bloodGroup: 'B-',
    city: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9550,
    lng: 77.6100,
    phone: '+91 99000 87654',
    email: 'karthik.sub@example.com',
    lastDonationDate: '2026-09-18',
    isEligible: false,
    daysUntilEligible: 72,
    totalDonations: 19,
    impactLivesSaved: 57,
    rewardPoints: 1950,
    badgeLevel: 'Platinum Hero',
    medicalNotes: 'Donated whole blood recently, resting cooldown active',
    registeredOn: '2021-08-05',
    emergencyOptIn: true
  },
  {
    id: 'don-4',
    name: 'Dr. Meera Deshmukh',
    age: 38,
    gender: 'Female',
    bloodGroup: 'AB-',
    city: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0300,
    lng: 72.8550,
    phone: '+91 98200 11223',
    email: 'meera.desh@hospital.org',
    lastDonationDate: '2026-06-02',
    isEligible: true,
    daysUntilEligible: 0,
    totalDonations: 11,
    impactLivesSaved: 33,
    rewardPoints: 1200,
    badgeLevel: 'Platinum Hero',
    medicalNotes: 'Rare AB- donor, volunteered for Thalassemia emergency registry',
    registeredOn: '2022-11-20',
    emergencyOptIn: true
  },
  {
    id: 'don-5',
    name: 'Rohan Verma',
    age: 24,
    gender: 'Male',
    bloodGroup: 'O+',
    city: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0100,
    lng: 72.8300,
    phone: '+91 97690 33445',
    email: 'rohan.v@techstartup.in',
    lastDonationDate: '2026-04-10',
    isEligible: true,
    daysUntilEligible: 0,
    totalDonations: 5,
    impactLivesSaved: 15,
    rewardPoints: 550,
    badgeLevel: 'Silver',
    medicalNotes: 'Excellent health, active university campus donor',
    registeredOn: '2024-02-18',
    emergencyOptIn: true
  },
  {
    id: 'don-6',
    name: 'Fatima Sheikh',
    age: 31,
    gender: 'Female',
    bloodGroup: 'B+',
    city: 'Hyderabad',
    state: 'Telangana',
    lat: 17.4200,
    lng: 78.4600,
    phone: '+91 94400 55667',
    email: 'fatima.sheikh@example.org',
    lastDonationDate: '2026-05-30',
    isEligible: true,
    daysUntilEligible: 0,
    totalDonations: 9,
    impactLivesSaved: 27,
    rewardPoints: 920,
    badgeLevel: 'Gold',
    medicalNotes: 'Regular voluntary donor, Thalassemia support advocate',
    registeredOn: '2023-04-12',
    emergencyOptIn: true
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    name: 'Ananya Roy',
    age: 14,
    gender: 'Female',
    disease: 'Thalassemia Major',
    bloodGroup: 'B+',
    hospitalId: 'fac-5',
    hospitalName: 'Apollo Speciality & Thalassemia Care Hospital',
    city: 'Bengaluru',
    state: 'Karnataka',
    transfusionFrequencyDays: 21,
    lastTransfusionDate: '2026-09-22',
    nextScheduledTransfusion: '2026-10-13',
    unitsRequiredPerSession: 2,
    reservedUnits: 2,
    reservationStatus: 'Locked & Ready',
    priorityLevel: 2,
    ferritinLevelUgL: 1450
  },
  {
    id: 'pat-2',
    name: 'Devansh Kulkarni',
    age: 9,
    gender: 'Male',
    disease: 'Thalassemia Major',
    bloodGroup: 'O+',
    hospitalId: 'fac-3',
    hospitalName: 'Tata Memorial Cancer & Hematology Center',
    city: 'Mumbai',
    state: 'Maharashtra',
    transfusionFrequencyDays: 18,
    lastTransfusionDate: '2026-09-28',
    nextScheduledTransfusion: '2026-10-16',
    unitsRequiredPerSession: 2,
    reservedUnits: 2,
    reservationStatus: 'Locked & Ready',
    priorityLevel: 2,
    ferritinLevelUgL: 1680
  },
  {
    id: 'pat-3',
    name: 'Simran Gill',
    age: 22,
    gender: 'Female',
    disease: 'Sickle Cell Disease',
    bloodGroup: 'A-',
    hospitalId: 'fac-2',
    hospitalName: 'AIIMS Apex Trauma & Transfusion Institute',
    city: 'New Delhi',
    state: 'Delhi',
    transfusionFrequencyDays: 28,
    lastTransfusionDate: '2026-09-12',
    nextScheduledTransfusion: '2026-10-10',
    unitsRequiredPerSession: 3,
    reservedUnits: 1,
    reservationStatus: 'Donor Mobilization',
    priorityLevel: 2,
    ferritinLevelUgL: 1920
  },
  {
    id: 'pat-4',
    name: 'Kabir Mukherjee',
    age: 7,
    gender: 'Male',
    disease: 'Hemophilia A/B',
    bloodGroup: 'O-',
    hospitalId: 'fac-2',
    hospitalName: 'AIIMS Apex Trauma & Transfusion Institute',
    city: 'New Delhi',
    state: 'Delhi',
    transfusionFrequencyDays: 14,
    lastTransfusionDate: '2026-10-01',
    nextScheduledTransfusion: '2026-10-15',
    unitsRequiredPerSession: 2,
    reservedUnits: 2,
    reservationStatus: 'Locked & Ready',
    priorityLevel: 2,
    ferritinLevelUgL: 820
  },
  {
    id: 'pat-5',
    name: 'Lakshmi Narayanan',
    age: 46,
    gender: 'Female',
    disease: 'Chronic Renal Failure (Dialysis)',
    bloodGroup: 'AB-',
    hospitalId: 'fac-7',
    hospitalName: 'NIMS University Teaching Hospital & Trauma Block',
    city: 'Hyderabad',
    state: 'Telangana',
    transfusionFrequencyDays: 30,
    lastTransfusionDate: '2026-09-15',
    nextScheduledTransfusion: '2026-10-15',
    unitsRequiredPerSession: 1,
    reservedUnits: 0,
    reservationStatus: 'Allocating',
    priorityLevel: 2,
    ferritinLevelUgL: 1100
  }
];

export const INITIAL_REQUESTS: BloodRequest[] = [
  {
    id: 'req-101',
    hospitalId: 'fac-2',
    hospitalName: 'AIIMS Apex Trauma & Transfusion Institute',
    city: 'New Delhi',
    state: 'Delhi',
    bloodGroup: 'O-',
    component: 'PRBC (Packed Red Blood Cells)',
    unitsRequested: 4,
    unitsFulfilled: 1,
    priorityLevel: 1,
    patientCase: 'Multiple trauma post highway collision, massive hemorrhage protocol activated',
    patientAge: 32,
    status: 'Matching',
    requestedAt: '2026-10-05T08:30:00Z',
    urgencyReason: 'ICU resuscitation - Level 1 Emergency'
  },
  {
    id: 'req-102',
    hospitalId: 'fac-3',
    hospitalName: 'Tata Memorial Cancer & Hematology Center',
    city: 'Mumbai',
    state: 'Maharashtra',
    bloodGroup: 'A-',
    component: 'Platelet Concentrates (SDP/RDP)',
    unitsRequested: 6,
    unitsFulfilled: 3,
    priorityLevel: 1,
    patientCase: 'Acute Myeloid Leukemia induction chemotherapy, severe thrombocytopenia (platelets < 8,000)',
    patientAge: 27,
    status: 'In Transit',
    requestedAt: '2026-10-05T07:15:00Z',
    urgencyReason: 'Spontaneous bleeding risk'
  },
  {
    id: 'req-103',
    hospitalId: 'fac-5',
    hospitalName: 'Apollo Speciality & Thalassemia Care Hospital',
    city: 'Bengaluru',
    state: 'Karnataka',
    bloodGroup: 'B+',
    component: 'PRBC (Packed Red Blood Cells)',
    unitsRequested: 2,
    unitsFulfilled: 2,
    priorityLevel: 2,
    patientCase: 'Thalassemia Major recurring transfusion - Ananya Roy (14F)',
    patientAge: 14,
    status: 'Fulfilled',
    requestedAt: '2026-10-04T14:00:00Z',
    fulfilledAt: '2026-10-04T16:20:00Z',
    urgencyReason: 'Pre-scheduled monthly chronic transfusion lock'
  },
  {
    id: 'req-104',
    hospitalId: 'fac-7',
    hospitalName: 'NIMS University Teaching Hospital & Trauma Block',
    city: 'Hyderabad',
    state: 'Telangana',
    bloodGroup: 'AB-',
    component: 'FFP (Fresh Frozen Plasma)',
    unitsRequested: 3,
    unitsFulfilled: 0,
    priorityLevel: 3,
    patientCase: 'Urgent Coronary Artery Bypass Graft (CABG) planned for tomorrow morning',
    patientAge: 61,
    status: 'Pending',
    requestedAt: '2026-10-05T09:45:00Z',
    urgencyReason: 'Cardiovascular surgery coagulopathy management'
  }
];

export const INITIAL_TRANSFERS: BloodTransfer[] = [
  {
    id: 'trn-501',
    fromFacilityId: 'fac-1',
    fromFacilityName: 'National Blood Transfusion Centre (Central HQ)',
    toFacilityId: 'fac-2',
    toFacilityName: 'AIIMS Apex Trauma & Transfusion Institute',
    bloodGroup: 'O-',
    component: 'PRBC (Packed Red Blood Cells)',
    units: 3,
    status: 'Courier Dispatched',
    requestedAt: '2026-10-05T09:10:00Z',
    estimatedArrivalMinutes: 18,
    currentTempCelsius: 3.6,
    vehiclePlate: 'DL-01-MED-4491',
    driverPhone: '+91-98112-99001',
    distanceKm: 5.4
  },
  {
    id: 'trn-502',
    fromFacilityId: 'fac-4',
    fromFacilityName: 'Red Cross State Blood Bank Western Division',
    toFacilityId: 'fac-3',
    toFacilityName: 'Tata Memorial Cancer & Hematology Center',
    bloodGroup: 'A-',
    component: 'Platelet Concentrates (SDP/RDP)',
    units: 3,
    status: 'Courier Dispatched',
    requestedAt: '2026-10-05T08:20:00Z',
    estimatedArrivalMinutes: 12,
    currentTempCelsius: 22.4,
    vehiclePlate: 'MH-02-EMS-7732',
    driverPhone: '+91-98201-44332',
    distanceKm: 4.8
  }
];

export const INITIAL_PREDICTIONS: ShortagePrediction[] = [
  {
    bloodGroup: 'O-',
    region: 'North Zone (Delhi NCR, Haryana, Punjab)',
    riskLevel: 'red',
    currentStock: 48,
    forecastedDemand7Days: 95,
    forecastedDemand15Days: 210,
    forecastedDemand30Days: 440,
    forecastedDemand90Days: 1350,
    predictedDeficit30Days: -185,
    primaryDrivers: [
      'Universal donor depletion from 3 multi-vehicle highway pileups',
      'Festival holiday travel surge upcoming in 10 days',
      'Low universal donor walk-in donation rate (-22% MoM)'
    ],
    recommendedAction: 'Trigger Automated Emergency SOS to all registered O- donors within 25km radius; initiate inter-zone transfer from Central Military Reserve.'
  },
  {
    bloodGroup: 'A-',
    region: 'West Zone (Mumbai, Pune, Gujarat)',
    riskLevel: 'orange',
    currentStock: 54,
    forecastedDemand7Days: 82,
    forecastedDemand15Days: 175,
    forecastedDemand30Days: 360,
    forecastedDemand90Days: 1100,
    predictedDeficit30Days: -110,
    primaryDrivers: [
      'Heavy seasonal dengue outbreak increasing apheresis platelet demand',
      'Rare antigen matching requirements for hematology patients',
      'Collection lag due to extended monsoon rainfall'
    ],
    recommendedAction: 'Organize targeted corporate donation drives in commercial hubs; prioritize Platelet SDP collection.'
  },
  {
    bloodGroup: 'B-',
    region: 'South Zone (Bengaluru, Hyderabad, Chennai)',
    riskLevel: 'yellow',
    currentStock: 76,
    forecastedDemand7Days: 80,
    forecastedDemand15Days: 165,
    forecastedDemand30Days: 330,
    forecastedDemand90Days: 980,
    predictedDeficit30Days: -35,
    primaryDrivers: [
      'High concentration of pediatric Thalassemia monthly transfusions (142 enrolled patients)',
      'Scheduled elective cardiac surgeries resume post-festivals'
    ],
    recommendedAction: 'Notify registered B- donors approaching eligibility restoration; lock Thalassemia 30-day pre-reservations.'
  },
  {
    bloodGroup: 'AB-',
    region: 'East Zone (Kolkata, Bhubaneswar, Guwahati)',
    riskLevel: 'orange',
    currentStock: 25,
    forecastedDemand7Days: 38,
    forecastedDemand15Days: 85,
    forecastedDemand30Days: 170,
    forecastedDemand90Days: 520,
    predictedDeficit30Days: -65,
    primaryDrivers: [
      'Extremely low population phenotype frequency (<0.5%)',
      'Flood alert in lower delta causing transport bottlenecks'
    ],
    recommendedAction: 'Activate specialized rare-donor telephone outreach; prepare cold-chain drone delivery corridor.'
  },
  {
    bloodGroup: 'O+',
    region: 'Nationwide Aggregation',
    riskLevel: 'green',
    currentStock: 1810,
    forecastedDemand7Days: 1200,
    forecastedDemand15Days: 2450,
    forecastedDemand30Days: 4900,
    forecastedDemand90Days: 14800,
    predictedDeficit30Days: 0,
    primaryDrivers: [
      'Steady voluntary donation stream at university and civic camps',
      'Healthy 14-day buffer maintained across Tier-1 blood banks'
    ],
    recommendedAction: 'Maintain routine inventory rotation to prevent units reaching >30 days shelf life.'
  },
  {
    bloodGroup: 'B+',
    region: 'Nationwide Aggregation',
    riskLevel: 'green',
    currentStock: 1480,
    forecastedDemand7Days: 980,
    forecastedDemand15Days: 2050,
    forecastedDemand30Days: 4100,
    forecastedDemand90Days: 12400,
    predictedDeficit30Days: 0,
    primaryDrivers: [
      'High natural prevalence in domestic population',
      'Active Thalassemia donor matching circles functioning effectively'
    ],
    recommendedAction: 'Continue weekly automated Thalassemia allocation cycle.'
  },
  {
    bloodGroup: 'A+',
    region: 'Nationwide Aggregation',
    riskLevel: 'yellow',
    currentStock: 1160,
    forecastedDemand7Days: 920,
    forecastedDemand15Days: 1900,
    forecastedDemand30Days: 3850,
    forecastedDemand90Days: 11600,
    predictedDeficit30Days: -120,
    primaryDrivers: [
      'Seasonal surgical backlog catch-up',
      'Post-monsoon vector-borne infection admissions'
    ],
    recommendedAction: 'Issue advisory to affiliated college campus blood drive coordinators.'
  },
  {
    bloodGroup: 'AB+',
    region: 'Nationwide Aggregation',
    riskLevel: 'green',
    currentStock: 632,
    forecastedDemand7Days: 320,
    forecastedDemand15Days: 680,
    forecastedDemand30Days: 1390,
    forecastedDemand90Days: 4200,
    predictedDeficit30Days: 0,
    primaryDrivers: [
      'Universal plasma donor status well-balanced with patient consumption'
    ],
    recommendedAction: 'Route excess plasma for fractionation and cryoprecipitate production.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-901',
    timestamp: '2026-10-05T09:48:12Z',
    actor: 'Dr. Vikram Sethi',
    role: 'Chief Transfusion Officer',
    action: 'BLOOD_REQUEST_SUBMITTED',
    category: 'ALLOCATION',
    details: 'Submitted Level 1 Emergency Request for 4 units PRBC O- (AIIMS Trauma ICU)',
    facility: 'AIIMS Apex Trauma & Transfusion Institute',
    hash: '0x8f2b7a4c9e10283d'
  },
  {
    id: 'aud-902',
    timestamp: '2026-10-05T09:12:05Z',
    actor: 'System Autonomous Dispatch',
    role: 'AI Engine',
    action: 'TRANSFER_DISPATCHED',
    category: 'TRANSFER',
    details: 'Dispatched Cold-Chain Ambulance DL-01-MED-4491 carrying 3 units O- PRBC at 3.6°C',
    facility: 'National Blood Transfusion Centre (Central HQ)',
    hash: '0x3c81e9d40a5b2811'
  },
  {
    id: 'aud-903',
    timestamp: '2026-10-05T08:00:00Z',
    actor: 'Thalassemia Automated Engine',
    role: 'Priority Scheduler',
    action: 'RESERVATION_LOCKED',
    category: 'PRIORITY_QUEUE',
    details: 'Locked 2 units B+ PRBC (Batch #B26-0988) for patient Ananya Roy (Thalassemia Major)',
    facility: 'Apollo Speciality & Thalassemia Care Hospital',
    hash: '0x9924baec671d054f'
  },
  {
    id: 'aud-904',
    timestamp: '2026-10-05T07:22:45Z',
    actor: 'Quality Guard Daemon',
    role: 'Cold-Chain Auditor',
    action: 'EXPIRY_ALERT_TRIGGERED',
    category: 'EXPIRY_GUARD',
    details: 'Flagged 4 units Platelets expiring in 28 hours at Rotary Metro; recommended transfer to trauma ward',
    facility: 'Rotary Metro Life Saver Blood Bank',
    hash: '0x77ab4312cd091ea2'
  }
];
