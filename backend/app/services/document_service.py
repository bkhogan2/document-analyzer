import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi import UploadFile
from ..models.database import DocumentCategory, Document, User
from typing import Optional

class DocumentService:
    """Service for document-related operations"""
    
    def __init__(self):
        self.engine = create_engine("sqlite:///./app.db")
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
    
    def get_session(self):
        """Get a database session"""
        return self.SessionLocal()
    
    def validate_category(self, category_id: str) -> bool:
        """
        Validate that a document category exists
        
        Args:
            category_id: The category ID to validate
            
        Returns:
            bool: True if category exists, False otherwise
        """
        session = self.get_session()
        try:
            category = session.query(DocumentCategory).filter(
                DocumentCategory.id == category_id
            ).first()
            return category is not None
        finally:
            session.close()
    
    def get_category(self, category_id: str) -> Optional[DocumentCategory]:
        """
        Get a document category by ID
        
        Args:
            category_id: The category ID to retrieve
            
        Returns:
            DocumentCategory or None: The category if found, None otherwise
        """
        session = self.get_session()
        try:
            return session.query(DocumentCategory).filter(
                DocumentCategory.id == category_id
            ).first()
        finally:
            session.close()
    
    def create_document(self, user_id: str, category_id: str, file: UploadFile) -> Document:
        """
        Create a document record in the database
        
        Args:
            user_id: The user ID
            category_id: The category ID
            file: The uploaded file
            
        Returns:
            Document: The created document record
        """
        session = self.get_session()
        try:
            # Create user if not exists
            user = session.query(User).filter(User.id == user_id).first()
            if not user:
                user = User(id=user_id)
                session.add(user)
                session.commit()
                session.refresh(user)
            
            # Generate unique filename
            import uuid
            import datetime
            timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            file_extension = os.path.splitext(file.filename)[1]
            unique_filename = f"{timestamp}_{uuid.uuid4().hex[:8]}{file_extension}"
            
            # Save file to organized directory structure
            user_upload_dir = os.path.join("uploads", user_id, category_id)
            os.makedirs(user_upload_dir, exist_ok=True)
            file_path = os.path.join(user_upload_dir, unique_filename)
            
            # Save file content
            with open(file_path, "wb") as buffer:
                content = file.file.read()
                buffer.write(content)
            
            # Create document record
            document = Document(
                user_id=user_id,
                category_id=category_id,
                filename=unique_filename,
                original_filename=file.filename,
                file_path=file_path,
                file_size=len(content),
                mime_type=file.content_type,
                status="uploaded"
            )
            
            session.add(document)
            session.commit()
            session.refresh(document)
            
            return document
            
        finally:
            session.close() 