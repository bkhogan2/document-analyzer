# File Storage Architecture

## Overview

This document outlines the file storage and metadata architecture for the SBA Loan Document Analyzer application.

## Storage Strategy

### Phase 1: Hybrid Approach
- **Local files**: `/uploads/{user_id}/{category_id}/{filename}`
- **Database**: Metadata, status, file paths
- **Future**: Easy migration to cloud storage (S3/Azure Blob)

### File Organization
```
/uploads/
  ├── default/                    # user_id (hardcoded for Phase 1)
  │   ├── balance-sheet/
  │   │   ├── 2024-01-15_14-30-22_balance_sheet.pdf
  │   │   └── 2024-01-15_14-35-10_tax_return.pdf
  │   ├── tax-returns/
  │   │   └── 2024-01-15_14-40-15_form_1040.pdf
  │   └── debt-schedule/
  │       └── 2024-01-15_14-45-30_debt_schedule.pdf
```

## Database Schema

### Core Tables

#### Users (for future auth)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Document Categories (SBA categories)
```sql
CREATE TABLE document_categories (
    id TEXT PRIMARY KEY,  -- 'balance-sheet', 'tax-returns', etc.
    title TEXT NOT NULL,
    subtitle TEXT,
    required BOOLEAN DEFAULT false
);
```

#### Documents (actual files)
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    category_id TEXT REFERENCES document_categories(id),
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL,  -- Path to actual file
    file_size BIGINT,
    mime_type TEXT,
    upload_date TIMESTAMP DEFAULT NOW(),
    status TEXT DEFAULT 'uploaded',  -- 'uploaded', 'processing', 'completed', 'failed'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Status History (audit trail)
```sql
CREATE TABLE document_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id),
    status TEXT NOT NULL,
    details JSONB,  -- Analysis results, error messages, etc.
    created_at TIMESTAMP DEFAULT NOW()
);
```

## API Design

### Enhanced Upload Endpoint
```python
@router.post('/upload')
async def upload_document(
    file: UploadFile,
    category_id: str,
    user_id: str = "default"  # Hardcode for Phase 1
):
    """
    Upload document with metadata storage
    """
    # 1. Save file to filesystem
    file_path = file_service.save_uploaded_file(file, user_id, category_id)
    
    # 2. Store metadata in database
    document = await document_service.create_document(
        user_id=user_id,
        category_id=category_id,
        filename=file.filename,
        file_path=file_path,
        file_size=file.size
    )
    
    # 3. Return document info
    return {
        "document_id": document.id,
        "status": "uploaded",
        "filename": document.original_filename
    }
```

### Status Endpoints
```python
@router.get('/documents/{document_id}')
async def get_document(document_id: UUID):
    """Get document metadata and current status"""

@router.get('/documents/category/{category_id}')
async def get_documents_by_category(category_id: str, user_id: str = "default"):
    """Get all documents for a category"""

@router.put('/documents/{document_id}/status')
async def update_document_status(document_id: UUID, status: str, details: dict = None):
    """Update document status (for testing/mock responses)"""
```

## Implementation Considerations

### File Naming Convention
- **Format**: `{date}_{time}_{original_filename}`
- **Example**: `2024-01-15_14-30-22_balance_sheet.pdf`
- **Purpose**: Avoid filename conflicts, maintain chronological order

### Metadata Storage
- **File paths** stored in database
- **Status tracking** with timestamps
- **Audit trail** for status changes
- **Category relationships** maintained

### Future-Proofing
- **Easy migration** to cloud storage (just change file paths)
- **User authentication** ready (user_id field exists)
- **Scalable** status tracking
- **Audit compliance** with status history

## Phase 1 Implementation Steps

1. **Database setup** (SQLite + SQLAlchemy)
2. **File service enhancement** (organized file storage)
3. **Document service** (CRUD operations)
4. **API endpoint updates** (metadata storage)
5. **Frontend integration** (connect to new endpoints)

## Migration Strategy

### Phase 1: SQLite
- **Development**: SQLite for simplicity
- **Testing**: Easy to reset and recreate

### Phase 2: PostgreSQL
- **Production**: PostgreSQL for scalability
- **Migration**: Simple schema migration

### Phase 3: Cloud Storage
- **File storage**: S3/Azure Blob
- **Database**: Update file_path references 