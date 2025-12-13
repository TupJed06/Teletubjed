# 🖥️ Smart Desk Frontend

> **A Real-time Web Dashboard for the Smart Desk IoT Productivity System. Visualizes environmental data and manages focus sessions via ESP32 synchronization.**

![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-UI-38B2AC?style=for-the-badge&logo=tailwindcss)
![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)

## 📖 About The Project

This repository contains the **Frontend Interface** for the "Smart Desk" project (Embedded Systems Class).

### 🔗 Ecosystem & Links
This repository handles the User Interface. The full system includes:
* **🤖 Hardware/AI :** [Smart Desk Code](https://github.com/Rirhcceez/Teletubjed_ESP32-) - (C/Python).
* **⚙️ Backend API:** [Smart Desk Server](https://github.com/TupJed06/Teletubjed_BE) - (Node.js/Express).
* **🖥️ Frontend Dashboard:** [Smart Desk UI](https://github.com/TupJed06/Teletubjed) - (React).

---

## ⚙️ The Frontend Architecture

This repository implements the following 3 core modules:

1.  **Dashboard & Visualization:**
    * **Real-time Stats:** Fetches temperature and humidity data from the backend and renders it using interactive line charts.
    * **Status Indicators:** Displays the current state of the ESP32 (Idle, Focusing, Break) and connection status.

2.  **Focus Timer Control:**
    * **Bi-directional Sync:** Sending a "Start" command from the web immediately triggers the OLED countdown on the physical desk.
    * **Timer Logic:** Handles Pomodoro logic (25min / 5min) and custom duration settings.

3.  **API Integration:**
    * **Service Layer:** Uses `Axios` to communicate with the Node.js backend.
    * **State Management:** Manages application state to ensure the Web UI and Physical Device are always in sync.

---

## 📂 Project Structure

```text
.
├── public/               # Static assets 
├── src/
│   ├── app/              # Main Route Pages
│   ├── components/       # Reusable UI Components
│   ├── contexts/         # React Context for global state
│   ├── hooks/            # Custom React hooks 
│   ├── interfaces/       # TypeScript interfaces & Data models
│   ├── libs/             # Third-party lib and API
│   └── utils/            # Helper functions
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Styling configuration
````

-----

## 💻 Setup & Installation

### 1\. Clone the Repository

```bash
git clone [https://github.com/TupJed06/Teletubjed.git](https://github.com/TupJed06/Teletubjed.git)
cd Teletubjed
```

### 2\. Install Dependencies

Ensure you have Node.js (v18+) installed.

```bash
npm install
```

### 3\. Configure Environment

Create a `.env` file in backend and frontend

-----

## 🚀 Usage (Development)

### Run locally

This will start the development server.

```bash
npm run dev
```
  * The dashboard will be accessible at `http://localhost:5000`.

### Build for Production

To create a static build for deployment (e.g., Vercel):

```bash
npm run build
```

-----

## 🛠 Features Breakdown

**1. Focus Session**

> Users can select a preset (Pomodoro, Short Break, Long Break) or set a custom time. Clicking "Start" sends a payload to the backend, which forwards it to the ESP32 via MQTT/WebSocket.

**2. Environmental Analytics**

> The dashboard polls the API every 30 seconds to update the Temperature and Humidity charts, helping users identify if their room condition is optimal for working.

**3. Gesture Control Feedback**

> When a user uses a Hand Gesture on the physical desk to stop the timer, the Web Dashboard receives a socket event and updates the UI instantly without page refresh.

-----

## 👨‍💻 Contributors

**Team Smart Desk**

  * Jedsada Meesuk
  * Patcharapon Srisuwan
  * Patthadon Phengpinij
  * Warapong Thongkhundam

*Submitted for 2110356 Embedded Systems Project, Chulalongkorn University.*
