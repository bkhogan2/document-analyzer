#!/usr/bin/env python3
"""
Seed script for SBA document categories
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.database import DocumentCategory

# Create engine
engine = create_engine("sqlite:///./app.db")

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def seed_categories():
    print("Seeding SBA document categories...")
    
    # SBA document categories (excluding bank statements, articles of incorporation, and bylaws)
    categories = [
        {
            "id": "balance-sheet",
            "title": "Business Balance Sheet",
            "subtitle": "(Interim/YE)",
            "required": True
        },
        {
            "id": "debt-schedule", 
            "title": "Business Debt Schedule",
            "subtitle": "",
            "required": True
        },
        {
            "id": "profit-loss",
            "title": "Business Profit & Loss", 
            "subtitle": "(Interim/YE)",
            "required": True
        },
        {
            "id": "business-tax-returns",
            "title": "Business Tax Returns",
            "subtitle": "(BTR)",
            "required": True
        },
        {
            "id": "personal-tax-returns",
            "title": "Personal Tax Returns",
            "subtitle": "(PTR)",
            "required": True
        },
        {
            "id": "project-costs",
            "title": "Project Costs Documents",
            "subtitle": "Working Capital/Start-Up Costs",
            "required": False
        },
        {
            "id": "personal-financial-statement",
            "title": "SBA Form 413 Personal Financial Statement (PFS)",
            "subtitle": "",
            "required": True
        }
    ]
    
    # Clear existing categories
    db.query(DocumentCategory).delete()
    db.commit()
    print("✓ Cleared existing categories")
    
    # Add new categories
    for category_data in categories:
        category = DocumentCategory(**category_data)
        db.add(category)
        print(f"✓ Added: {category.title}")
    
    db.commit()
    print(f"✓ Successfully seeded {len(categories)} document categories")
    
    # Verify
    category_count = db.query(DocumentCategory).count()
    print(f"✓ Database now contains {category_count} categories")
    
    # Show all categories
    print("\nCategories in database:")
    for category in db.query(DocumentCategory).all():
        required_text = " (Required)" if category.required else ""
        print(f"  - {category.title}{required_text}")
    
    db.close()
    print("\n✓ Category seeding completed!")

if __name__ == "__main__":
    seed_categories() 