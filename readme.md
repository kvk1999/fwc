# FWC 2026 SmartVenue Hub 🏆

Welcome to the **FIFA World Cup 2026 SmartVenue Hub**—a state-of-the-art, high-fidelity digital twin and AI-assisted companion application designed for stadium organizers, operations volunteers, and fans attending the knockout stages of the 2026 tournament.

Built as a high-fidelity single-page web app using pure modern technologies, the Hub provides **context-aware multilingual assistance**, **eco-transit calculations**, and an **Executive Operations (V-Ops) telemetry suite** to optimize stadium crowd flows and real-time incident resolution.

---

## 🌟 Primary Capabilities

The Hub is divided into two operational modes, toggled seamlessly via the mode-slider:

### 1. 🎟️ Fan Portal Mode
Designed to enhance the on-site match-day experience for thousands of fans in the stadium:
*   **Interactive Wayfinding & Facilities**: A custom interactive vector map highlighting seating category sectors, gates, accessible concessions, family restrooms, and medical stations with real-time wait queues.
*   **Eco-Transit Planner**: Integrates carbon savings calculation based on fan travel methods (electric rails, tournament shuttles, carpooling) and translates travel distance directly into **Green Coins (GC)** in the FIFA Eco-Wallet.
*   **StadiumGuide AI**: A multilingual virtual host powered by Gemini-inspired contextual response loops, capable of translating queries and offering real-time assistance in English, Spanish, French, Portuguese, and Arabic.

### 2. 📡 V-Ops Control Room Mode
Empowers venue operations, safety staff, and security teams with high-fidelity control over the arena:
*   **Real-Time Telemetry Dashboard**: Monitors live stadium metrics such as occupancy percentage (93.4% baseline), gate throughput flow (people-per-minute), green grid solar output, and rainwater harvesting metrics.
*   **Dynamic Incident Dispatch Panel**: Interactive alert logging and response management allowing controllers to dispatch on-ground tournament volunteers to incidents (e.g., ticket gate bottlenecks, medical assistance, carbon bin overfill alerts).
*   **AI Intelligent HVAC Smart Mode**: Integrates an adjustable eco-power governor reducing stadium grid draw on solar resources with predictive power savings updates.

---

## 🛠️ Architecture & Tech Stack

This platform is developed to be completely dependency-free, modern, and rapid to load locally:
1.  **Frontend Markup**: Semantically structured HTML5 utilizing responsive containers and custom vector SVG maps.
2.  **Design System**: Vanilla CSS3 styled with a stunning, premium **glassmorphic design system** with vibrant neon telemetry indicator glows, clean typography (Outfit and JetBrains Mono), smooth responsive grids, and micro-interactions.
3.  **Core Logic**: Object-Oriented Vanilla JS (ES6 Class-based architecture) featuring:
    *   Simulated live telemetry fluctuations utilizing random-walk drift algorithms.
    *   State-synchronized language toggling affecting both standard text elements and AI helper context menus.
    *   Secure element-guard validation protecting standard rendering paths from null references.

---

## 🚀 Running the App Locally

Since the platform is designed as a modular client-side SPA, running it is quick and simple:

### Option A: Standard Web browser
Simply open the `index.html` file in any modern web browser:
```powershell
# Open on Windows
Start-Process "index.html"
```

### Option B: Local Live Server
For a more performant development environment, serve the directory via any local web-server or Python:
```bash
# Python 3
python -m http.server 8000

# Node.js light-server (alternative)
npx live-server
```
Navigate to `http://localhost:8000` to view the running app.

---

## 📂 Project Structure
```text
fwc/
├── index.html   # Main dashboard structure (Fan Portal and V-Ops grids, SVGs, Modals)
├── index.css    # Modern glassmorphism style sheet, layout grids, and animations
├── app.js       # App state machine, event listeners, telemetry sim, and languages
└── readme.md    # System handbook and project guide
```

---

## 🏆 Official FWC 2026 Telemetry Awareness
*   **Operational Date Context**: Operating under active tournament knockout mode.
*   **Coverage Range**: Actively managing telemetry streams across all **16 host venues** (MetLife Stadium, SoFi Stadium, Estadio Azteca, AT&T Stadium, etc.) and handling match-day data for **104 total tournament fixtures**.
