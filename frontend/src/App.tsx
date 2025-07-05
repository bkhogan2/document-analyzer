import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2,
  FileText,
  Banknote,
  Calculator,
  TrendingUp,
  Users,
  CreditCard,
} from 'lucide-react';
import { DocumentGrid } from './components/DocumentGrid';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FooterButtons } from './components/FooterButtons';
import { ShowMoreButton } from './components/ShowMoreButton';
import { PageHeader } from './components/PageHeader';
import { FooterMessage } from './components/FooterMessage';
import { getStatusStyling, getStatusTooltip } from './utils/statusUtils';
import { createUploadedFile } from './utils/fileUtils';
import type { DocumentStatus, UploadedFile, DocumentCategory } from './types/document';

const sbaDocumentCategories: DocumentCategory[] = [
  { 
    id: 'balance-sheet', 
    title: 'Business Balance Sheet', 
    subtitle: '(Interim/YE)', 
    icon: Calculator, 
    selected: false,
    uploadedFiles: [],
    status: 'none'
  },
  { 
    id: 'debt-schedule', 
    title: 'Business Debt Schedule', 
    subtitle: '', 
    icon: CreditCard, 
    selected: false,
    uploadedFiles: [],
    status: 'warning'
  },
  { 
    id: 'profit-loss', 
    title: 'Business Profit & Loss', 
    subtitle: '(Interim/YE)', 
    icon: TrendingUp, 
    selected: false,
    uploadedFiles: [],
    status: 'approved'
  },
  { 
    id: 'business-tax-returns', 
    title: 'Business Tax Returns', 
    subtitle: '(BTR)', 
    icon: FileText, 
    selected: false,
    uploadedFiles: [],
    status: 'none'
  },
  { 
    id: 'personal-tax-returns', 
    title: 'Personal Tax Returns', 
    subtitle: '(PTR)', 
    icon: FileText, 
    selected: false,
    uploadedFiles: [],
    status: 'none'
  },
  { 
    id: 'project-costs', 
    title: 'Project Costs Documents', 
    subtitle: 'Working Capital/Start-Up Costs', 
    icon: Building2, 
    selected: false,
    uploadedFiles: [],
    status: 'none'
  },
  { 
    id: 'personal-financial-statement', 
    title: 'SBA Form 413 Personal', 
    subtitle: 'Financial Statement (PFS)', 
    icon: Users, 
    selected: false,
    uploadedFiles: [],
    status: 'none'
  },
  { 
    id: 'bank-statements', 
    title: 'Bank Statements', 
    subtitle: '(3 months)', 
    icon: Banknote, 
    selected: false,
    uploadedFiles: [],
    status: 'none'
  },
  { 
    id: 'articles-incorporation', 
    title: 'Articles of Incorporation', 
    subtitle: 'or Organization', 
    icon: FileText, 
    selected: false,
    uploadedFiles: [],
    status: 'none'
  },
  { 
    id: 'operating-agreement', 
    title: 'Operating Agreement', 
    subtitle: 'or Bylaws', 
    icon: FileText, 
    selected: false,
    uploadedFiles: [],
    status: 'none'
  }
];

function App() {
  const [categories, setCategories] = useState(sbaDocumentCategories);
  const [showMore, setShowMore] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredStatusIcon, setHoveredStatusIcon] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Global drag detection
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types.includes('Files')) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (!e.relatedTarget) {
        setIsDragging(false);
        setDragOver(null);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      setDragOver(null);
    };

    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('drop', handleDrop);
    };
  }, []);

  const toggleItem = (id: string) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === id 
          ? { ...category, selected: !category.selected }
          : category
      )
    );
  };

  const cycleStatus = (categoryId: string) => {
    setCategories(prev => 
      prev.map(category => {
        if (category.id === categoryId) {
          const statusCycle: DocumentStatus[] = ['none', 'approved', 'warning', 'error'];
          const currentIndex = statusCycle.indexOf(category.status);
          const nextIndex = (currentIndex + 1) % statusCycle.length;
          return { ...category, status: statusCycle[nextIndex] };
        }
        return category;
      })
    );
  };

  const handleFileUpload = (categoryId: string, files: FileList | null) => {
    if (files && files.length > 0) {
      const newFiles: UploadedFile[] = Array.from(files).map(file => createUploadedFile(file));

      setCategories(prev => 
        prev.map(category => 
          category.id === categoryId 
            ? { 
                ...category, 
                selected: true,
                uploadedFiles: [...category.uploadedFiles, ...newFiles]
              }
            : category
        )
      );
    }
  };

  const removeFile = (categoryId: string, fileName: string) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? { 
              ...category, 
              uploadedFiles: category.uploadedFiles.filter(file => file.name !== fileName)
            }
          : category
      )
    );
  };

  const handleDragOver = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    if (isDragging) {
      setDragOver(categoryId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    if (dragOver === categoryId) {
      setDragOver(null);
    }
  };

  const handleDrop = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    setDragOver(null);
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileUpload(categoryId, files);
  };

  const openFileDialog = (categoryId: string) => {
    fileInputRefs.current[categoryId]?.click();
  };

  const visibleItems = showMore ? categories : categories.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Content */}
        <div className="flex-1 px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <PageHeader />

            {/* Document Categories Grid */}
            <DocumentGrid
              categories={visibleItems}
              dragOver={dragOver}
              isDragging={isDragging}
              hoveredStatusIcon={hoveredStatusIcon}
              onCycleStatus={cycleStatus}
              onRemoveFile={removeFile}
              onOpenFileDialog={openFileDialog}
              onFileUpload={handleFileUpload}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              fileInputRefs={fileInputRefs}
              onMouseEnterStatus={setHoveredStatusIcon}
              onMouseLeaveStatus={() => setHoveredStatusIcon(null)}
              getStatusStyling={getStatusStyling}
              getStatusTooltip={getStatusTooltip}
            />

            {/* Show More Button */}
            {!showMore && categories.length > 8 && (
              <ShowMoreButton onClick={() => setShowMore(true)} />
            )}

            {/* Footer Message */}
            <FooterMessage />

            {/* Navigation */}
            <FooterButtons />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;