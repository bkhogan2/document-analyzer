import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Application configuration"""
    
    # Azure Document Intelligence
    AZ_ENDPOINT = os.getenv("AZ_ENDPOINT")
    AZ_KEY = os.getenv("AZ_KEY")
    
    # OpenAI
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    
    # File upload
    UPLOAD_FOLDER = './uploads'
    
    @classmethod
    def validate_azure_credentials(cls):
        """Validate Azure credentials are configured"""
        if not cls.AZ_ENDPOINT or not cls.AZ_KEY:
            raise ValueError("Azure Document Intelligence credentials not configured")
    
    @classmethod
    def validate_openai_credentials(cls):
        """Validate OpenAI credentials are configured"""
        if not cls.OPENAI_API_KEY:
            raise ValueError("OpenAI API key not configured")
    
    @classmethod
    def setup_upload_folder(cls):
        """Create upload folder if it doesn't exist"""
        os.makedirs(cls.UPLOAD_FOLDER, exist_ok=True) 