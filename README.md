# 🔐 CyberGAP (GAPrizz)

**AI-powered cybersecurity GAP analysis platform** that helps organizations **identify, prioritize, and close security gaps** collaboratively — continuously, and with **full confidentiality control** (including a fully on‑prem / air‑gapped option).

![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-API-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=000000)
![Ollama](https://img.shields.io/badge/Ollama-Local_LLM-000000?style=for-the-badge&logo=ollama&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-2EA44F?style=for-the-badge)

---

## 📚 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🧰 Tech Stack](#-tech-stack)
- [📦 Getting Started](#-getting-started)
- [▶️ Running Locally](#️-running-locally)
- [🔌 API Reference](#-api-reference)
- [🤖 Agent Pipeline](#-agent-pipeline)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Overview

**CyberGAP** is an AI-powered cybersecurity GAP analysis platform for:

- **CISOs / security leaders** who need a clear, defensible view of gaps and remediation progress.
- **Security analysts** who need actionable tasks, assignments, and a workflow that fits real operations.
- **Organizations with strict data requirements** that need **confidentiality by design** and an option to deploy **fully on‑premises**, including the AI model.

CyberGAP supports industry frameworks such as **ISO 27001**, **NIST CSF 2.0**, and **SOC 2**. It can ingest real-world evidence (policies, audits, spreadsheets, diagrams) and map findings to framework controls/subcategories—then turns them into trackable gaps.

---

## ✨ Key Features

- **🧩 GAP Board (CISO-first workflow):** Create, assign, and track gaps through `open → in progress → resolved`.
- **🔐 RBAC access control:** CISOs see all gaps; users see only assigned gaps (role-aware listing and updates).
- **🤖 AI Cyber GAP Analysis Pipeline:** Multi-agent analysis that extracts gaps from uploaded evidence and maps them to **NIST CSF 2.0** subcategory IDs.
- **📡 Streaming results (SSE):** AI findings stream live to the frontend for fast review and iteration.
- **🧪 Hallucination resistance:** QA Manager agent asks up to **5 clarifying questions per domain** and prevents loop behavior.
- **✅ Human-in-the-loop confirmation:** CISO confirms findings before importing them into the GAP Board.
- **🌍 Community GAP Intelligence (opt-in):** Anonymized, k-anonymous sharing for peer benchmarks (industry + size bucketing).
- **📊 Gamification Board:** Real-time leaderboard based on resolved gaps; export real gaps as structured training missions for interns/juniors.
- **🏢 On-Prem / Air-Gap ready:** Self-host the full platform and LLM—no data leaves your environment.

---

## 🏗️ Architecture

### System Diagram (High Level)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           CyberGAP (GAPrizz)                              │
├──────────────────────────────────────────────────────────────────────────┤
│  React SPA (Vite + Tailwind + shadcn/ui + Recharts)                        │
│  - GAP Board     - Analysis Review (SSE)     - Community / Leaderboard     │
└───────────────┬──────────────────────────────────────────��───────────────┘
                │ HTTPS + JWT
                v
┌──────────────────────────────────────────────────────────────────────────┐
│                       FastAPI Backend (Python)                            │
│  - Auth (JWT)  - RBAC middleware  - GAP CRUD  - SSE stream endpoint        │
│  - Analysis jobs - Import confirmation - Community anonymization           │
└───────────────┬──────────────────────────────────────────────────────────┘
                │
                │ ORM / persistence
                v
┌───────────────────────────────┐       ┌──────────────────────────────────┐
│   SQLite (MVP) / PostgreSQL    │       │    AI Cyber GAP Analysis Pipeline │
│   - users, gaps, assignments   │       │  - doc ingestion (PDF/DOCX/...)   │
│   - audit/report artifacts     │       │  - multi-agent extraction          │
└───────────────────────────────┘       │  - framework mapping               │
                                        │  - shared memory files             │
                                        └───────────────┬──────────────────┘
                                                        │ local calls
                                                        v
                                            ┌──────────────────────────────┐
                                            │          Ollama (Local)        │
                                            │  - llava (vision/OCR)          │
                                            │  - mistral (reasoning)         │
                                            └──────────────────────────────┘
```

---

## 🧰 Tech Stack

| Layer | Technology |
|------|------------|
| Backend | Python, FastAPI, SQLite (MVP) → PostgreSQL, JWT authentication, RBAC middleware |
| AI / Agentic | Ollama (`llava` for vision/OCR, `mistral` for reasoning), agency-agents SDK, LangChain Community document loaders |
| Frontend | React 18, Vite, Tailwind CSS, shadcn/ui, Recharts |
| DevOps / Deploy | Railway / Render (CI/CD), Docker (on-prem option) |

---

## 📦 Getting Started

### ✅ Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **Ollama** installed and running (for local/on‑prem LLM inference)

### 🛠️ Installation

```bash
# Clone
git clone https://github.com/<your-org-or-user>/cybergap.git
cd cybergap

# Backend setup
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd frontend
npm install
cd ..

# Pull Ollama models (example)
ollama pull mistral
ollama pull llava

# Configure environment
cp .env.example .env  # or create .env manually
```

### 🧾 Example `.env`

> Adjust values based on your environment. For air‑gapped deployments, keep all endpoints local.

```dotenv
# App
ENV=development
APP_NAME=CyberGAP
SECRET_KEY=change-me

# Auth
JWT_SECRET_KEY=change-me-too
JWT_ACCESS_TOKEN_EXPIRES_MINUTES=60

# Database
DATABASE_URL=sqlite:///./cybergap.db
# For Postgres:
# DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/cybergap

# Ollama (local LLM)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_REASONING_MODEL=mistral
OLLAMA_VISION_MODEL=llava

# Uploads / Jobs
UPLOAD_DIR=./uploads
JOBS_DIR=./jobs

# Community sharing (optional)
COMMUNITY_SHARING_ENABLED=false
KANONYMITY_K=10
```

---

## ▶️ Running Locally

Run each component in its own terminal.

### 1) Start Ollama

```bash
ollama serve
```

### 2) Start Backend (FastAPI)

```bash
# From repo root
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3) Start Frontend (React)

```bash
cd frontend
npm run dev
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Credentials → JWT |
| POST | `/gaps` | Create a new GAP |
| GET | `/gaps` | List GAPs (role-filtered) |
| PATCH | `/gaps/{id}/assign` | Assign GAP to user/unit |
| PATCH | `/gaps/{id}/status` | Update GAP status |
| POST | `/analysis/upload` | Upload files for AI analysis |
| GET | `/analysis/{job_id}/stream` | SSE stream of AI output |
| POST | `/analysis/{job_id}/import` | Confirm findings → import to GAP Board |
| POST | `/community/share` | Opt-in anonymized GAP submission |
| GET | `/leaderboard` | Gamification scores |

> Authentication: endpoints are expected to use `Authorization: Bearer <token>` unless explicitly public.

---

## 🤖 Agent Pipeline

CyberGAP uses a **multi-agent pipeline** to ingest evidence and turn it into *reviewable, framework-mapped gaps*. Agents run **in parallel where possible**:

- **First:** Network + IAM + Cloud
- **Then:** AppSec + Endpoint (depend on network/IAM context)
- **Last:** Compliance Audit (depends on all others)

Shared memory files (typical job workspace):

- `context.md`, `current_state.md`, `findings/*.md`, `gaps.md`, `disputed.md`, `report_draft.md`

### Multi-Agent Tree

```
CISO Agent (Orchestrator)
├── Planner (task decomposition, agent routing, loop detection)
│   ├── Current State Analyzer
│   │   └── QA Manager (validates answers, prevents loops, 5-question cap)
│   └── Cybersecurity Manager
│       ├── Network Security Agent
│       ├── IAM Agent
│       ├── AppSec Agent
│       ├── Cloud Security Agent
│       ├── Endpoint & Data Agent
│       ├── Compliance Audit Agent (framework mapping)
│       └── Third-Party Risk Agent
└── Reporter Agent (Markdown report generation)
```

---

## 🚀 Deployment

### Railway / Render (Cloud)

1. **Backend**
   - Create a new service from your GitHub repo
   - Set environment variables (at minimum: `DATABASE_URL`, `JWT_SECRET_KEY`, `SECRET_KEY`)
   - Configure the start command, e.g.:
     ```bash
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
2. **Database**
   - Use managed Postgres in Railway/Render (recommended for production)
   - Run migrations/initialization as part of your deploy pipeline
3. **Frontend**
   - Deploy as a static site (Vite build output)
   - Point the frontend to the backend base URL via an environment variable (e.g. `VITE_API_BASE_URL`)

> Note: Cloud deployments may not be appropriate for regulated environments without additional controls. For strict confidentiality requirements, use the on-prem option.

### 🐳 On-Prem / Air-Gap (Docker)

CyberGAP supports fully on-prem deployment where:
- **FastAPI + DB + frontend** run inside your environment
- **Ollama and models** run locally
- **No documents or telemetry leave the network**

Typical deployment uses Docker (and optionally Docker Compose / Kubernetes) to run:
- `backend` (FastAPI)
- `frontend` (static server / reverse proxy)
- `postgres` (optional; SQLite for MVP)
- `ollama` (local inference)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feat/your-change
   ```
3. Commit changes
   ```bash
   git commit -m "feat: describe your change"
   ```
4. Push your branch
   ```bash
   git push origin feat/your-change
   ```
5. Open a Pull Request (PR) with a clear description and screenshots/logs where helpful

---

## 📄 License

MIT License. See `LICENSE` for details.
