import base64
import requests
import time
from typing import Dict, Any
from ..utils.config import Config

class AzureDocumentIntelligenceService:
    """Service for Azure Document Intelligence interactions"""
    
    def __init__(self):
        Config.validate_azure_credentials()
        self.endpoint = Config.AZ_ENDPOINT
        self.key = Config.AZ_KEY
    
    def analyze_tax_document(self, pdf_content: bytes) -> Dict[str, Any]:
        """
        Analyze a PDF tax document using Azure Document Intelligence
        """
        try:
            # Encode the PDF content
            base64_content = base64.b64encode(pdf_content).decode('utf-8')
            
            # Construct the analyze endpoint URL
            analyze_url = f"{self.endpoint}/documentintelligence/documentModels/prebuilt-tax.us.1040:analyze?_overload=analyzeDocument&api-version=2024-11-30"
            
            # Set up headers
            headers = {
                "Ocp-Apim-Subscription-Key": self.key,
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
                    raise ValueError("No Operation-Location header received from Azure")
                
                # Poll for results
                return self._poll_for_results(operation_location)
            else:
                raise ValueError(f"Error submitting document: {response.status_code}")
                
        except Exception as e:
            raise ValueError(f"Azure analysis failed: {str(e)}")
    
    def _poll_for_results(self, operation_location: str) -> Dict[str, Any]:
        """
        Poll Azure for analysis results
        """
        max_attempts = 30  # 60 seconds max wait time
        attempts = 0
        
        while attempts < max_attempts:
            poll_response = requests.get(operation_location, headers={"Ocp-Apim-Subscription-Key": self.key})
            
            if poll_response.status_code == 200:
                result = poll_response.json()
                if result.get('status') == 'succeeded':
                    return result
                elif result.get('status') == 'failed':
                    error_msg = result.get('error', {}).get('message', 'Unknown error')
                    raise ValueError(f"Analysis failed: {error_msg}")
                else:
                    # Still processing, wait and try again
                    time.sleep(2)
                    attempts += 1
            else:
                raise ValueError(f"Error polling results: {poll_response.status_code}")
        
        raise ValueError("Analysis timed out after 60 seconds")
    
    def list_models(self) -> list:
        """
        Get list of available Azure Document Intelligence models
        """
        try:
            # Construct the list models endpoint URL
            list_url = f"{self.endpoint}/documentintelligence/documentModels?api-version=2024-11-30"
            
            # Set up headers
            headers = {
                "Ocp-Apim-Subscription-Key": self.key
            }
            
            # Make the GET request
            response = requests.get(list_url, headers=headers)
            
            if response.status_code == 200:
                models_data = response.json()
                return models_data.get('value', [])
            else:
                raise ValueError(f"Error fetching models: {response.status_code}")
                
        except Exception as e:
            raise ValueError(f"Failed to list models: {str(e)}")
    
    def extract_content(self, analysis_result: Dict[str, Any]) -> str:
        """
        Extract text content from Azure analysis result
        """
        content = ""
        if 'analyzeResult' in analysis_result and 'content' in analysis_result['analyzeResult']:
            content = analysis_result['analyzeResult']['content']
        return content 