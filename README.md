# Home FullStack Application

A full-stack application with React frontend, FastAPI backend, and PostgreSQL database, containerized with Docker.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: FastAPI + Python + SQLAlchemy
- **Database**: PostgreSQL
- **Containerization**: Docker + Docker Compose

## Quick Start

### Prerequisites

- Docker and Docker Compose installed

### Running the Application

#### Windows (PowerShell)
```powershell
.\docker-up.ps1
```

#### Windows (Batch)
```batch
start.bat
```

#### Linux/Mac
```bash
make up
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health
- Database: localhost:5432 (user: user, pass: password)

### Development

#### Backend
```bash
cd backend
pip install -r requirements.txt  # or use poetry
python start.py
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
.
├── backend/          # FastAPI backend
├── frontend/         # React frontend
├── docker-compose.yml
├── .env              # Environment variables (not committed)
├── .gitignore
├── makefile          # Make commands for Linux/Mac
├── start.bat         # Batch script for Windows
└── docker-up.ps1     # PowerShell script for Windows
```

## Environment Variables

Copy `.env` from example and configure:
- Database settings
- Ports
- Secrets

## API Documentation

Once running, visit http://localhost:8000/docs for interactive API documentation.
