from fastapi import APIRouter, File, UploadFile, HTTPException
from ..services.file_service import FileService
from ..models.responses import UploadResponse

router = APIRouter(prefix="/files", tags=["files"])

# Initialize services
file_service = FileService()

@router.post('/upload', response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    """
    File Upload API
    
    Upload a file to the server.
    
    - **file**: The file to upload (required)
    
    Returns:
    - **message**: Success message
    - **filename**: Name of uploaded file
    """
    try:
        filename = file_service.save_uploaded_file(file)
        
        return UploadResponse(
            message="File uploaded",
            filename=filename
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}") 