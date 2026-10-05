import crypto from 'crypto';
import {
  initialHospitals,
  initialBloodBanks,
  initialInventory,
  initialDonors,
  initialPatients,
  initialBloodRequests,
  initialTransfers,
  initialAuditLogs,
  initialNotifications
} from './seeds.js';

class CentralBloodDatabase {
  constructor() {
    this.hospitals = [...initialHospitals];
    this.bloodBanks = [...initialBloodBanks];
    this.inventory = [...initialInventory];
    this.donors = [...initialDonors];
    this.patients = [...initialPatients];
    this.requests = [...initialBloodRequests];
    this.transfers = [...initialTransfers];
    this.auditLogs = [...initialAuditLogs];
    this.notifications = [...initialNotifications];

    // Global Emergency Crisis State
    this.emergencyMode = {
      active: false,
      reason: "Normal National Inventory Operations",
      epicenterCity: "National",
      activatedAt: null,
      activatedBy: null,
      massAlertSentCount: 0
    };
  }

  // Calculate distance between two coordinate pairs using Haversine formula (km)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }

  // Immutable audit log creator with cryptographic hash
  logAudit(action, actor, role, facility, details) {
    const timestamp = new Date().toISOString();
    const payload = `${timestamp}|${action}|${actor}|${facility}|${details}`;
    const hash = crypto.createHash('sha256').update(payload).digest('hex');

    const entry = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp,
      action,
      actor,
      role,
      facility,
      details,
      hash
    };
    this.auditLogs.unshift(entry);
    return entry;
  }

  // Simulated Multi-Channel Notification Dispatcher
  dispatchNotification(recipient, channel, type, title, message) {
    const notif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      recipient,
      channel,
      type,
      title,
      message,
      status: "Delivered"
    };
    this.notifications.unshift(notif);
    return notif;
  }

  getNationalOverview() {
    const totalUnits = this.inventory.reduce((sum, item) => sum + item.units, 0);

    // Group-wise inventory
    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const groupInventory = {};
    bloodGroups.forEach(bg => { groupInventory[bg] = 0; });
    this.inventory.forEach(item => {
      if (groupInventory[item.bloodGroup] !== undefined) {
        groupInventory[item.bloodGroup] += item.units;
      }
    });

    // Component-wise breakdown
    const componentBreakdown = {
      PRBC: 0,
      Platelets: 0,
      FFP: 0,
      Cryoprecipitate: 0,
      WholeBlood: 0
    };
    this.inventory.forEach(item => {
      if (componentBreakdown[item.component] !== undefined) {
        componentBreakdown[item.component] += item.units;
      }
    });

    // State-wise breakdown
    const stateInventory = {};
    const cityInventory = {};

    [...this.bloodBanks, ...this.hospitals].forEach(facility => {
      const facilityStock = this.inventory
        .filter(inv => inv.facilityId === facility.id)
        .reduce((sum, i) => sum + i.units, 0);

      stateInventory[facility.state] = (stateInventory[facility.state] || 0) + facilityStock;
      cityInventory[facility.city] = (cityInventory[facility.city] || 0) + facilityStock;
    });

    // Shortages
    const criticalShortages = Object.entries(groupInventory)
      .filter(([bg, count]) => count < 100)
      .map(([bg, count]) => ({ bloodGroup: bg, availableUnits: count, status: "Critical" }));

    const watchlistGroups = Object.entries(groupInventory)
      .filter(([bg, count]) => count >= 100 && count < 250)
      .map(([bg, count]) => ({ bloodGroup: bg, availableUnits: count, status: "Watchlist" }));

    const expiringSoonUnits = this.inventory
      .filter(item => item.status === "expiring-soon")
      .reduce((sum, i) => sum + i.units, 0);

    const activeTransfersCount = this.transfers.filter(t => t.status === "In-Transit").length;
    const pendingRequestsCount = this.requests.filter(r => r.status.includes("Pending") || r.status.includes("Progress")).length;
    const eligibleDonorsCount = this.donors.filter(d => d.eligibilityStatus === "Eligible Now").length;
    const thalassemiaPatientsCount = this.patients.filter(p => p.disease.includes("Thalassemia")).length;

    return {
      totalBloodUnits: totalUnits,
      groupInventory,
      componentBreakdown,
      stateInventory,
      cityInventory,
      criticalShortages,
      watchlistGroups,
      expiringSoonUnits,
      activeTransfersCount,
      pendingRequestsCount,
      eligibleDonorsCount,
      thalassemiaPatientsCount,
      totalDonors: this.donors.length,
      totalHospitals: this.hospitals.length,
      totalBloodBanks: this.bloodBanks.length,
      emergencyMode: this.emergencyMode,
      lastUpdated: new Date().toISOString()
    };
  }

  // Donor compatibility chart for red blood cells
  getCompatibleDonors(patientBloodGroup) {
    const compatibilityMap = {
      "O-": ["O-"],
      "O+": ["O-", "O+"],
      "A-": ["O-", "A-"],
      "A+": ["O-", "O+", "A-", "A+"],
      "B-": ["O-", "B-"],
      "B+": ["O-", "O+", "B-", "B+"],
      "AB-": ["O-", "A-", "B-", "AB-"],
      "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]
    };
    return compatibilityMap[patientBloodGroup] || [patientBloodGroup];
  }

  // AI Donor Matching
  matchDonorsForEmergency({ bloodGroup, lat, lng, radiusKm = 50 }) {
    const compatibleGroups = this.getCompatibleDonors(bloodGroup);

    return this.donors
      .filter(donor => {
        const matchesGroup = compatibleGroups.includes(donor.bloodGroup);
        const isEligible = donor.eligibilityStatus === "Eligible Now";
        return matchesGroup && isEligible;
      })
      .map(donor => {
        const distance = this.calculateDistance(lat, lng, donor.lat, donor.lng);
        // AI match score algorithm: 0 - 100 based on distance, group match precision, impact score
        let matchScore = 95 - Math.min(distance * 1.5, 40);
        if (donor.bloodGroup === bloodGroup) matchScore += 5; // exact match bonus
        if (donor.readyForEmergencyCall) matchScore += 5;
        matchScore = Math.min(Math.round(matchScore), 99);

        return {
          ...donor,
          distanceKm: distance,
          aiMatchScore: matchScore,
          estimatedResponseTimeMin: Math.round(distance * 3 + 15)
        };
      })
      .sort((a, b) => b.aiMatchScore - a.aiMatchScore);
  }

  // Trigger Network-wide Emergency Mode
  toggleEmergency(active, reason, epicenterCity, actor = "National Health Command Authority") {
    this.emergencyMode = {
      active,
      reason: reason || (active ? "Mass Trauma Deficit Alert" : "Normal Operational State Restored"),
      epicenterCity: epicenterCity || "National",
      activatedAt: active ? new Date().toISOString() : null,
      activatedBy: actor,
      massAlertSentCount: active ? this.donors.filter(d => d.readyForEmergencyCall).length : 0
    };

    if (active) {
      // Disseminate simulated broadcast alerts
      this.dispatchNotification(
        "ALL_REGISTERED_EMERGENCY_DONORS (SMS Gateway)",
        "SMS & WhatsApp Priority Channel",
        "NATIONAL_CRISIS_ACTIVATION",
        "RED ALERT: National Emergency Blood Call",
        `Emergency protocol activated for ${epicenterCity}. Urgent requirement for universal O- and rare blood groups. Please visit your nearest blood bank immediately.`
      );

      this.logAudit(
        "EMERGENCY_MODE_ACTIVATED",
        actor,
        "National Crisis Authority",
        epicenterCity,
        `Emergency mode activated: "${this.emergencyMode.reason}". ${this.emergencyMode.massAlertSentCount} emergency donors notified.`
      );
    } else {
      this.logAudit(
        "EMERGENCY_MODE_DEACTIVATED",
        actor,
        "National Crisis Authority",
        "National Command Center",
        "Emergency mode deactivated. Restored standard inventory distribution."
      );
    }

    return this.emergencyMode;
  }
}

export const db = new CentralBloodDatabase();
