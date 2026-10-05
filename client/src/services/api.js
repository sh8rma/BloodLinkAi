// BloodLink AI - REST API Client Service

const BASE_URL = '/api';

export const api = {
  // National Command Center
  async getOverview() {
    const res = await fetch(`${BASE_URL}/national/overview`);
    return res.json();
  },

  async getHospitals() {
    const res = await fetch(`${BASE_URL}/hospitals`);
    return res.json();
  },

  async getBloodBanks() {
    const res = await fetch(`${BASE_URL}/blood-banks`);
    return res.json();
  },

  // Inventory
  async getInventory(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${BASE_URL}/inventory?${query}`);
    return res.json();
  },

  async addInventory(item) {
    const res = await fetch(`${BASE_URL}/inventory/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return res.json();
  },

  async updateInventory(id, updates) {
    const res = await fetch(`${BASE_URL}/inventory/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates })
    });
    return res.json();
  },

  // AI Prediction & What-If Simulator
  async getPredictions(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/predictions?${query}`);
    return res.json();
  },

  async simulateScenario(scenario) {
    const res = await fetch(`${BASE_URL}/predictions/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scenario)
    });
    return res.json();
  },

  async getTransferRecommendations() {
    const res = await fetch(`${BASE_URL}/transfers/recommendations`);
    return res.json();
  },

  // Transfers & Logistics
  async getTransfers() {
    const res = await fetch(`${BASE_URL}/transfers`);
    return res.json();
  },

  async createTransfer(transferData) {
    const res = await fetch(`${BASE_URL}/transfers/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transferData)
    });
    return res.json();
  },

  // Blood Requests
  async getRequests() {
    const res = await fetch(`${BASE_URL}/requests`);
    return res.json();
  },

  async createRequest(requestData) {
    const res = await fetch(`${BASE_URL}/requests/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });
    return res.json();
  },

  async dispatchRequest(id) {
    const res = await fetch(`${BASE_URL}/requests/${id}/dispatch`, {
      method: 'POST'
    });
    return res.json();
  },

  // Donors
  async getDonors() {
    const res = await fetch(`${BASE_URL}/donors`);
    return res.json();
  },

  async registerDonor(donorData) {
    const res = await fetch(`${BASE_URL}/donors/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donorData)
    });
    return res.json();
  },

  async matchDonors(criteria) {
    const res = await fetch(`${BASE_URL}/donors/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(criteria)
    });
    return res.json();
  },

  // Patients & Thalassemia
  async getPatients() {
    const res = await fetch(`${BASE_URL}/patients`);
    return res.json();
  },

  async registerPatient(patientData) {
    const res = await fetch(`${BASE_URL}/patients/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    });
    return res.json();
  },

  async getThalassemiaPatients() {
    const res = await fetch(`${BASE_URL}/thalassemia/patients`);
    return res.json();
  },

  async reserveThalassemiaAdvance(patientId) {
    const res = await fetch(`${BASE_URL}/thalassemia/reserve-advance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId })
    });
    return res.json();
  },

  // Emergency Mode & Broadcast
  async getEmergencyStatus() {
    const res = await fetch(`${BASE_URL}/emergency/status`);
    return res.json();
  },

  async toggleEmergency(data) {
    const res = await fetch(`${BASE_URL}/emergency/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async broadcastEmergency(broadcastData) {
    const res = await fetch(`${BASE_URL}/emergency/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(broadcastData)
    });
    return res.json();
  },

  // Compliance, Security & Audit
  async getAuditLogs() {
    const res = await fetch(`${BASE_URL}/audit-logs`);
    return res.json();
  },

  async getNotifications() {
    const res = await fetch(`${BASE_URL}/notifications`);
    return res.json();
  },

  async verifyAadhaar(data) {
    const res = await fetch(`${BASE_URL}/verify-aadhaar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
