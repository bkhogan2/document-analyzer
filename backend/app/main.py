from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from .routes import tax_routes, file_routes

# Initialize FastAPI app
app = FastAPI(
    title="Document Analyzer API",
    description="Azure Document Intelligence + ChatGPT verification for tax documents",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup templates
templates = Jinja2Templates(directory="app/templates")

# Include routers
app.include_router(tax_routes.router)
app.include_router(file_routes.router)

@app.get('/', response_class=HTMLResponse)
async def index(request: Request):
    """Web UI for document analysis"""
    return templates.TemplateResponse("index.html", {"request": request})

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 