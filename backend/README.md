# Document Analyzer Backend

FastAPI backend for document analysis with Azure Document Intelligence and ChatGPT verification.

## Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── models/              # Pydantic response models
│   ├── routes/              # API endpoints
│   │   ├── tax_routes.py    # Tax analysis endpoints
│   │   └── file_routes.py   # File upload endpoints
│   ├── services/            # Business logic
│   │   ├── azure_service.py # Azure Document Intelligence
│   │   ├── chatgpt_service.py # ChatGPT verification
│   │   └── file_service.py  # File operations
│   ├── utils/               # Utilities
│   │   └── config.py        # Configuration management
│   └── templates/           # Web UI templates
├── uploads/                 # File upload directory
└── requirements.txt         # Python dependencies
```

## Features

- **Azure Document Intelligence**: Analyze tax documents (Form 1040, etc.)
- **ChatGPT Verification**: Validate document types and content
- **REST API**: Clean, documented endpoints
- **Web UI**: Simple interface for testing
- **Layered Architecture**: Clean separation of concerns

## API Endpoints

- `GET /` - Web UI
- `POST /tax/analyze` - Analyze tax documents
- `GET /tax/models` - List available Azure models
- `POST /files/upload` - Upload files

## Running the Backend

```bash
cd backend
pip install -r requirements.txt
python -m app.main
```

The server will start at `http://localhost:8000`

- **Web UI**: `http://localhost:8000/`
- **API Docs**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Environment Variables

Create a `.env` file in the backend directory:

```env
AZ_ENDPOINT=your_azure_endpoint
AZ_KEY=your_azure_key
OPENAI_API_KEY=your_openai_key
```

## Development

The backend uses a clean layered architecture:

- **Routes**: Handle HTTP requests/responses
- **Services**: Business logic and external API calls
- **Models**: Data validation and serialization
- **Utils**: Configuration and utilities 