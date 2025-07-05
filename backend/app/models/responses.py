from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime

class ValidationResult(BaseModel):
    is_valid: bool
    form_type: str
    confidence: int
    explanation: str
    issues: str

class AnalysisResponse(BaseModel):
    success: bool
    message: str
    validation: ValidationResult
    analysis: Dict[str, Any]

class ModelsResponse(BaseModel):
    success: bool
    models: list

class UploadResponse(BaseModel):
    message: str
    filename: str

class DocumentResponse(BaseModel):
    id: str
    user_id: str
    category_id: str
    filename: str
    original_filename: str
    file_path: str
    file_size: int
    mime_type: str
    status: str
    status_message: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None 