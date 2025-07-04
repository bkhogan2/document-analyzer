import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Search, 
  HelpCircle, 
  ChevronLeft, 
  ChevronDown,
  Building2,
  FileText,
  Banknote,
  Calculator,
  TrendingUp,
  Users,
  CreditCard,
  Target,
  Upload,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';

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

  const renderStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-48 bg-gray-800 flex flex-col">
        {/* Logo Section */}
        <div className="flex items-center justify-center h-28 p-4">
          <img 
            src="/public/ampac-large-logo.png" 
            alt="AMPAC Logo" 
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 py-2">
          <nav className="space-y-1">
            <a href="#" className="block px-3 py-2 text-white bg-gray-700 text-xs font-medium">
              SBA Applications
            </a>
            <a href="#" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 text-xs font-medium transition-colors">
              Document Library
            </a>
            <a href="#" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 text-xs font-medium transition-colors">
              Loan Pipeline
            </a>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 p-3">
          <div className="space-y-2">
            <a href="#" className="block text-gray-300 hover:text-white text-xs transition-colors">
              Account Settings
            </a>
            <a href="#" className="block text-gray-300 hover:text-white text-xs transition-colors">
              Sign Out
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <Search className="w-5 h-5 mr-2" />
                Search
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <HelpCircle className="w-5 h-5 mr-2" />
                Help
              </button>
            </div>
          </div>
        </div>

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
                  <div
                    key={category.id}
                    className="relative group"
                    onDragOver={(e) => handleDragOver(e, category.id)}
                    onDragLeave={(e) => handleDragLeave(e, category.id)}
                    onDrop={(e) => handleDrop(e, category.id)}
                  >
                    <div
                      className={`
                        relative w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
                        ${statusStyling.background} ${statusStyling.border} shadow-md hover:shadow-lg
                        ${hasFiles ? 'min-h-[140px] pb-12' : 'pb-12'}
                      `}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`
                            p-2 rounded-lg flex-shrink-0 ${statusStyling.iconBg}
                          `}>
                            <Icon className={`
                              w-5 h-5
                              ${category.status === 'approved' ? 'text-green-600' : 
                                category.status === 'warning' ? 'text-yellow-600' :
                                category.status === 'error' ? 'text-red-600' : 'text-gray-600'}
                            `} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                              {category.title}
                            </h3>
                            {category.subtitle && (
                              <p className="text-gray-600 text-xs mt-1">
                                {category.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-2 relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cycleStatus(category.id);
                            }}
                            onMouseEnter={() => setHoveredStatusIcon(category.id)}
                            onMouseLeave={() => setHoveredStatusIcon(null)}
                            className="transition-colors"
                          >
                            {renderStatusIcon(category.status)}
                          </button>
                          
                          {/* Status Tooltip */}
                          {hoveredStatusIcon === category.id && (
                            <div className="absolute bottom-6 right-0 z-50 w-56 p-3 bg-white text-gray-800 text-xs rounded-lg shadow-xl border border-gray-200">
                              <div className="absolute -bottom-1 right-3 w-2 h-2 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
                              {getStatusTooltip(category.status)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Uploaded Files List */}
                      {hasFiles && (
                        <div className="space-y-1 mb-2">
                          {category.uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between text-xs bg-white rounded px-2 py-1">
                              <div className="flex items-center space-x-2 min-w-0 flex-1">
                                {file.status === 'approved' && <Check className="w-3 h-3 text-green-600 flex-shrink-0" />}
                                {file.status === 'rejected' && <X className="w-3 h-3 text-red-600 flex-shrink-0" />}
                                {file.status === 'pending' && <Circle className="w-3 h-3 text-yellow-600 flex-shrink-0" />}
                                <span className="truncate text-gray-700">{file.name}</span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(category.id, file.name);
                                }}
                                className="text-gray-400 hover:text-red-600 transition-colors ml-2 flex-shrink-0"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Upload Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openFileDialog(category.id);
                        }}
                        className="absolute bottom-3 right-3 flex items-center space-x-1 text-gray-400 hover:text-gray-600 transition-colors text-xs"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload Files</span>
                      </button>

                      {/* Hidden File Input */}
                      <input
                        ref={(el) => fileInputRefs.current[category.id] = el}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload(category.id, e.target.files)}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.xlsx,.xls"
                      />

                      {/* Drag and Drop Overlay */}
                      {isDragging && isDraggedOver && (
                        <div className="absolute inset-0 rounded-xl border-2 border-dashed border-gray-400 bg-gray-50 bg-opacity-95 flex flex-col items-center justify-center transition-all duration-200 pointer-events-none">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="text-sm font-medium text-gray-500">Drop files here</p>
                          <p className="text-xs text-gray-400">or click to browse</p>
                        </div>
                      )}
                    </div>
                  </div>
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