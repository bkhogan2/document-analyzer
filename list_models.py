#!/usr/bin/env python3
"""
Simple script to list all available Azure Document Intelligence models.
Usage: python list_models.py
"""

import os
import sys
import json
import requests
from dotenv import load_dotenv


def main():
    # Load environment variables from .env file
    load_dotenv()
    
    # Check environment variables
    endpoint = os.getenv("AZ_ENDPOINT")
    key = os.getenv("AZ_KEY")
    
    if not endpoint or not key:
        sys.exit("AZ_ENDPOINT or AZ_KEY env vars missing from .env file")
    
    try:
        # Construct the list models endpoint URL
        list_url = f"{endpoint}/documentintelligence/documentModels?api-version=2024-11-30"
        
        # Set up headers
        headers = {
            "Ocp-Apim-Subscription-Key": key
        }
        
        print("Fetching available models...")
        
        # Make the GET request
        response = requests.get(list_url, headers=headers)
        
        if response.status_code == 200:
            models_data = response.json()
            models = models_data.get('value', [])
            
            print(f"Successfully connected to Azure Document Intelligence!")
            print(f"Found {len(models)} model(s):\n")
            
            for i, model in enumerate(models, 1):
                print(f"{i}. Model ID: {model.get('modelId', 'N/A')}")
                print(f"   Description: {model.get('description', 'No description')}")
                print(f"   API Version: {model.get('apiVersion', 'N/A')}")
                print(f"   Created: {model.get('createdDateTime', 'N/A')}")
                if model.get('expirationDateTime'):
                    print(f"   Expires: {model.get('expirationDateTime')}")
                print()
            
            # Check if prebuilt-us-tax is available
            tax_model = next((m for m in models if m.get('modelId') == 'prebuilt-us-tax'), None)
            if tax_model:
                print("prebuilt-us-tax model is available!")
            else:
                print("prebuilt-us-tax model not found in available models")
                print("Available prebuilt models:")
                prebuilt_models = [m for m in models if m.get('modelId', '').startswith('prebuilt-')]
                for model in prebuilt_models:
                    print(f"   - {model.get('modelId')}")
                
        else:
            print(f"Error fetching models: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        sys.exit(f"Connection error: {e}")
    except Exception as e:
        sys.exit(f"Unexpected error: {e}")


if __name__ == "__main__":
    main() 