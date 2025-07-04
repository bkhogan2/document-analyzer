from pydantic import BaseModel
from typing import Dict, Any, Optional

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