from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import os
import base64
import requests
import time
from dotenv import load_dotenv
from openai import OpenAI
from typing import Optional

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Document Analyzer API",
    description="Azure Document Intelligence + ChatGPT verification for tax documents",
    version="1.0.0"
)

# Initialize OpenAI client
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Setup upload folder
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
async def index():
    """API root endpoint"""
    return {"message": "Document Analyzer API", "docs": "/docs"}


def verify_tax_document_with_chatgpt(content: str) -> str:
    """
    Use ChatGPT to verify if the extracted content represents a valid Form 1040
    """
    try:
        prompt = f"""
        Analyze the following extracted content from a tax document and determine if it's a valid Form 1040.
        
        IMPORTANT: Only Form 1040 documents should be considered valid. All other tax forms (W-2, 1099, etc.) should be marked as invalid.
        
        Please provide:
        1. Is this a valid Form 1040? (Yes/No)
        2. What type of document is this? (e.g., Form 1040, W-2, 1099, etc.)
        3. Confidence level (1-10, where 10 is highest)
        4. Brief explanation of your assessment
        5. Any notable issues or missing information
        
        Extracted content:
        {content[:2000]}  # Limit to first 2000 chars to avoid token limits
        
        Respond in this exact format:
        VALID: Yes/No
        FORM_TYPE: [form type]
        CONFIDENCE: [1-10]
        EXPLANATION: [your explanation]
        ISSUES: [any issues found]
        """
        
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a tax document verification expert. Your job is to determine if a document is a valid Form 1040. Only Form 1040 documents should be marked as valid. All other tax forms should be marked as invalid."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=500
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        return f"Error during ChatGPT verification: {str(e)}"


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    File Upload API
    
    Upload a file to the server.
    
    - **file**: The file to upload (required)
    
    Returns:
    - **message**: Success message
    - **filename**: Name of uploaded file
    """
    if file.filename == '':
        raise HTTPException(status_code=400, detail="No selected file")
    
    # Save the file
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(filepath, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    return {"message": "File uploaded", "filename": file.filename}


@app.post("/analyze-tax")
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
    # Check environment variables
    endpoint = os.getenv("AZ_ENDPOINT")
    key = os.getenv("AZ_KEY")
    
    if not endpoint or not key:
        raise HTTPException(
            status_code=500, 
            detail="Azure Document Intelligence credentials not configured"
        )

    # Check file type
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=400, 
            detail="Only PDF files are supported"
        )

    try:
        # Read and encode the PDF file
        pdf_content = await file.read()
        base64_content = base64.b64encode(pdf_content).decode('utf-8')
        
        # Construct the analyze endpoint URL
        analyze_url = f"{endpoint}/documentintelligence/documentModels/prebuilt-tax.us.1040:analyze?_overload=analyzeDocument&api-version=2024-11-30"
        
        # Set up headers
        headers = {
            "Ocp-Apim-Subscription-Key": key,
            "Content-Type": "application/json"
        }
        
        # Prepare the request body
        request_body = {
            "base64Source": base64_content
        }
        
        # Make the POST request to start analysis
        response = requests.post(analyze_url, headers=headers, json=request_body)
        
        if response.status_code == 202:
            # Get the operation location from headers
            operation_location = response.headers.get('Operation-Location')
            if not operation_location:
                raise HTTPException(
                    status_code=500, 
                    detail="No Operation-Location header received from Azure"
                )
            
            # Poll for results
            max_attempts = 30  # 60 seconds max wait time
            attempts = 0
            
            while attempts < max_attempts:
                poll_response = requests.get(operation_location, headers={"Ocp-Apim-Subscription-Key": key})
                
                if poll_response.status_code == 200:
                    result = poll_response.json()
                    if result.get('status') == 'succeeded':
                        # Extract content from Azure response
                        content = ""
                        if 'analyzeResult' in result and 'content' in result['analyzeResult']:
                            content = result['analyzeResult']['content']
                        
                        # Verify with ChatGPT
                        chatgpt_verification = verify_tax_document_with_chatgpt(content)
                        
                        # Parse ChatGPT response
                        validation_result = parse_chatgpt_response(chatgpt_verification)
                        
                        return {
                            'success': True,
                            'message': 'Document analysis and verification completed successfully',
                            'validation': validation_result,
                            'analysis': result
                        }
                    elif result.get('status') == 'failed':
                        raise HTTPException(
                            status_code=500,
                            detail=f"Analysis failed: {result.get('error', {}).get('message', 'Unknown error')}"
                        )
                    else:
                        # Still processing, wait and try again
                        time.sleep(2)
                        attempts += 1
                else:
                    raise HTTPException(
                        status_code=500,
                        detail=f"Error polling results: {poll_response.status_code}"
                    )
            
            raise HTTPException(
                status_code=500,
                detail="Analysis timed out after 60 seconds"
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Error submitting document: {response.status_code}",
                headers={"details": response.text}
            )
            
    except HTTPException:
        raise
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Connection error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )


def parse_chatgpt_response(response_text: str) -> dict:
    """
    Parse the structured response from ChatGPT into a dictionary
    """
    try:
        lines = response_text.split('\n')
        result = {
            'is_valid': False,
            'form_type': 'Unknown',
            'confidence': 0,
            'explanation': 'Unable to parse verification response',
            'issues': 'Unable to parse verification response'
        }
        
        for line in lines:
            line = line.strip()
            if line.startswith('VALID:'):
                result['is_valid'] = 'yes' in line.lower()
            elif line.startswith('FORM_TYPE:'):
                result['form_type'] = line.split(':', 1)[1].strip()
            elif line.startswith('CONFIDENCE:'):
                try:
                    confidence_text = line.split(':', 1)[1].strip()
                    result['confidence'] = int(confidence_text)
                except:
                    result['confidence'] = 0
            elif line.startswith('EXPLANATION:'):
                result['explanation'] = line.split(':', 1)[1].strip()
            elif line.startswith('ISSUES:'):
                result['issues'] = line.split(':', 1)[1].strip()
        
        return result
        
    except Exception as e:
        return {
            'is_valid': False,
            'form_type': 'Unknown',
            'confidence': 0,
            'explanation': f'Error parsing verification response: {str(e)}',
            'issues': 'Unable to parse verification response'
        }


@app.get("/models")
async def list_models():
    """
    List Available Azure Document Intelligence Models
    
    Get a list of all available models in your Azure Document Intelligence service.
    
    Returns:
    - **success**: Whether the operation was successful
    - **models**: Array of available models with details
    """
    # Check environment variables
    endpoint = os.getenv("AZ_ENDPOINT")
    key = os.getenv("AZ_KEY")
    
    if not endpoint or not key:
        raise HTTPException(
            status_code=500,
            detail="Azure Document Intelligence credentials not configured"
        )

    try:
        # Construct the list models endpoint URL
        list_url = f"{endpoint}/documentintelligence/documentModels?api-version=2024-11-30"
        
        # Set up headers
        headers = {
            "Ocp-Apim-Subscription-Key": key
        }
        
        # Make the GET request
        response = requests.get(list_url, headers=headers)
        
        if response.status_code == 200:
            models_data = response.json()
            models = models_data.get('value', [])
            
            return {
                'success': True,
                'models': models
            }
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Error fetching models: {response.status_code}",
                headers={"details": response.text}
            )
            
    except HTTPException:
        raise
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Connection error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 