from fastapi import APIRouter, File, UploadFile, HTTPException
from ..services.azure_service import AzureDocumentIntelligenceService
from ..services.chatgpt_service import ChatGPTService
from ..services.file_service import FileService
from ..models.responses import AnalysisResponse, ModelsResponse

router = APIRouter(prefix="/tax", tags=["tax"])

# Initialize services
azure_service = AzureDocumentIntelligenceService()
chatgpt_service = ChatGPTService()
file_service = FileService()

@router.post('/analyze', response_model=AnalysisResponse)
async def analyze_tax_document(file: UploadFile = File(...)):
    """
    Analyze Tax Document with Azure Document Intelligence and verify with ChatGPT
    
    Upload a PDF tax document for analysis using Azure Document Intelligence
    and ChatGPT verification.
    
    - **file**: PDF tax document to analyze (Form 1040, etc.) (required)
    
    Returns:
    - **success**: Whether the operation was successful
    - **message**: Status message
    - **validation**: ChatGPT verification results
    - **analysis**: Full Azure Document Intelligence analysis
    """
    try:
        # Validate file type
        file_service.validate_pdf_file(file)
        
        # Read file content
        pdf_content = file_service.read_file_content(file)
        
        # Analyze with Azure
        analysis_result = azure_service.analyze_tax_document(pdf_content)
        
        # Extract content for ChatGPT verification
        content = azure_service.extract_content(analysis_result)
        
        # Verify with ChatGPT
        validation_result = chatgpt_service.verify_tax_document(content)
        
        return AnalysisResponse(
            success=True,
            message='Document analysis and verification completed successfully',
            validation=validation_result,
            analysis=analysis_result
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@router.get('/models', response_model=ModelsResponse)
async def list_models():
    """
    List Available Azure Document Intelligence Models
    
    Get a list of all available models in your Azure Document Intelligence service.
    
    Returns:
    - **success**: Whether the operation was successful
    - **models**: Array of available models with details
    """
    try:
        models = azure_service.list_models()
        
        return ModelsResponse(
            success=True,
            models=models
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}") 