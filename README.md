# BloodLink AI – Predictive Blood Shortage Network

Enterprise-grade national blood ecosystem platform designed to prevent blood shortages through real-time inventory aggregation, AI predictive analytics, automated Thalassemia monthly priority reservation, emergency donor activation, and inter-facility cold-chain logistics.

---

## Prerequisites

- **Node.js**: Version 18.x, 20.x, or 22.x ([Download Node.js](https://nodejs.org/))
- **npm** (comes with Node.js) or **bun** / **pnpm** / **yarn**

---

## Quick Start (Run Locally)

### 1. Extract and Open the Directory
Extract the downloaded ZIP file and navigate into the folder:
```bash
cd bloodlink-ai # or the name of your unzipped folder
```

### 2. Install Dependencies
```bash
npm install
```

### 3. (Optional) Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
If you have a Gemini API key, you can add it to `.env`:
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
PORT=3000
```
> *Note: If you don't provide a Gemini API key, the platform will automatically run its built-in algorithmic machine learning prediction engine with full functionality!*

### 4. Start the Application
```bash
npm run dev
```

### 5. Open in Your Browser
Open your browser and visit:
```
http://localhost:3000
```

---

## Available Scripts

- `npm run dev`: Starts the full-stack Express server with Vite dev middleware (`tsx server.ts`) on port 3000.
- `npm run build`: Compiles the TypeScript code and produces an optimized production build in `dist/`.
- `npm run start`: Starts the production server.
- `npm run lint`: Validates the codebase using the TypeScript compiler.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend**: Node.js, Express.js, `@google/genai` (Gemini 3.8 Flash)
- **Logistics**: Cold-chain telemetry simulation, GIS mapping, 4-tier medical priority queue
