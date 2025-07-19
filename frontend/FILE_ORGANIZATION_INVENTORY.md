# 📁 File Organization Inventory

## 🏗️ Current Structure Overview

```
src/
├── components/          # UI Components (23 files)
│   ├── form/           # Form-related components (4 files)
│   └── [21 other components]
├── pages/              # Page components (6 files)
├── stores/             # State management (2 files)
├── services/           # API services (2 files)
├── data/               # Static data/config (3 files)
├── utils/              # Utility functions (5 files)
├── types/              # TypeScript types (2 files)
├── constants/          # Constants (1 file)
└── assets/             # Static assets
```

## 🔍 Detailed Component Analysis

### 📄 Pages (6 files)
**Purpose:** Top-level route components that compose other components

| File | Size | Purpose | Dependencies |
|------|------|---------|--------------|
| `RHFApplicationWizard.tsx` | 12KB | Main application wizard | WelcomeStep, DynamicStep, DocumentCollectionStep |
| `ApplicationHomePage.tsx` | 7.7KB | Application dashboard | DocumentStore, ApplicationStore |
| `DocumentLibraryPage.tsx` | 7.9KB | Document overview | DocumentStore |
| `DocumentCollectionPage.tsx` | 4.8KB | Document upload interface | DocumentStore, DocumentGrid |
| `DocumentDetailPage.tsx` | 7.0KB | Category-specific uploads | DocumentStore, DragAndDropArea |
| `ApplicationsPage.tsx` | 6.9KB | Application list | ApplicationStore |

### 🧩 Components (23 files)
**Purpose:** Reusable UI components

#### Core UI Components (19 files)
| File | Size | Purpose | Used By |
|------|------|---------|----------|
| `WelcomeStep.tsx` | 5.5KB | Welcome form step | RHFApplicationWizard |
| `DocumentCollectionStep.tsx` | 4.0KB | Document upload step | RHFApplicationWizard |
| `DynamicSidebar.tsx` | 5.8KB | Navigation sidebar | App.tsx |
| `Header.tsx` | 1.1KB | Top navigation | App.tsx |
| `ApplicationLayout.tsx` | 2.2KB | Application layout wrapper | App.tsx |
| `Stepper.tsx` | 2.5KB | Progress stepper | ApplicationLayout |
| `Breadcrumbs.tsx` | 3.3KB | Navigation breadcrumbs | Multiple pages |
| `PageHeader.tsx` | 573B | Page title/description | Multiple components |
| `Button.tsx` | 1.5KB | Reusable button | Multiple components |
| `DocumentCard.tsx` | 5.2KB | Document display card | DocumentGrid |
| `DocumentGrid.tsx` | 2.3KB | Document grid layout | DocumentCollectionPage |
| `DragAndDropArea.tsx` | 2.5KB | File upload area | DocumentDetailPage |
| `FileList.tsx` | 2.4KB | File list display | DocumentCollectionStep |
| `FooterButtons.tsx` | 742B | Action buttons | DocumentCollectionPage |
| `ShowMoreButton.tsx` | 612B | Expand/collapse | DocumentCollectionPage |
| `FooterMessage.tsx` | 405B | Status messages | DocumentCollectionPage |
| `StatusIcon.tsx` | 391B | Status indicators | DocumentCard |
| `NotificationProvider.tsx` | 2.2KB | Toast notifications | App.tsx |
| `NotFound.tsx` | 1.2KB | 404 page | App.tsx |
| `BackButton.tsx` | 885B | Navigation back button | Header |

#### Form Components (4 files)
| File | Size | Purpose | Used By |
|------|------|---------|----------|
| `DynamicStep.tsx` | 4.1KB | Dynamic form step | RHFApplicationWizard |
| `FormBuilder.tsx` | 1.5KB | Form field builder | DynamicStep |
| `FormField.tsx` | 4.8KB | Individual form fields | FormBuilder |
| `index.ts` | 292B | Form exports | DynamicStep |

### 🗄️ State Management (2 files)
**Purpose:** Global state management with Zustand

| File | Size | Purpose | Dependencies |
|------|------|---------|--------------|
| `applicationStore.ts` | 11KB | Application state | Zustand, React Router |
| `documentStore.ts` | 7.1KB | Document state | Zustand, DocumentService |

### 🔌 Services (2 files)
**Purpose:** API communication layer

| File | Size | Purpose | Dependencies |
|------|------|---------|--------------|
| `api.ts` | 1.7KB | Base API configuration | Axios |
| `documentService.ts` | 3.8KB | Document API operations | api.ts |

