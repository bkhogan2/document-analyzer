from sqlalchemy import Column, String, DateTime, BigInteger, Text, Boolean, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=True)  # Optional for Phase 1
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DocumentCategory(Base):
    __tablename__ = "document_categories"
    
    id = Column(String, primary_key=True)  # 'balance-sheet', 'tax-returns', etc.
    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=True)
    required = Column(Boolean, default=False)

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    category_id = Column(String, ForeignKey("document_categories.id"), nullable=False)
    filename = Column(String, nullable=False)  # Stored filename
    original_filename = Column(String, nullable=False)  # Original upload filename
    file_path = Column(String, nullable=False)  # Path to actual file
    file_size = Column(BigInteger, nullable=True)
    mime_type = Column(String, nullable=True)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="uploaded")  # 'uploaded', 'processing', 'completed', 'failed'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", backref="documents")
    category = relationship("DocumentCategory", backref="documents")

class DocumentStatusHistory(Base):
    __tablename__ = "document_status_history"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, ForeignKey("documents.id"), nullable=False)
    status = Column(String, nullable=False)
    details = Column(JSON, nullable=True)  # Analysis results, error messages, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    document = relationship("Document", backref="status_history") 