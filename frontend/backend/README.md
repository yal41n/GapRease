# Cyber GAP MVP Backend

A FastAPI starter backend for a cyber GAP management MVP with:

- JWT auth with `ciso` and `user` roles
- GAP CRUD and assignment/status flows
- Analysis upload flow with a mock AI pipeline
- Import analysis findings into the GAP board
- Community sharing endpoint
- Leaderboard endpoint

## Project structure

```text
backend/
├── app/
│   ├── main.py
│   ├── core/
│   ├── models/
│   ├── schemas/
│   ├── routers/
│   ├── services/
│   └── ai/
├── uploads/
├── data/
├── requirements.txt
└── README.md
```

## Quick start

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open docs at:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Demo users

- `ciso@example.com` / `admin123`
- `user@example.com` / `user123`

## Important notes

- The AI pipeline is mocked in `app/ai/ollama_client.py` so you can swap it for a real Ollama or agency-agents integration.
- `loaders.py` currently handles text-ish files in a basic way. Extend it for PDF, DOCX, XLSX, images, and scanned documents.
- SQLite is used for MVP speed. Move to PostgreSQL for production.

## Suggested next upgrades

1. Add real async background jobs for long analyses.
2. Replace mock analysis with Ollama HTTP calls.
3. Add Alembic migrations.
4. Add tests with pytest.
5. Add framework mapping for ISO 27001, CIS, and NIST CSF.
