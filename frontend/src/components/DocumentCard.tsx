import React from 'react';
import { Upload } from 'lucide-react';
import { StatusIcon, DocumentStatus } from './StatusIcon';
import { FileList } from './FileList';

interface UploadedFile {
  name: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface DocumentCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  selected: boolean;
  uploadedFiles: UploadedFile[];
  status: DocumentStatus;
}

interface DocumentCardProps {
  category: DocumentCategory;
  isDraggedOver: boolean;
  isDragging: boolean;
  hoveredStatusIcon: string | null;
  statusStyling: {
    background: string;
    border: string;
    iconBg: string;
  };
  onCycleStatus: (categoryId: string) => void;
  onRemoveFile: (categoryId: string, fileName: string) => void;
  onOpenFileDialog: (categoryId: string) => void;
  onFileUpload: (categoryId: string, files: FileList | null) => void;
  onDragOver: (e: React.DragEvent, categoryId: string) => void;
  onDragLeave: (e: React.DragEvent, categoryId: string) => void;
  onDrop: (e: React.DragEvent, categoryId: string) => void;
  fileInputRef: (el: HTMLInputElement | null) => void;
  onMouseEnterStatus: (categoryId: string) => void;
  onMouseLeaveStatus: () => void;
  getStatusTooltip: (status: DocumentStatus) => React.ReactNode;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  category,
  isDraggedOver,
  isDragging,
  hoveredStatusIcon,
  statusStyling,
  onCycleStatus,
  onRemoveFile,
  onOpenFileDialog,
  onFileUpload,
  onDragOver,
  onDragLeave,
  onDrop,
  fileInputRef,
  onMouseEnterStatus,
  onMouseLeaveStatus,
  getStatusTooltip,
}) => {
  const Icon = category.icon;
  const hasFiles = category.uploadedFiles.length > 0;

  return (
    <div
      className="relative group"
      onDragOver={(e) => onDragOver(e, category.id)}
      onDragLeave={(e) => onDragLeave(e, category.id)}
      onDrop={(e) => onDrop(e, category.id)}
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
            <div className={`p-2 rounded-lg flex-shrink-0 ${statusStyling.iconBg}`}>
              <Icon className={
                `w-5 h-5 ${
                  category.status === 'approved' ? 'text-green-600' :
                  category.status === 'warning' ? 'text-yellow-600' :
                  category.status === 'error' ? 'text-red-600' : 'text-gray-600'
                }`
              } />
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
                onCycleStatus(category.id);
              }}
              onMouseEnter={() => onMouseEnterStatus(category.id)}
              onMouseLeave={onMouseLeaveStatus}
              className="transition-colors"
            >
              <StatusIcon status={category.status} />
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
        <FileList 
          files={category.uploadedFiles}
          onRemoveFile={(fileName) => onRemoveFile(category.id, fileName)}
        />
        {/* Upload Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenFileDialog(category.id);
          }}
          className="absolute bottom-3 right-3 flex items-center space-x-1 text-gray-400 hover:text-gray-600 transition-colors text-xs"
        >
          <Upload className="w-3 h-3" />
          <span>Upload Files</span>
        </button>
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => onFileUpload(category.id, e.target.files)}
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
}; 