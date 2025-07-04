import React from 'react';
import { DocumentCard } from './DocumentCard';
import type { DocumentStatus, DocumentCategory } from '../types/document';
import type { Document } from '../types/api';

interface DocumentGridProps {
  categories: DocumentCategory[];
  dragOver: string | null;
  isDragging: boolean;
  hoveredStatusIcon: string | null;
  onCycleStatus: (categoryId: string) => void;
  onRemoveFile: (categoryId: string, fileName: string) => void;
  onOpenFileDialog: (categoryId: string) => void;
  onFileUpload: (categoryId: string, files: FileList | null) => void;
  onDragOver: (e: React.DragEvent, categoryId: string) => void;
  onDragLeave: (e: React.DragEvent, categoryId: string) => void;
  onDrop: (e: React.DragEvent, categoryId: string) => void;
  fileInputRefs: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>;
  onMouseEnterStatus: (categoryId: string) => void;
  onMouseLeaveStatus: () => void;
  getStatusStyling: (status: DocumentStatus) => { background: string; border: string; iconBg: string };
  getStatusTooltip: (status: DocumentStatus) => { title: string; description: string; className: string };
  getDocumentsByCategory: (categoryId: string) => Document[];
}

export const DocumentGrid: React.FC<DocumentGridProps> = ({
  categories,
  dragOver,
  isDragging,
  hoveredStatusIcon,
  onCycleStatus,
  onRemoveFile,
  onOpenFileDialog,
  onFileUpload,
  onDragOver,
  onDragLeave,
  onDrop,
  fileInputRefs,
  onMouseEnterStatus,
  onMouseLeaveStatus,
  getStatusStyling,
  getStatusTooltip,
  getDocumentsByCategory,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {categories.map((category) => {
        const isDraggedOver = dragOver === category.id;
        const statusStyling = getStatusStyling(category.status);
        const documents = getDocumentsByCategory(category.id);
        return (
          <DocumentCard
            key={category.id}
            category={category}
            documents={documents}
            isDraggedOver={isDraggedOver}
            isDragging={isDragging}
            hoveredStatusIcon={hoveredStatusIcon}
            statusStyling={statusStyling}
            onCycleStatus={onCycleStatus}
            onRemoveFile={onRemoveFile}
            onOpenFileDialog={onOpenFileDialog}
            onFileUpload={onFileUpload}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            fileInputRef={(el) => (fileInputRefs.current[category.id] = el)}
            onMouseEnterStatus={onMouseEnterStatus}
            onMouseLeaveStatus={onMouseLeaveStatus}
            getStatusTooltip={getStatusTooltip}
          />
        );
      })}
    </div>
  );
}; 