### 📊 Data & Configuration (3 files)
**Purpose:** Static data and form configurations

| File | Size | Purpose | Used By |
|------|------|---------|----------|
| `formConfigs.ts` | 13KB | Form field configurations | DynamicStep |
| `documentCategories.ts` | 2.7KB | Document category definitions | DocumentStore |
| `forms/formConfigs.ts` | 3.8KB | Alternative form configs | (Unused?) |

### 🛠️ Utilities (5 files)
**Purpose:** Helper functions and utilities

| File | Size | Purpose | Used By |
|------|------|---------|----------|
| `statusHelpers.tsx` | 3.9KB | Status styling helpers | DocumentCard |
| `statusUtils.ts` | 1.6KB | Status utility functions | DocumentCollectionPage |
| `status/statusData.ts` | 3.8KB | Status data and styling | statusHelpers |
| `fileUtils.ts` | 1.1KB | File handling utilities | DocumentStore |
| `formatCurrency.ts` | 218B | Currency formatting | (Unused?) |

### 📝 Types (2 files)
**Purpose:** TypeScript type definitions

| File | Size | Purpose | Used By |
|------|------|---------|----------|
| `document.ts` | 401B | Document types | DocumentStore |
| `api.ts` | 719B | API response types | Services |

## 🔗 Component Relationships

### 🎯 High-Level Architecture
```
App.tsx
├── Layout (DynamicSidebar + Header)
│   ├── ApplicationsPage
│   └── DocumentLibraryPage
└── ApplicationLayoutWrapper
    ├── ApplicationHomePage
    ├── DocumentCollectionPage
    ├── DocumentDetailPage
    └── RHFApplicationWizard
        ├── WelcomeStep
        ├── DynamicStep
        └── DocumentCollectionStep
```

### 🔄 Data Flow
```
User Action → Component → Store → Service → API
     ↑                                    ↓
     ← Component ← Store ← Service ← API Response
```

### 📦 Store Dependencies
```
applicationStore.ts
├── Uses: React Router, Zustand
└── Used by: All pages, ApplicationLayout, Stepper

documentStore.ts
├── Uses: Zustand, documentService, documentCategories
└── Used by: Document pages, DocumentCollectionStep
```

## 🚨 Issues Identified

### 1. **Duplicate Form Configurations**
- `data/formConfigs.ts` (13KB) - Main form configs
- `data/forms/formConfigs.ts` (3.8KB) - Alternative configs (unused?)

### 2. **Scattered Status Logic**
- `utils/statusHelpers.tsx` (3.9KB)
- `utils/statusUtils.ts` (1.6KB)
- `utils/status/statusData.ts` (3.8KB)
- Similar functionality spread across 3 files

### 3. **Mixed Component Responsibilities**
- `WelcomeStep.tsx` - Hardcoded form (should use DynamicStep)
- `RHFApplicationWizard.tsx` - Complex conditional rendering
- `DocumentCollectionStep.tsx` - Duplicates DocumentCollectionPage logic

### 4. **Inconsistent File Organization**
- Form components in `components/form/` but `WelcomeStep` in root
- Status utilities split across multiple files
- Some components could be grouped by feature

### 5. **Unused Files**
- `data/forms/formConfigs.ts` - Appears unused
- `utils/formatCurrency.ts` - No imports found

## 🎯 Recommended Reorganization

### **Option A: Feature-Based Organization**
```
src/
├── features/
│   ├── applications/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/
│   │   └── types/
│   ├── documents/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/
│   │   └── types/
│   └── forms/
│       ├── components/
│       ├── configs/
│       └── types/
├── shared/
│   ├── components/
│   ├── utils/
│   ├── services/
│   └── types/
└── app/
    ├── App.tsx
    ├── main.tsx
    └── routes.tsx
```

### **Option B: Layer-Based Organization**
```
src/
├── components/          # UI Components
│   ├── common/         # Shared components
│   ├── forms/          # Form components
│   └── documents/      # Document components
├── pages/              # Route components
├── stores/             # State management
├── services/           # API layer
├── utils/              # Utilities
├── types/              # Type definitions
└── config/             # Static configurations
```

## 🚀 Next Steps

1. **Consolidate duplicate files** (formConfigs, status utilities)
2. **Group related components** by feature or layer
3. **Remove unused files** (formatCurrency, duplicate formConfigs)
4. **Standardize component patterns** (WelcomeStep → DynamicStep)
5. **Create shared utilities** for common patterns

Which reorganization approach would you prefer to start with? 