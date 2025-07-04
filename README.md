# Document Analyzer

A modern document analysis system with Azure Document Intelligence and ChatGPT verification.

## Project Structure

```
document-analyzer/
├── backend/          # FastAPI backend with layered architecture
├── frontend/         # Future React/Vue frontend (prepared)
├── documents/        # Sample documents for testing
└── venv/            # Python virtual environment
```

## Features

- **Azure Document Intelligence**: Analyze tax documents (Form 1040, W-2, 1099, etc.)
- **ChatGPT Verification**: Validate document types and content
- **REST API**: Clean, documented endpoints with automatic docs
- **Web UI**: Simple interface for testing
- **Layered Architecture**: Clean separation of concerns

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m app.main
```

The server will start at `http://localhost:8000`

- **Web UI**: `http://localhost:8000/`
- **API Docs**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Environment Variables

Create a `.env` file in the backend directory:

```env
AZ_ENDPOINT=your_azure_endpoint
AZ_KEY=your_azure_key
OPENAI_API_KEY=your_openai_key
```

## API Endpoints

- `GET /` - Web UI
- `POST /tax/analyze` - Analyze tax documents
- `GET /tax/models` - List available Azure models
- `POST /files/upload` - Upload files

## Architecture

### Backend (FastAPI)
- **Routes**: Handle HTTP requests/responses
- **Services**: Business logic and external API calls
- **Models**: Data validation and serialization
- **Utils**: Configuration and utilities

### Frontend (Future)
- **React/Vue.js**: Modern frontend framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Vite**: Build tool and dev server

## Development

The project is structured for easy development:

1. **Backend**: Clean FastAPI with layered architecture
2. **Frontend**: Prepared for modern frontend development
3. **Documentation**: Comprehensive READMEs in each directory

See individual READMEs in `backend/` and `frontend/` for detailed instructions.
