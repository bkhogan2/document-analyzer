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
    
    def validate_file_type(self, file: UploadFile) -> None:
        """
        Validate that the uploaded file is a supported type
        """
        if not file.filename:
            raise ValueError("No filename provided")
        
        allowed_extensions = ['.pdf', '.xlsx', '.xls', '.csv', '.doc', '.docx']
        file_extension = os.path.splitext(file.filename.lower())[1]
        
        if file_extension not in allowed_extensions:
            raise ValueError(f"Unsupported file type: {file_extension}. Allowed types: {', '.join(allowed_extensions)}")
    
    def validate_file_size(self, file: UploadFile, max_size_mb: int = 10) -> None:
        """
        Validate that the uploaded file is within size limits
        """
        max_size_bytes = max_size_mb * 1024 * 1024
        
        # Read file content to get size
        content = file.file.read()
        file_size = len(content)
        
        # Reset file pointer for later use
        file.file.seek(0)
        
        if file_size > max_size_bytes:
            raise ValueError(f"File size ({file_size} bytes) exceeds maximum allowed size ({max_size_bytes} bytes)")
    
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