from openai import OpenAI
from ..utils.config import Config
from ..models.responses import ValidationResult
import re

class ChatGPTService:
    """Service for ChatGPT interactions"""
    
    def __init__(self):
        Config.validate_openai_credentials()
        self.client = OpenAI(api_key=Config.OPENAI_API_KEY)
    
    def verify_tax_document(self, content: str) -> ValidationResult:
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
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a tax document verification expert. Your job is to determine if a document is a valid Form 1040. Only Form 1040 documents should be marked as valid. All other tax forms should be marked as invalid."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=500
            )
            
            response_text = response.choices[0].message.content.strip()
            return self._parse_verification_response(response_text)
            
        except Exception as e:
            return ValidationResult(
                is_valid=False,
                form_type="Unknown",
                confidence=0,
                explanation=f"Error during ChatGPT verification: {str(e)}",
                issues="Unable to verify document due to service error"
            )
    
    def _parse_verification_response(self, response_text: str) -> ValidationResult:
        """
        Parse the structured response from ChatGPT into a ValidationResult
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
            
            return ValidationResult(**result)
            
        except Exception as e:
            return ValidationResult(
                is_valid=False,
                form_type="Unknown",
                confidence=0,
                explanation=f"Error parsing verification response: {str(e)}",
                issues="Unable to parse verification response"
            ) 