# Real Estate Management System 🏡

Welcome to the modernized **Real Estate Management System**! 🚀
This project transforms the original Express + MySQL prototype into a production-grade, zero-configuration fullstack application featuring an Express REST API, a self-contained SQLite engine with database triggers, and a modern React + Tailwind CSS frontend.

---

## ✨ Features

- **Public Real Estate Explorer**: Browse verified residential and commercial properties across Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Peshawar, and Multan.
- **Advanced Filtering**: Filter listings by Buy vs Rent, BHK count (1–5 BHK), metropolitan city, price ceiling in PKR, and search keywords.
- **Executive KPI Dashboard**: Live tracking of total sales turnover, agent commission pools, regional stock distribution, and top-performing agent leaderboard.
- **Properties & Inventory Manager**: Full CRUD operations with instant search, status editing, and listing deletion.
- **Agents Roster**: Complete directory of 20 licensed agents tracking closed deals count (`NOP_sale`), gross turnover (`total_saleAmount`), and office locations.
- **Clientele Management**: Dedicated tabs for verified Buyers and Sellers with Raast / digital settlement handles.
- **Deal Recording & Database Triggers**: Finalizing a deal automatically marks the property as `SOLD` and increments the agent's sales performance.
- **Interactive SQL Query Studio**: Run predefined analytical queries against the database (Top Earners, Modern Builds, Metropolitan Price Analysis, Luxury Estates).
- **Home Loan & EMI Estimator**: Built-in mortgage calculator with configurable down payment, tenure, and interest rate sliders.

---

## 🚀 Quick Start (Zero-Configuration)

### 1. Launch Server & Application

In the root directory, simply run:

```bash
npm start
```

Open your browser and visit:
- **Web Application**: `http://localhost:5000`
- **REST API Base**: `http://localhost:5000/api`

---

## 🛠️ Development Scripts

| Command | Action |
| :--- | :--- |
| `npm start` | Launches the Express server serving API and production frontend on port 5000 |
| `npm run dev` | Runs both backend and Vite dev server concurrently |
| `npm run build` | Rebuilds the React frontend bundle with Vite into `frontend/dist/` |

---

## 📂 Architecture

```
├── frontend/             # React + Vite + Tailwind CSS single-page app
│   ├── src/
│   │   ├── components/   # Navbar, PropertyCard, PropertyModal, AddPropertyModal, CloseDealModal
│   │   ├── views/        # Marketplace, Dashboard, Properties, Agents, Clients, Transactions, QueryStudio
│   │   ├── api.js        # REST API client
│   │   └── App.jsx       # State management & routing
│   └── dist/             # Production build served by Express
├── server/
│   ├── database.js       # Zero-config SQLite database engine & seed logic
│   ├── api.js            # Express REST API endpoints
│   └── server.js         # Unified server setup & static serving
├── my_dream_home.sql     # Original database schema and dataset (58 props, 20 agents, buyers, sellers)
├── real_estate.db        # SQLite database populated from SQL
├── index.js              # Application entry point
└── package.json
```

---

## 🤝 Credits
- Original schema and concept: Kiran Kumar Rout & Team.
- Modernized fullstack architecture, React UI, and SQLite migration powered by Antigravity.
