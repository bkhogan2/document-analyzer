import React from 'react';
import { Upload } from 'lucide-react';
import { StatusIcon } from './StatusIcon';
import { getStatusStyling } from '../utils/statusHelpers';
import { FileList } from './FileList';
import type { DocumentCategory } from '../types/document';
import type { Document } from '../types/api';
import { Button } from './Button';
import { DragAndDropArea } from './DragAndDropArea';

interface DocumentCardProps {
  category: DocumentCategory;
  documents: Document[];
  hoveredStatusIcon: string | null;
  onCycleStatus: (categoryId: string) => void;
  onRemoveFile: (categoryId: string, fileName: string) => void;
  onOpenFileDialog: (categoryId: string) => void;
  onFileUpload: (categoryId: string, files: FileList | null) => void;
  fileInputRef: (el: HTMLInputElement | null) => void;
  onMouseEnterStatus: (categoryId: string) => void;
  onMouseLeaveStatus: () => void;
  getStatusTooltip?: (status: string) => { title: string; description: string; className: string };
  statusStyling?: { background: string; border: string; iconBg: string };
  onCardClick?: (categoryId: string) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  category,
  documents,
  hoveredStatusIcon,
  onCycleStatus,
  onRemoveFile,
  onOpenFileDialog,
  onFileUpload,
  fileInputRef,
  onMouseEnterStatus,
  onMouseLeaveStatus,
  getStatusTooltip,
  statusStyling,
  onCardClick,
}) => {
  const Icon = category.icon;
  const hasFiles = documents.length > 0;
  const styling = statusStyling || getStatusStyling(category.status);

  // Handler for file drop
  const handleDropFiles = (files: FileList) => {
    onFileUpload(category.id, files);
  };

  return (
    <div
      className={`relative group cursor-pointer`}
      onClick={() => onCardClick && onCardClick(category.id)}
    >
      <DragAndDropArea
        onDropFiles={handleDropFiles}
        overlayContent={
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-8 h-8 mb-2 text-gray-500" />
            <p className="text-sm font-medium text-gray-500">Drop files here</p>
            <p className="text-xs text-gray-400">or click to browse</p>
          </div>
        }
        className={`relative w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${styling.background} ${styling.border} shadow-md hover:shadow-lg ${hasFiles ? 'min-h-[140px] pb-12' : 'pb-12'}`}
      >
        <div
          // onClick={() => onCardClick && onCardClick(category.id)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg flex-shrink-0 ${styling.iconBg}`}>
                <Icon className="w-5 h-5 text-gray-600" />
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
              {hoveredStatusIcon === category.id && getStatusTooltip && (() => {
                const tooltip = getStatusTooltip(category.status);
                return tooltip ? (
                  <div className="absolute bottom-6 right-0 z-50 w-56 p-3 bg-white text-gray-800 text-xs rounded-lg shadow-xl border border-gray-200">
                    <div className="absolute -bottom-1 right-3 w-2 h-2 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
                    <div>
                      <div className={`font-semibold mb-1 ${tooltip.className}`}>{tooltip.title}</div>
                      <div className="text-gray-600">{tooltip.description}</div>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
          {/* Uploaded Files List */}
          <FileList 
            files={documents}
            onRemoveFile={(fileName) => onRemoveFile(category.id, fileName)}
          />
          {/* Upload Button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onOpenFileDialog(category.id);
            }}
            variant="text"
            className="absolute bottom-3 right-3 flex items-center space-x-1 text-xs text-gray-400 hover:text-gray-600"
          >
            <Upload className="w-3 h-3" />
            <span>Upload Files</span>
          </Button>
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => onFileUpload(category.id, e.target.files)}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.xlsx,.xls"
          />
        </div>
      </DragAndDropArea>
    </div>
  );
}; 