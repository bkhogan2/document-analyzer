from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from ..services.file_service import FileService
from ..services.document_service import DocumentService
from ..models.responses import UploadResponse

router = APIRouter(prefix="/files", tags=["files"])

# Initialize services
file_service = FileService()
document_service = DocumentService()

@router.post('/upload', response_model=UploadResponse)
async def upload_file_auto_classify(
    file: UploadFile = File(...),
    user_id: str = Form(default="default")
):
    """
    Auto-classify File Upload API
    
    Upload a file for automatic classification and analysis.
    
    - **file**: The file to upload (required)
    - **user_id**: The user ID (optional, defaults to "default")
    
    Returns:
    - **message**: Success message
    - **filename**: Name of uploaded file
    """
    try:
        # Basic file validation
        file_service.validate_file_type(file)
        file_service.validate_file_size(file)
        
        # For now, hardcode category as "balance-sheet"
        # TODO: Replace with actual classification logic
        category_id = "balance-sheet"
        
        # Store file and metadata in database
        document = document_service.create_document(
            user_id=user_id,
            category_id=category_id,
            file=file
        )
        
        return UploadResponse(
            message="File uploaded and classified",
            filename=document.filename
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@router.post('/upload/{category_id}', response_model=UploadResponse)
async def upload_file_with_category(
    category_id: str,
    file: UploadFile = File(...),
    user_id: str = Form(default="default")
):
    """
    Pre-classified File Upload API
    
    Upload a file to a specific category.
    
    - **category_id**: The document category ID (in URL path)
    - **file**: The file to upload (required)
    - **user_id**: The user ID (optional, defaults to "default")
    
    Returns:
    - **message**: Success message
    - **filename**: Name of uploaded file
    """
    try:
        # Validate category exists
        if not document_service.validate_category(category_id):
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid category_id: '{category_id}'. Category does not exist."
            )
        
        # Basic file validation
        file_service.validate_file_type(file)
        file_service.validate_file_size(file)
        
        # Store file and metadata in database
        document = document_service.create_document(
            user_id=user_id,
            category_id=category_id,
            file=file
        )
        
        return UploadResponse(
            message="File uploaded to specified category",
            filename=document.filename
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}") 