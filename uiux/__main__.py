from flask import Flask, request, jsonify
from flasgger import Swagger
from werkzeug.utils import secure_filename
import os
import base64
import requests
import time
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

app = Flask(__name__)
swagger = Swagger(app)

# Initialize OpenAI client
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def verify_tax_document_with_chatgpt(content):
    """
    Use ChatGPT to verify if the extracted content represents a valid Form 1040
    """
    try:
        prompt = f"""
        Analyze the following extracted content from a tax document and determine if it's a valid Form 1040.
        
        IMPORTANT: Only Form 1040 documents should be considered valid. All other tax forms (W-2, 1099, etc.) should be marked as invalid.
        
        Please provide:
        1. Is this a valid Form 1040? (Yes/No)
        3. Confidence level (1-10, where 10 is highest)
        4. Brief explanation of your assessment
        5. Any notable issues or missing information
        
        Extracted content:
        {content[:2000]}  # Limit to first 2000 chars to avoid token limits
        
        Respond in this exact format:
        VALID: Yes/No
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


@app.route('/analyze-tax', methods=['POST'])
def analyze_tax_document():
    """
    Analyze Tax Document with Azure Document Intelligence and verify with ChatGPT
    ---
    consumes:
      - multipart/form-data
    parameters:
      - name: file
        in: formData
        type: file
        required: true
        description: PDF tax document to analyze (Form 1040, etc.)
    responses:
      200:
        description: Document analysis and verification completed successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
            message:
              type: string
            validation:
              type: object
              properties:
                is_valid:
                  type: boolean
                confidence:
                  type: integer
                explanation:
                  type: string
                issues:
                  type: string
            analysis:
              type: object
              description: Full analysis results from Azure Document Intelligence
      400:
        description: Bad request - missing file or invalid file
      500:
        description: Server error during analysis
    """
    # Check environment variables
    endpoint = os.getenv("AZ_ENDPOINT")
    key = os.getenv("AZ_KEY")
    
    if not endpoint or not key:
        return jsonify({
            'success': False,
            'error': 'Azure Document Intelligence credentials not configured'
        }), 500

    # Check if file was uploaded
    if 'file' not in request.files:
        return jsonify({
            'success': False,
            'error': 'No file part in request'
        }), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({
            'success': False,
            'error': 'No selected file'
        }), 400

    # Check file type
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({
            'success': False,
            'error': 'Only PDF files are supported'
        }), 400

    try:
        # Read and encode the PDF file
        pdf_content = file.read()
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
                return jsonify({
                    'success': False,
                    'error': 'No Operation-Location header received from Azure'
                }), 500
            
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
                        
                        return jsonify({
                            'success': True,
                            'message': 'Document analysis and verification completed successfully',
                            'validation': validation_result,
                            'analysis': result
                        })
                    elif result.get('status') == 'failed':
                        return jsonify({
                            'success': False,
                            'error': f"Analysis failed: {result.get('error', {}).get('message', 'Unknown error')}"
                        }), 500
                    else:
                        # Still processing, wait and try again
                        time.sleep(2)
                        attempts += 1
                else:
                    return jsonify({
                        'success': False,
                        'error': f"Error polling results: {poll_response.status_code}"
                    }), 500
            
            return jsonify({
                'success': False,
                'error': 'Analysis timed out after 60 seconds'
            }), 500
        else:
            return jsonify({
                'success': False,
                'error': f"Error submitting document: {response.status_code}",
                'details': response.text
            }), 500
            
    except requests.exceptions.RequestException as e:
        return jsonify({
            'success': False,
            'error': f"Connection error: {str(e)}"
        }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f"Unexpected error: {str(e)}"
        }), 500


def parse_chatgpt_response(response_text):
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


@app.route('/models', methods=['GET'])
def list_models():
    """
    List Available Azure Document Intelligence Models
    ---
    responses:
      200:
        description: List of available models
        schema:
          type: object
          properties:
            success:
              type: boolean
            models:
              type: array
              items:
                type: object
                properties:
                  modelId:
                    type: string
                  description:
                    type: string
                  apiVersion:
                    type: string
      500:
        description: Server error
    """
    # Check environment variables
    endpoint = os.getenv("AZ_ENDPOINT")
    key = os.getenv("AZ_KEY")
    
    if not endpoint or not key:
        return jsonify({
            'success': False,
            'error': 'Azure Document Intelligence credentials not configured'
        }), 500

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
            
            return jsonify({
                'success': True,
                'models': models
            })
        else:
            return jsonify({
                'success': False,
                'error': f"Error fetching models: {response.status_code}",
                'details': response.text
            }), 500
            
    except requests.exceptions.RequestException as e:
        return jsonify({
            'success': False,
            'error': f"Connection error: {str(e)}"
        }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f"Unexpected error: {str(e)}"
        }), 500


if __name__ == '__main__':
    app.run(debug=True)
