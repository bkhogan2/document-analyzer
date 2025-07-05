import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi import UploadFile
from ..models.database import DocumentCategory, Document, User, DocumentStatusHistory
from ..models.responses import DocumentResponse
from typing import Optional, List

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
    
    def get_user_documents(self, user_id: str) -> List[DocumentResponse]:
        """
        Get all documents for a user
        
        Args:
            user_id: The user ID to retrieve documents for
            
        Returns:
            List[DocumentResponse]: List of documents with metadata
        """
        session = self.get_session()
        try:
            documents = session.query(Document).filter(
                Document.user_id == user_id
            ).order_by(Document.created_at.desc()).all()
            
            return [
                DocumentResponse(
                    id=doc.id,
                    user_id=doc.user_id,
                    category_id=doc.category_id,
                    filename=doc.filename,
                    original_filename=doc.original_filename,
                    file_path=doc.file_path,
                    file_size=doc.file_size,
                    mime_type=doc.mime_type,
                    status=doc.status,
                    status_message=doc.status_message,
                    created_at=doc.created_at,
                    updated_at=doc.updated_at
                )
                for doc in documents
            ]
        finally:
            session.close()
    
    def delete_document(self, document_id: str) -> bool:
        """
        Delete a document and all associated metadata and file from disk.
        Args:
            document_id: The document ID to delete
        Returns:
            bool: True if deleted, False if not found
        """
        session = self.get_session()
        try:
            doc = session.query(Document).filter(Document.id == document_id).first()
            if not doc:
                return False
            # Delete status history
            session.query(DocumentStatusHistory).filter(DocumentStatusHistory.document_id == document_id).delete()
            # Delete file from disk
            if doc.file_path and os.path.exists(doc.file_path):
                os.remove(doc.file_path)
            # Delete document
            session.delete(doc)
            session.commit()
            return True
        finally:
            session.close() 