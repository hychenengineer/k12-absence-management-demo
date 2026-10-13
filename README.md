# SubConnect: K-12 Absence Management & Substitute Placement Engine

An enterprise reference implementation of a modern K-12 teacher absence management and automated substitute placement platform, built with **.NET 10 / C# Web API**, **React 18 TypeScript**, and **Azure SignalR real-time WebSockets**.

> **Architecture Overview:** Engineered to solve the high-concurrency 6:00 AM district call-out rush with zero-polling WebSocket broadcasts, multi-persona qualification matching (Teacher, School Administrator, Substitute), and asynchronous notification worker dispatchers.

---

## 1. Quick Setup & Run Guide

### ⚡ Option A: Zero-Setup Standalone Executable (Recommended)

**No Node.js, npm, or .NET SDK installation required!**

1. **[Download Demo-win-x64.zip (GitHub Release)](https://github.com/hychenengineer/k12-absence-management-demo/releases)**
2. Extract the ZIP archive anywhere on a Windows machine.
3. Double-click **`SubConnect.Demo.exe`** (or the launcher).
4. The application initializes SQLite, seeds district data, and **automatically opens your browser to `http://localhost:5000`** with the full React 18 UI, REST API, and SignalR live!

---

### 🛠️ Option B: Run from Source (.NET & Node.js)

#### Prerequisites
- [.NET SDK (v8.0 or v10.0)](https://dotnet.microsoft.com/download)
- [Node.js (v18+) & npm](https://nodejs.org/)

#### Step 1: Start the Backend (.NET Web API)
Open a terminal and start the .NET Web API:

```bash
cd src/SubConnect.Api
dotnet run
```

- **Application & API URL**: `http://localhost:5000` *(serves both embedded React UI and REST API)*
- **Interactive Swagger Docs**: `http://localhost:5000/swagger`
- **Database**: An SQLite database (`subconnect.db`) is automatically initialized and seeded with schools, teachers, substitutes, and baseline absence records on startup.

#### Step 2: Start the Frontend for Active Development (Optional)
If modifying React source code with Vite Hot Module Reloading:

```bash
cd src/subconnect-ui
npm install
npm run dev
```

- **Vite Dev URL**: `http://localhost:5173` (proxies `/api` and `/hubs` to port 5000)

#### Step 3 (Optional): Start the Azure Background Worker
To run the Azure Functions SMS burst dispatcher:

```bash
cd src/SubConnect.Worker
dotnet run
```

---

## ⚡ AI Substitute Smart Dispatch Copilot (Groq / OpenAI / Anthropic)

SubConnect includes an intelligent, multi-provider **AI Dispatch Copilot** designed to recommend optimal substitutes in milliseconds during morning call-outs:

- **Ultra-Fast Groq LPUs**: Leverages Groq's high-speed inference engine (`llama-3.3-70b-versatile`, `llama-3.1-8b-instant`) returning intelligent, multi-factor substitute rankings in **~200ms**.
- **Multi-Provider Architecture**: Supports **Groq**, **OpenAI** (`gpt-4o-mini`, `gpt-4o`), **Anthropic** (`claude-3-5-haiku`), or a **Zero-Config Offline Heuristic Engine**.
- **Real-Time Visual Execution Feedback**:
  - 🟢 **Live AI Active Status Callout**: When a valid key is provided, the UI verifies live LLM generation with a green status banner (e.g. `🚀 Live AI Active: Live API call succeeded with GROQ (llama-3.3-70b-versatile) in 218ms`).
  - 🟡 **Deterministic Fallback Notice**: If offline or no key is entered, explicitly displays the fallback notice so users always know whether live LLM generation or heuristic scoring was used.
  - **Live Navbar Status Pill**: Indicates configured provider and key validity (e.g. `GROQ ✓` vs `GROQ (No Key)`).
- **Multi-Factor Scoring Matrix**:
  - State certification alignment (e.g. Science / Chemistry endorsements).
  - Department & grade-level familiarity.
  - Weekly FLSA overtime compliance limits.
  - Teacher preference history & star ratings.
- **In-App Model & Key Configuration**: Administrators and reviewers can click the **AI Settings** button in the top navigation bar to select their preferred AI provider, model preset, and supply their own API key (persisted safely in local browser storage). If no key is provided, the system gracefully falls back to the zero-config offline rule engine so the demo never fails.

---

## 2. Concrete Walkthrough Example: Emergency Absence & Substitute Placement

This step-by-step scenario walks through how the three primary personas (**Teacher**, **Administrator**, and **Substitute**) interact with the platform in real time with zero page reloads.

### Scenario: High School Chemistry Teacher Calls Out Sick

#### Step 1: Teacher Creates the Absence
1. Open `http://localhost:5000` (or `http://localhost:5173` in development) in your browser.
2. Click the **Teacher** tab in the top navigation bar.
3. In the **Teacher Persona** dropdown, select **Sarah Johnson (Lincoln High School — Science, Room 204)**.
4. Select the date (e.g., tomorrow), duration (**Full Day**), reason (**Illness / Medical**), and enter notes: `"Lab experiment safety sheets are printed on my desk. Period 4 has Quiz 3."`
5. Click **Create Absence**.
   - *Behind the Scenes*: The .NET API records the absence with status `Open`, triggers the qualification matching engine, and broadcasts an `AbsenceCreated` event across SignalR.

#### Step 2: Administrator Dispatches via AI Smart Dispatch Copilot
1. Switch to the **School Admin** tab (or open it side-by-side in a second browser window).
2. Look at the **Absence Board**:
   - The new absence for **Sarah Johnson** appears immediately in the **Open / Unfilled** list via SignalR with zero page refreshing.
3. Click the **ASSIGN** button on Sarah Johnson's card.
4. The **AI Substitute Smart Dispatch Copilot** opens:
   - Evaluates all available substitutes against the teacher's subject (`10th Grade Chemistry`), school location, and weekly hours.
   - Highlights the top recommendation (e.g. **Alex Martinez • 96% Match • BEST MATCH**) with certification verification chips and natural-language rationale.
   - Displays real-time engine execution telemetry (e.g., `⚡ GROQ • 218ms` or `⚡ Built-In Simulator`).
5. Click **⚡ Auto-Assign Recommended Sub** (or click **ASSIGN** next to any sub).
   - *Behind the Scenes*: The backend transitions the absence status to `Offered`, assigns the selected substitute, and pushes an `AbsenceUpdated` SignalR broadcast.

#### Step 3: Substitute Reviews and Accepts the Offer
1. Switch to the **Substitute** tab.
2. In the **Substitute Profile** dropdown, select **Alex Martinez**.
3. Under **Assigned Shifts Waiting for Your Decision**, you will see the offered shift at Lincoln High School with two action buttons:
   - **Accept Shift** (Green)
   - **Decline Shift** (Red)
4. Click **Accept Shift**.
   - *Behind the Scenes*: A `POST /api/absences/{id}/respond` request is sent to the backend. The API transitions the status from `Offered` to `Filled`, timestamps `FilledAt`, and updates the optimistic concurrency version token.

#### Step 4: Real-Time Confirmation
1. Switch back to the **School Admin** tab.
2. Observe that Sarah Johnson's absence has automatically moved to the **Filled Absences** section, showing assigned substitute **Alex Martinez**.
3. The top **District Fill Rate** metric counter dynamically updates in real-time.

---

### Bonus: Concurrency Collision Test (Race Condition Simulation)
1. On the **School Admin** tab, click **Live Board**.
2. Click the **Race Test** button.
3. This fires two simultaneous substitute claims at the exact same millisecond with conflicting expected version tokens.
4. The first claim succeeds (`200 OK`), while the second is trapped by EF Core optimistic concurrency and rejected with `409 Conflict`, demonstrating zero double-booking under high morning concurrency.

---

## 3. Strict 3-Tier Production Cloud Architecture

```
+-----------------------------------------------------------------------------------------+
|                                  TIER 1: CLIENT LAYER                                   |
|                                                                                         |
|   +--------------------+  +--------------------+  +------------------+  +-----------+   |
|   | Admin Live Board   |  | Teacher Portal     |  | Sub Mobile App   |  | Time Kiosk|   |
|   | (React + SignalR)  |  | (Absence Creation) |  | (Accept/Decline) |  | (PIN Pad) |   |
|   +--------------------+  +--------------------+  +------------------+  +-----------+   |
+--------------------------------------------+--------------------------------------------+
                                             |  HTTPS REST / WSS SignalR
                                             v
+-----------------------------------------------------------------------------------------+
|                              TIER 2: BACKEND SERVICES LAYER                             |
|                                                                                         |
|   +----------------------+   +-----------------------+   +--------------------------+   |
|   | Azure App Service    |   | Azure SignalR Service |   | Azure Service Bus        |   |
|   | Always-On Core API   |<->| Managed WebSockets    |   | 'sub-notification-queue' |   |
|   | (.NET 8/10 REST)     |   | Connection Offloading |   +------------+-------------+   |
|   +----------+-----------+   +-----------------------+                |                 |
|              |                                                        v                 |
|              |                                          +---------------------------+   |
|              |                                          | SubNotificationDispatcher |   |
|              |                                          | Azure Function (Burst)    |   |
|              |                                          | 6:00 AM Serverless Worker |   |
|              |                                          +-------------+-------------+   |
+--------------+--------------------------------------------------------+-----------------+
               |                                                        |
               | EF Core DbContext Pool                                 | Carrier API
               v                                                        v
+-----------------------------------------------------------------------------------------+
|                      TIER 3: DATA STORAGE & EXTERNAL PROVIDERS                          |
|                                                                                         |
|   +------------------------+   +-----------------------+   +------------------------+   |
|   | SQLite / Azure SQL     |   | Azure Blob Storage    |   | Twilio / Carrier SMS   |   |
|   | Row Version Concurrency|   | Encrypted Vault Files |   | 10-DLC Short Codes     |   |
|   +------------------------+   +-----------------------+   +------------------------+   |
+-----------------------------------------------------------------------------------------+
```

### Architectural Rationale

1. **Always-On Azure App Service for Core API**:
   - Between 6:00 AM and 6:30 AM, hundreds of teachers report morning absences simultaneously.
   - Hosting the core REST API on an Always-On App Service prevents 3–5 second serverless cold starts and preserves pre-warmed database connection pools for steady sub-50ms responses.

2. **Azure SignalR Service Connection Offloading**:
   - School administrators keep attendance dashboards running throughout the school day.
   - Offloading persistent WebSocket connections to Azure SignalR Service prevents API server socket exhaustion and supports instant fan-out without client-side polling.

3. **Serverless Azure Function for Spiky SMS Bursts**:
   - The 6:00 AM substitute broadcast dispatches thousands of outbound SMS alerts in under 2 minutes, then sits idle for the rest of the day.
   - Decoupling notification delivery to Azure Service Bus and a serverless worker allows auto-scaling across dozens of instances during the surge, minimizing compute costs.

4. **Optimistic Concurrency Control (Zero Double-Booking)**:
   - Uses EF Core row version tokens (`Guid Version`) with database-level concurrency checks.
   - If two substitutes attempt to claim or accept the same position simultaneously, the winner receives `200 OK` while the second transaction is safely trapped and returned as `409 Conflict`.
