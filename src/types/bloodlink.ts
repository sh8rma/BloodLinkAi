export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type RareBloodGroup = BloodGroup | 'Bombay (hh)' | 'Rh-null';

export type BloodComponent = 
  | 'Whole Blood' 
  | 'PRBC (Packed Red Blood Cells)' 
  | 'Platelet Concentrates (SDP/RDP)' 
  | 'FFP (Fresh Frozen Plasma)' 
  | 'Cryoprecipitate';

export type PriorityLevel = 1 | 2 | 3 | 4;

export type RiskLevel = 'green' | 'yellow' | 'orange' | 'red';

export type UserRole = 'national_admin' | 'hospital' | 'blood_bank' | 'donor' | 'patient';

export interface BloodUnitBatch {
  id: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  units: number;
  collectionDate: string;
  expiryDate: string;
  storageCondition: string; // e.g., 'Cold Room 2-6°C', 'Deep Freezer -80°C', 'Platelet Agitator 22°C'
  facilityId: string;
  facilityName: string;
  facilityType: 'hospital' | 'blood_bank';
  city: string;
  state: string;
  isReservedForThalassemia?: boolean;
  reservedPatientId?: string;
}

export interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'blood_bank';
  city: string;
  state: string;
  lat: number;
  lng: number;
  contactPhone: string;
  contactEmail: string;
  inventory: Record<BloodGroup, number>;
  criticalThresholds: Record<BloodGroup, number>;
  distanceKm?: number;
}

export interface Donor {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: BloodGroup;
  city: string;
  state: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  lastDonationDate: string;
  isEligible: boolean;
  daysUntilEligible: number;
  totalDonations: number;
  impactLivesSaved: number;
  rewardPoints: number;
  badgeLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum Hero';
  medicalNotes: string;
  registeredOn: string;
  emergencyOptIn: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  disease: 'Thalassemia Major' | 'Sickle Cell Disease' | 'Hemophilia A/B' | 'Severe Aplastic Anemia' | 'Chronic Renal Failure (Dialysis)';
  bloodGroup: BloodGroup;
  hospitalId: string;
  hospitalName: string;
  city: string;
  state: string;
  transfusionFrequencyDays: number;
  lastTransfusionDate: string;
  nextScheduledTransfusion: string;
  unitsRequiredPerSession: number;
  reservedUnits: number;
  reservationStatus: 'Locked & Ready' | 'Allocating' | 'Donor Mobilization' | 'Completed';
  priorityLevel: PriorityLevel;
  ferritinLevelUgL: number;
}

export interface BloodRequest {
  id: string;
  hospitalId: string;
  hospitalName: string;
  city: string;
  state: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  unitsRequested: number;
  unitsFulfilled: number;
  priorityLevel: PriorityLevel; // 1: Life-threatening, 2: Thalassemia, 3: Surgeries, 4: Elective
  patientCase: string;
  patientAge?: number;
  status: 'Pending' | 'Matching' | 'In Transit' | 'Fulfilled' | 'Cancelled';
  requestedAt: string;
  fulfilledAt?: string;
  urgencyReason: string;
}

export interface BloodTransfer {
  id: string;
  fromFacilityId: string;
  fromFacilityName: string;
  toFacilityId: string;
  toFacilityName: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  units: number;
  status: 'Requested' | 'Approved' | 'Courier Dispatched' | 'Delivered';
  requestedAt: string;
  estimatedArrivalMinutes: number;
  currentTempCelsius: number;
  vehiclePlate: string;
  driverPhone: string;
  distanceKm: number;
}

export interface ShortagePrediction {
  bloodGroup: BloodGroup;
  region: string;
  riskLevel: RiskLevel; // green, yellow, orange, red
  currentStock: number;
  forecastedDemand7Days: number;
  forecastedDemand15Days: number;
  forecastedDemand30Days: number;
  forecastedDemand90Days: number;
  predictedDeficit30Days: number;
  primaryDrivers: string[];
  recommendedAction: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  category: 'ALLOCATION' | 'DONATION' | 'TRANSFER' | 'EMERGENCY_SOS' | 'PRIORITY_QUEUE' | 'EXPIRY_GUARD';
  details: string;
  facility: string;
  hash: string;
}
