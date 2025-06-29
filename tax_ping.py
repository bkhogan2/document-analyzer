#!/usr/bin/env python3
"""
Simple script to test Azure Document Intelligence pre-built US-Tax model.
Usage: python tax_ping.py <pdf_file>
"""

import os
import sys
import json
import base64
import requests
import time
from dotenv import load_dotenv


def main():
    # Load environment variables from .env file
    load_dotenv()
    
    # Check environment variables
    endpoint = os.getenv("AZ_ENDPOINT")
    key = os.getenv("AZ_KEY")
    
    if not endpoint or not key:
        sys.exit("AZ_ENDPOINT or AZ_KEY env vars missing from .env file")
    
    # Check command line arguments
    if len(sys.argv) != 2:
        sys.exit("usage: tax_ping.py <pdf>")
    
    file_path = sys.argv[1]
    
    # Check if file exists
    if not os.path.exists(file_path):
        sys.exit(f"File not found: {file_path}")
    
    try:
        # Read and encode the PDF file
        with open(file_path, "rb") as f:
            pdf_content = f.read()
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
        
        print("Submitting 1040 form for analysis...")
        
        # Make the POST request to start analysis
        response = requests.post(analyze_url, headers=headers, json=request_body)
        
        if response.status_code == 202:
            # Get the operation location from headers
            operation_location = response.headers.get('Operation-Location')
            if not operation_location:
                sys.exit("No Operation-Location header received")
            
            print("Analysis in progress, polling for results...")
            
            # Poll for results
            while True:
                poll_response = requests.get(operation_location, headers={"Ocp-Apim-Subscription-Key": key})
                
                if poll_response.status_code == 200:
                    result = poll_response.json()
                    if result.get('status') == 'succeeded':
                        print("Analysis completed successfully!")
                        print(json.dumps(result, indent=2))
                        break
                    elif result.get('status') == 'failed':
                        sys.exit(f"Analysis failed: {result.get('error', {}).get('message', 'Unknown error')}")
                    else:
                        # Still processing, wait and try again
                        time.sleep(2)
                else:
                    sys.exit(f"Error polling results: {poll_response.status_code}")
        else:
            print(f"Error submitting document: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        sys.exit(f"Connection error: {e}")
    except Exception as e:
        sys.exit(f"Unexpected error: {e}")


if __name__ == "__main__":
    main() 