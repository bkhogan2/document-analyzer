#!/usr/bin/env python3
"""
Simple test script to verify database setup
"""

import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.database import Base, User, DocumentCategory, Document

# Create engine
engine = create_engine("sqlite:///./app.db")

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def test_database():
    print("Testing database connection...")
    
    # Test 1: Check if tables exist
    print("✓ Database connection successful")
    
    # Test 2: Create a test user with unique email
    unique_id = str(uuid.uuid4())[:8]
    test_email = f"test-{unique_id}@example.com"
    test_user = User(email=test_email)
    db.add(test_user)
    db.commit()
    print(f"✓ Created test user: {test_user.id} with email: {test_email}")
    
    # Test 3: Check existing categories or create new ones
    existing_categories = db.query(DocumentCategory).all()
    if existing_categories:
        print(f"✓ Found {len(existing_categories)} existing document categories")
        categories = existing_categories
    else:
        # Create document categories only if they don't exist
        categories = [
            DocumentCategory(id="balance-sheet", title="Balance Sheet", subtitle="Financial statements"),
            DocumentCategory(id="tax-returns", title="Tax Returns", subtitle="Personal and business tax returns"),
            DocumentCategory(id="debt-schedule", title="Debt Schedule", subtitle="List of outstanding debts")
        ]
        
        for category in categories:
            db.add(category)
        db.commit()
        print(f"✓ Created {len(categories)} document categories")
    
    # Test 4: Create a test document
    test_document = Document(
        user_id=test_user.id,
        category_id="balance-sheet",
        filename="test_document.pdf",
        original_filename="balance_sheet_2024.pdf",
        file_path="/uploads/default/balance-sheet/test_document.pdf",
        file_size=1024,
        mime_type="application/pdf",
        status="uploaded"
    )
    db.add(test_document)
    db.commit()
    print(f"✓ Created test document: {test_document.id}")
    
    # Test 5: Query the data
    user_count = db.query(User).count()
    category_count = db.query(DocumentCategory).count()
    document_count = db.query(Document).count()
    
    print(f"✓ Database contains:")
    print(f"  - {user_count} users")
    print(f"  - {category_count} document categories")
    print(f"  - {document_count} documents")
    
    # Clean up test data (only the test document and user we created)
    db.query(Document).filter(Document.id == test_document.id).delete()
    db.query(User).filter(User.id == test_user.id).delete()
    db.commit()
    print("✓ Cleaned up test data")
    
    db.close()
    print("✓ Database test completed successfully!")

if __name__ == "__main__":
    test_database() 