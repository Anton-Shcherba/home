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

### Setup

1. Clone the repository
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
3. Start the application:
   ```bash
   docker-compose up --build
   ```

### Alternative Start Methods

#### Windows (Batch)
```batch
start.bat
```

#### Linux/Mac
```bash
make up
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/api/health
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
├── .env.example      # Environment variables template
├── .env              # Environment variables (not committed)
├── .gitignore
├── makefile          # Make commands for Linux/Mac
└── start.bat         # Batch script for Windows
```

## Environment Variables

Copy `.env.example` to `.env` and configure as needed:
- Database settings
- Ports
- Secrets

## API Documentation

Once running, visit http://localhost:8000/docs for interactive API documentation.
