# InvoiceGuard AI
AI-Powered Multi-Agent Invoice & Expense Exception Handling Platform

## Overview
InvoiceGuard AI is an enterprise-grade accounts payable automation platform powered by a genuine multi-agent architecture built with **LangGraph**, **FastAPI**, **SQLAlchemy**, and a modern **React + TypeScript + Tailwind CSS** dashboard.

## Core Multi-Agent Architecture
1. **Document / OCR Agent**: Performs document analysis, OCR raw text extraction, and document classification.
2. **Invoice Extraction Agent**: Extracts structured metadata (Vendor, Invoice #, Dates, PO #, Totals, Line items).
3. **Validation Agent**: Executes deterministic rule checks (math verification, missing fields, tax calculation validation).
4. **PO Matching Agent**: Cross-references against purchase order database, calculating variances and line item discrepancies.
5. **Policy Compliance Agent**: Enforces configurable corporate policies (approval limits, PO thresholds, max variance limits).
6. **Fraud & Anomaly Agent**: Detects duplicate invoices, unusual amounts, vendor anomalies, and generates 0-100 risk score.
7. **Decision Agent**: Synthesizes agent evaluations to produce actionable decisions (`APPROVE`, `REVIEW`, `REJECT`) with clear explanations.
8. **Human-In-The-Loop (HITL) Queue**: Interactively routes high/medium risk invoices for reviewer sign-off with full audit logging.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Backend**: Python 3.10+, FastAPI, Pydantic v2, SQLAlchemy, LangGraph
- **Database**: SQLite (out-of-the-box local setup) / PostgreSQL compatible
- **Authentication**: JWT Auth with Role-Based Access Control (Admin, Finance Manager, Reviewer, Employee)

## Quick Start Guide

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m app.database.seed
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` to access the InvoiceGuard AI Dashboard.
