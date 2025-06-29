from flask import Flask, request, jsonify
from flasgger import Swagger
from werkzeug.utils import secure_filename
import os
import base64
import requests
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
swagger = Swagger(app)

@app.route('/analyze-tax', methods=['POST'])
def analyze_tax_document():
    """
    Analyze Tax Document with Azure Document Intelligence
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
        description: Document analysis completed successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
            message:
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
                        return jsonify({
                            'success': True,
                            'message': 'Document analysis completed successfully',
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
