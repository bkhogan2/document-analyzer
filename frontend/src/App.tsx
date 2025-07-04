import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft,
  ChevronDown,
  Building2,
  FileText,
  Banknote,
  Calculator,
  TrendingUp,
  Users,
  CreditCard,
  Target
} from 'lucide-react';
import { StatusIcon, type DocumentStatus } from './components/StatusIcon';
import { DocumentCard } from './components/DocumentCard';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

interface UploadedFile {
  name: string;
  status: 'pending' | 'approved' | 'rejected';
}

type DocumentStatus = 'none' | 'approved' | 'warning' | 'error';

interface DocumentCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  selected: boolean;
  uploadedFiles: UploadedFile[];
  status: DocumentStatus;
}

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

  const getStatusTooltip = (status: DocumentStatus) => {
    switch (status) {
      case 'approved':
        return 'All Clear! Documents have been validated and approved.';
      case 'warning':
        return 'Warning: 3 comments found. Click here for details.';
      case 'error':
        return 'Error: Invalid or missing required documents detected.';
      default:
        return 'Click to cycle through status options';
    }
  };

  const getStatusStyling = (status: DocumentStatus) => {
    switch (status) {
      case 'approved':
        return {
          background: 'bg-green-50',
          border: 'border-green-500',
          iconBg: 'bg-green-100'
        };
      case 'warning':
        return {
          background: 'bg-yellow-50',
          border: 'border-yellow-500',
          iconBg: 'bg-yellow-100'
        };
      case 'error':
        return {
          background: 'bg-red-50',
          border: 'border-red-500',
          iconBg: 'bg-red-100'
        };
      default:
        return {
          background: 'bg-white',
          border: 'border-gray-200',
          iconBg: 'bg-gray-100'
        };
    }
  };

  const handleFileUpload = (categoryId: string, files: FileList | null) => {
    if (files && files.length > 0) {
      const newFiles: UploadedFile[] = Array.from(files).map(file => ({
        name: file.name,
        status: Math.random() > 0.7 ? 'rejected' : Math.random() > 0.5 ? 'approved' : 'pending'
      }));

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
            <div className="text-center mb-12">
              <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                SBA Loan Document Collection
              </h1>
              <p className="text-gray-600 text-lg">
                Upload the required documents for your SBA loan application. All documents should be current and complete.
              </p>
            </div>

            {/* Document Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {visibleItems.map((category) => {
                const Icon = category.icon;
                const isSelected = category.selected;
                const isDraggedOver = dragOver === category.id;
                const hasFiles = category.uploadedFiles.length > 0;
                const statusStyling = getStatusStyling(category.status);
                
                return (
                  <DocumentCard
                    key={category.id}
                    category={category}
                    isDraggedOver={isDraggedOver}
                    isDragging={isDragging}
                    hoveredStatusIcon={hoveredStatusIcon}
                    statusStyling={statusStyling}
                    onCycleStatus={cycleStatus}
                    onRemoveFile={removeFile}
                    onOpenFileDialog={openFileDialog}
                    onFileUpload={handleFileUpload}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    fileInputRef={(el) => (fileInputRefs.current[category.id] = el)}
                    onMouseEnterStatus={setHoveredStatusIcon}
                    onMouseLeaveStatus={() => setHoveredStatusIcon(null)}
                    getStatusTooltip={getStatusTooltip}
                  />
                );
              })}
            </div>

            {/* Show More Button */}
            {!showMore && categories.length > 8 && (
              <div className="text-center mb-8">
                <button
                  onClick={() => setShowMore(true)}
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  Show more documents
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}

            {/* Footer Message */}
            <div className="text-center text-gray-500 text-sm mb-8">
              Upload all required documents to proceed with your SBA loan application. Documents will be reviewed for completeness and accuracy.
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </button>
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Continue to Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;