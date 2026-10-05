# 📖 BloodLink AI – Comprehensive User Manual & Panel-Wise Feature Guide

Welcome to **BloodLink AI (Predictive Blood Shortage Network)**. This enterprise-grade national healthcare platform unifies hospitals, blood banks, registered voluntary donors, chronic patients, and emergency services under a centralized parent command database.

---

## 🌐 1. Platform Access & URLs

| Interface | URL | Purpose |
| :--- | :--- | :--- |
| **Production Web Platform** | [http://localhost:5000](http://localhost:5000) | Single-page application served directly with backend API |
| **Vite Hot-Reload Dev Server** | [http://localhost:5173](http://localhost:5173) | Frontend development server with live reload |
| **National Overview API** | [http://localhost:5000/api/national/overview](http://localhost:5000/api/national/overview) | Parent Database real-time JSON metrics endpoint |
| **Standalone Python AI Core** | `python ai_engine/shortage_predictor.py` | Offline synthetic ML forecasting script |

---

## 🎛️ 2. Top Header & Universal Controls

The top header stays visible across all panels and gives instant access to critical global controls:

### A. Live Grid Status Indicator
- Shows green pulsing dot: `Live National Grid` when the WebSocket connection is active.
- Emits real-time sound/toast alerts whenever blood is requested, transferred, or reserved.

### B. Emergency Mode (Red Siren Button)
- **Normal State**: Displays `Emergency Mode` in soft red.
- **Crisis State**: Flashes in bright red with pulsing radar rings: `EMERGENCY ACTIVE`.
- **How to Use**:
  1. Click the button to open the **Emergency Crisis Override Modal**.
  2. Select the **Regional Epicenter City** (e.g., Ahmedabad, New Delhi, Mumbai, or National).
  3. Specify the crisis reason (e.g., *Multi-Vehicle Highway Collision* or *Dengue Epidemic*).
  4. Click **Activate Code Red Emergency**.
  5. The platform immediately updates all dashboards, activates a sticky crisis banner, and simulates mass SMS/WhatsApp alerts to all compatible emergency donors within 50km.
  6. To stand down, click **Stand Down / Restore Normal Ops**.

### C. Aadhaar e-KYC Verification (`Aadhaar e-KYC` Button)
- Demonstrates zero-trust national identity authentication complying with ABDM & HIPAA standards.
- **How to Use**: Click the button, enter a 12-digit mock Aadhaar number (prefilled or custom), and click **Authenticate Identity** to see verified masked ID `XXXX-XXXX-8831` and linked health locker clearance.

### D. Cryptographic Audit Ledger (`Audit Ledger` Button)
- Displays an immutable log of every action taken in the ecosystem (unit added, transfer dispatched, priority request raised, etc.).
- Each entry includes a timestamp, actor, facility, and a **SHA-256 cryptographic hash** with a 1-click copy button.

### E. Multi-Channel Notification Drawer (`Bell` Icon)
- Displays live dispatch logs across **SMS, WhatsApp, Push Notification, and Email**.
- Filter by channel tabs (`ALL`, `SMS`, `WHATSAPP`, `PUSH`, `EMAIL`) to verify outbound alerts.

### F. Dark Mode Toggle (`Sun / Moon` Icon)
- Instantly toggles between healthcare clinical light theme and dark command center theme.

---

## 🏛️ 3. Panel 1: National Command Center (Parent Central Database)

### 🎯 Purpose
The national bird's-eye view representing the Ministry of Health National Blood Grid. Aggregates data from 50+ blood banks, 40+ hospitals, and thousands of donors nationwide.

### 📌 Features & Visual Elements
1. **Executive KPI Ribbon**:
   - **Total Blood Units**: Real-time aggregate count across all facilities.
   - **Critical Deficits**: Count and tags of blood groups below safety margins (e.g., `O-`, `A-`, `B-`, `AB-`).
   - **Expiring < 5 Days**: Units reaching shelf-life expiration requiring immediate reallocation.
   - **Active Transfers**: Fleet of drones and smart emergency courier vehicles currently in motion.
   - **Active Donors**: Registered voluntary donors and count ready for donation today.
   - **Grid Facilities**: Combined count of networked hospitals and licensed blood banks.

2. **National Blood Group Stock Heatmap & Depletion Radar**:
   - 8 interactive cards for `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`.
   - Each card displays current units, days of supply remaining, and color-coded risk badge:
     - 🟢 **Safe Buffer** (> 14 days supply)
     - 🟡 **Watchlist** (8–14 days supply)
     - 🟠 **Shortage Risk** (3–7 days supply)
     - 🔴 **Critical Emergency** (< 3 days supply)
   - Background vertical gauge fills dynamically based on percentage of national buffer capacity.
   - **How to Use**: Click on any card (e.g., `O-`) to inspect or filter allocations.

3. **Component Inventory & Shelf-Life Telemetry**:
   - Tracks **PRBC (Packed Red Cells)**: 35–42 days shelf life at 2°C–6°C.
   - Tracks **Platelet Concentrates**: High-decay 5-day shelf life at 22°C with agitators.
   - Tracks **Fresh Frozen Plasma (FFP)**: 1-year shelf life at -25°C.
   - Live chiller status indicator confirms all regulatory standards are compliant.

4. **Regional Inventory Distribution Table**:
   - Visual progress bars for Delhi, Maharashtra, Tamil Nadu, Karnataka, Telangana, Gujarat, West Bengal, etc.
   - Click `GIS Map →` to jump directly into the interactive geospatial map.

5. **Disease Demand & Priority Queue Overview**:
   - Summarizes active Level 1 trauma cases, Level 2 Thalassemia monthly recurring patients, and Level 3 scheduled surgeries.

---

## 🏥 4. Panel 2: Hospital Transfusion & Emergency Hub

### 🎯 Purpose
Interface used by Hospital Blood Bank Officers, Chief Medical Officers, and ICU Trauma Directors to manage on-site stock, request units, and execute cross-facility transfers.

### 📌 Features & How to Use
1. **Hospital Switcher (Top Dropdown)**:
   - Select between facilities: *AIIMS New Delhi*, *Civil Hospital Ahmedabad*, *Tata Memorial Mumbai*, *Apollo Chennai*, *Manipal Bengaluru*, *KIMS Hyderabad*, etc.
   - Metrics dynamically update: Bed capacity, ICU beds, current on-site reserve, daily usage burn rate, and shortage risk status.

2. **Raise Prioritized Blood Request Form (Left Column)**:
   - **Medical Priority Level Dropdown**:
     - `Level 1`: Life-Threatening Emergency (Immediate zero-delay priority override)
     - `Level 2`: Thalassemia Monthly Transfusion (Locks units from chronic buffer)
     - `Level 3`: Scheduled Surgeries & Electives (Requires 48h buffer clearance)
     - `Level 4`: Regular Inpatient Requests
   - **Blood Group & Component**: Select ABO/Rh type and component (PRBC, Platelets, FFP, Cryoprecipitate).
   - **Units, Patient Name & Clinical Condition**: e.g., *Gurpreet Singh (ICU Bed 12) - Polytrauma Ruptured Spleen*.
   - Click **Submit Priority Request**:
     - Request is created immediately.
     - WebSocket broadcasts alert across the network.
     - If Level 1, triggers urgent donor notification and queues transfer.

3. **AI Cross-Facility Transfer Recommendations (Right Column)**:
   - Evaluates nearby blood banks holding surplus stock within cold-chain transit radius.
   - Suggests vehicle type:
     - **Autonomous Medical Drone (Aero-Med)**: For lightweight urgent packets (< 6 units, < 25km, ETA 7–12 min).
     - **Express Cold-Chain Medical Van**: For bulk units with siren priority.
   - Displays ETA, distance, and AI clinical rationale.
   - **Action**: Click **Accept & Dispatch** to generate transfer with a tracking ID (`BL-XFER-XXXX`).

4. **Active Hospital Requests Table (Bottom)**:
   - Live list of pending, reserved, and dispatched requests.
   - Click **Mark Dispatched** to simulate unit transit completion.

---

## 🩸 5. Panel 3: Blood Bank Facility & Cold-Chain Management

### 🎯 Purpose
Used by Regional Blood Transfusion Centers (e.g., Red Cross, Rotary, Lions, Prathama) to manage physical inventory batches, monitor refrigeration telemetry, and prevent expired blood wastage.

### 📌 Features & How to Use
1. **Facility Selector**:
   - Choose between *National Red Cross Hub (Delhi)*, *Rotary Metro Central (Mumbai)*, *Prathama Apex (Ahmedabad)*, etc.
   - Displays license number, capacity, and active courier fleet.

2. **Cold-Chain Telemetry Gauges**:
   - **PRBC Chiller**: Real-time reading (e.g., `3.2°C` compliant within 2°C–6°C).
   - **Platelet Agitator**: Real-time reading (`22.1°C` with continuous mechanical agitation verified).
   - **Deep Freeze FFP**: Real-time reading (`-25.4°C` compliant with FDA/WHO standards).

3. **Smart Expiry Prevention Radar (Signature Feature)**:
   - Highlighted amber banner appears when units (especially Platelets) are within 48–72 hours of expiration.
   - Displays 1-click action: **Reallocate Batch #inv-102 (A+)** to high-turnover trauma centers (like AIIMS Trauma ICU) before expiration occurs, preventing wastage.

4. **Register Collected Blood Batch (`+ Add Batch` Button)**:
   - Opens modal to register voluntary donation collection:
     - Select Blood Group, Component, Units Count, Storage Chamber Temp, and Expiry Date.
     - Click **Confirm & Store Batch** to add to vault inventory with a unique batch barcode.

5. **Vault Storage Inventory Table**:
   - Full batch list detailing Batch ID, Blood Group, Component, Units, Collection Date, Expiry Date, Temperature, and Health Status (`available`, `expiring-soon`, `low`, `critical`).

---

## ❤️ 6. Panel 4: Donor Engagement & AI Matching Network

### 🎯 Purpose
Citizen donor dashboard and recruitment center designed to maximize repeat voluntary blood donations.

### 📌 Features & How to Use
1. **Donor Profile Selector**:
   - Switch between donors (e.g., *Dr. Vikramaditya Sen (O-)*, *Ananya Sharma (A+)*, *Rajesh Nair (B+)*, etc.).
2. **Profile Metrics**:
   - **Eligibility Status**: Shows `Eligible Now` or countdown days remaining based on 90-day recovery cycle and hemoglobin check ($> 12.5\text{ g/dL}$).
   - **Impact Score**: Lives Saved counter calculated at $3 \times \text{donations}$.
   - **Reward Tier**: Gamified badges (*Welcome Lifesaver*, *Silver Guardian*, *Gold Donor*, *Platinum Hero*, *Diamond Lifesaver*).
3. **Digital Certificate of Life-Saving Appreciation (`View Lifesaver Certificate`)**:
   - Click to open the official Government of India honors certificate modal.
   - Triggers celebratory confetti animation!
   - Includes unique certificate serial ID, verified UIDAI badge, lives saved count, and **Download & Print Certificate** button.
4. **AI Proximity Donor Matching Engine (Left Column)**:
   - Test the neural matchmaking tool:
     1. Select **Target Blood Group Needed** (e.g., `O-`).
     2. Set **Geofence Radius** (e.g., `50 km`).
     3. Click **Find Nearest Compatible Donors**.
     4. Algorithm checks red-cell compatibility, Haversine distance, and past reliability.
     5. Displays ranked donors with Match Score (up to 99%), Distance (km), and Estimated Response Time (min).
     6. Click **Alert Donor** to dispatch simulated SMS/WhatsApp dispatch.
5. **Urgent Blood Shortages in Your Region (Right Column)**:
   - Displays real-time critical hospital shortages matching the donor's blood type.
   - Click **Pledge Donation** or **Schedule Slot** to confirm donation appointment.
6. **Register as a Donor (`Register as Donor` Button)**:
   - Form capturing Name, Age, Gender, Blood Group, City, Mobile, Hemoglobin (g/dL), and Weight (kg).
   - Instant validation and confetti welcome upon submission.

---

## 🧑‍⚕️ 7. Panel 5: Patient Transfusion & Reservation Portal

### 🎯 Purpose
Patient-facing portal for individuals requiring frequent or acute blood transfusions.

### 📌 Features & How to Use
1. **Patient Profile Selector**:
   - Switch between patients (e.g., *Rohan V. Joshi - Thalassemia Major*, *Gurpreet Singh - Trauma ICU*, *Lakshmi Narayanan - Sickle Cell*, *Arjun Verma - Elective Surgery*).
2. **Personalized Transfusion Countdown**:
   - Displays exact scheduled transfusion date and countdown: `Due in X days (21-day cycle)`.
3. **Blood Reservation Status**:
   - Displays status: `Blood Reserved & Queued (Level 2 Priority Lock)` or `Auto-Scheduled by AI`.
   - Displays specific locked batch barcodes (e.g., `Batch #inv-108 (Locked & Cross-Matched)`).
4. **Hemoglobin Telemetry**:
   - Tracks current measured Hb (e.g., $8.6\text{ g/dL}$) versus target post-transfusion Hb ($12.0\text{ g/dL}$).
5. **Transfusion History Log**:
   - Immutable historical record of previous transfusions, units received, clinical hospital, and zero-reaction verification.
6. **Register Patient Modal (`Register Patient` Button)**:
   - Add new patient with disease, cycle frequency (days), blood group, and treating hospital.

---

## 🧬 8. Panel 6: Thalassemia & Chronic Disease Priority Center

### 🎯 Purpose
The signature hackathon-winning module dedicated to Thalassemia Major, Sickle Cell Disease, and Chronic Aplastic Anemia patients who depend on scheduled 21-to-28 day transfusions to survive.

### 📌 Features & How to Use
1. **Zero Inventory Conflict Protocol**:
   - Enforces Level 2 Priority protection so emergency general surgery requests cannot accidentally preempt a child's reserved chronic blood unit.
2. **4-Tier Priority Level Reference Matrix**:
   - Visual breakdown of Level 1 (Emergency Trauma), Level 2 (Thalassemia Recurring), Level 3 (Surgeries), Level 4 (Electives).
3. **Predictive Hemoglobin Depletion Curve Model ($Hb(t) = Hb_0 - \alpha \cdot t$)**:
   - Simulates red-cell destruction over time:
     - **Cycle Duration Slider**: Adjust between 14 and 35 days.
     - **Decay Rate ($\alpha$) Slider**: Adjust destruction rate from 0.10 to 0.30 g/dL/day.
     - **Visual Depletion Chart**: Dynamic bar graph showing daily Hb decay from post-transfusion peak ($12.0\text{ g/dL}$) down toward critical threshold ($8.5\text{ g/dL}$).
     - Hover over any bar to inspect day-by-day Hb values.
4. **Monthly Reservation System & Priority Queue (Right Column)**:
   - Lists registered Thalassemia patients with cycle cadence, due dates, and needed leukodepleted PRBC units.
   - **The Action**: Click **Advance Monthly Lock**:
     - System searches parent database for matching leukodepleted units.
     - Automatically changes unit status to `reserved` and attaches patient ID.
     - Patient card updates to `Blood Reserved & Queued (Level 2 Priority Lock)`.
     - Prevents general hospital preemption!

---

## 🧠 9. Panel 7: AI Blood Shortage Prediction Core

### 🎯 Purpose
Machine Learning command studio providing predictive multi-horizon shortage forecasting and interactive scenario stress-testing.

### 📌 Features & How to Use
1. **Horizon Selector (7, 15, 30, 90 Days)**:
   - Click any horizon tab at top right to view demand and depletion projections over that window.
2. **Interactive "What-If" Scenario Simulator (Top Indigo Banner)**:
   - **4 Dynamic Sliders**:
     - *Holiday Donation Slump*: $1.0\times$ to $2.5\times$ (simulates $-35\%$ donor turnout during Diwali/Christmas).
     - *Disease Outbreak (Dengue)*: $1.0\times$ to $3.0\times$ (multiplies platelet demand up to $+180\%$).
     - *Accident / Disaster Surge*: $1.0\times$ to $2.5\times$ (acute drain on universal `O-` and `B+`).
     - *Admission Rate Multiplier*: $0.8\times$ to $2.0\times$ (scales elective surgery bed burn rate).
   - **Quick Simulation Presets**:
     - Click `🎉 Festive Slump`
     - Click `🦟 Dengue Outbreak`
     - Click `🚗 Highway Trauma`
     - Click `🔄 Reset Baseline`
   - Click **Execute What-If Model Recalculation**:
     - Real-time recalculation updates risk ratings, days of supply, and projected deficits instantly!
3. **Forecast Output Cards**:
   - Shows projected demand, expected inflow, days of supply remaining, and risk level per blood group.
   - If a group enters deficit, displays red warning: `Projected Shortage Deficit: -X units`.
   - Explains primary clinical deficit driver.
4. **Regional Vulnerability Matrix**:
   - Ranks North, West, South, East, and Central Zones by shortage probability.
5. **Model Transparency & Architecture Details**:
   - Algorithm: *Gradient Boosted Multi-Horizon Time Series with Poisson Demand Calibration*.
   - Performance: $R^2 = 0.941$, Mean Absolute Error: $2.14\text{ units}$, 95% Confidence Interval.
   - Feature Weight Breakdown: Historical Usage (35%), Festival Slump (18%), Outbreaks (16%), Trauma (14%), Expiry Decay (10%).

---

## 🗺️ 10. Panel 8: Smart Geographic Blood Exchange Network (GIS Map)

### 🎯 Purpose
Interactive geospatial visualization connecting physical facilities and monitoring cold-chain logistics in transit.

### 📌 Features & How to Use
1. **Interactive Leaflet Map**:
   - Pan and zoom across India's regional healthcare corridors.
   - **Red Hospital Markers (🏥)**: Display ICU bed capacity, stock level, daily usage.
   - **Blue Blood Bank Markers (🩸)**: Display cold-chain temperature, capacity, license.
   - **Green Donor Markers (❤️)**: Display donor eligibility, impact score.
   - **Orange Transit Markers (🚁 / 🚑)**: Moving icons representing autonomous cold-chain drones and express emergency couriers with pulsing glow.
2. **Map Filter Checkboxes (Top Right)**:
   - Toggle visibility of `🏥 Hospitals`, `🩸 Blood Banks`, `❤️ Donors`, and `🚁 Fleet Transit`.
3. **Interactive Selection Sidebar**:
   - Click on any map marker to open its full details in the right-hand panel.
   - Provides direct 1-click action buttons:
     - For Hospital: `Open Hospital Action Panel`
     - For Blood Bank: `Manage Facility Inventory`
     - For Donor: `Send Direct Emergency Request`
     - For Transfer: Inspect live cold-chain telemetry ($3.2^\circ\text{C}$ Chilled) and ETA countdown.
4. **Dispatch New Transit (`+ Dispatch Drone` Button)**:
   - Dispatches a new autonomous medical drone transfer (`AERO-MED-0X`) from Rotary Metro Central to Tata Memorial with live GPS tracking.

---

## 📋 11. Complete 3-Minute Demo Script (For Presentations & Hackathons)

If you are showcasing this project to judges or evaluators, follow this sequence:

1. **Start on National Command Center (`Command Center` Tab)**:
   - Point out the 3,710+ live units, the real-time Blood Group Heatmap, and how `O-` and rare groups are color-coded in Red/Orange.
2. **Demonstrate AI Prediction Core (`AI Prediction Core` Tab)**:
   - Toggle between 7, 15, 30, and 90-day horizons.
   - Click **🦟 Dengue Outbreak** in the What-If Simulator and click **Execute Recalculation** to show how platelet demand surges and triggers shortage alerts.
3. **Showcase Thalassemia Priority Module (`Thalassemia Priority` Tab)**:
   - Explain the 21-day hemoglobin decay model ($Hb(t) = Hb_0 - \alpha \cdot t$).
   - Click **Advance Monthly Lock** on patient *Rohan Joshi* to demonstrate how Leukodepleted blood is locked 5 days in advance with Level 2 Priority protection.
4. **Trigger Emergency Mode (Red Button at top right)**:
   - Click `Emergency Mode`, select *Ahmedabad*, and click **Activate Code Red Emergency**.
   - Show how the emergency radar banner immediately pulses across the top of the entire screen and sends simulated mass SMS alerts.
5. **Navigate to the National Blood Map (`National Blood Map` Tab)**:
   - Show the interactive Leaflet GIS map with hospitals, blood banks, donors, and moving drones.
   - Click `+ Dispatch Drone` to demonstrate autonomous cold-chain transfer dispatch.
6. **Celebrate Donor Engagement (`Donor Panel` Tab)**:
   - Select *Dr. Vikramaditya Sen*, click **View Lifesaver Certificate**, and enjoy the celebratory confetti and printable government certificate!
7. **Highlight Security (`Audit Ledger` & `Aadhaar e-KYC` Buttons in Navbar)**:
   - Open the Audit Ledger to show the immutable SHA-256 cryptographic hashes guaranteeing end-to-end chain of custody.

---

*BloodLink AI Enterprise Platform — Saving Lives Through Predictive Intelligence.*
