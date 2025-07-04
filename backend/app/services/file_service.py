import os
from fastapi import UploadFile
from ..utils.config import Config

class FileService:
    """Service for file operations"""
    
    def __init__(self):
        Config.setup_upload_folder()
        self.upload_folder = Config.UPLOAD_FOLDER
    
    def save_uploaded_file(self, file: UploadFile) -> str:
        """
        Save an uploaded file and return the filename
        """
        if file.filename == '':
            raise ValueError("No selected file")
        
        filename = file.filename
        filepath = os.path.join(self.upload_folder, filename)
        
        # Save the file
        with open(filepath, "wb") as buffer:
            content = file.file.read()
            buffer.write(content)
        
        return filename
    
    def validate_pdf_file(self, file: UploadFile) -> None:
        """
        Validate that the uploaded file is a PDF
        """
        if not file.filename.lower().endswith('.pdf'):
            raise ValueError("Only PDF files are supported")
    
    def read_file_content(self, file: UploadFile) -> bytes:
        """
        Read the content of an uploaded file
        """
        return file.file.read() 