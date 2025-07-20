import React from 'react';

import type { Document } from '../../types/api';
import type { DocumentStatus, DocumentCategory } from '../../types/document';

import { DocumentCard } from './DocumentCard';

interface DocumentGridProps {
  categories: DocumentCategory[];
  hoveredStatusIcon: string | null;
  onCycleStatus: (categoryId: string) => void;
  onRemoveFile: (categoryId: string, fileName: string) => void;
  onOpenFileDialog: (categoryId: string) => void;
  onFileUpload: (categoryId: string, files: FileList | null) => void;
  fileInputRefs: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>;
  onMouseEnterStatus: (categoryId: string) => void;
  onMouseLeaveStatus: () => void;
  getStatusStyling: (status: DocumentStatus) => { background: string; border: string; iconBg: string };
  getStatusTooltip: (status: DocumentStatus) => { title: string; description: string; className: string };
  getDocumentsByCategory: (categoryId: string) => Document[];
  onCardClick: (categoryId: string) => void;
}

export const DocumentGrid: React.FC<DocumentGridProps> = ({
  categories,
  hoveredStatusIcon,
  onCycleStatus,
  onRemoveFile,
  onOpenFileDialog,
  onFileUpload,
  fileInputRefs,
  onMouseEnterStatus,
  onMouseLeaveStatus,
  getStatusStyling,
  getStatusTooltip,
  getDocumentsByCategory,
  onCardClick,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {categories.map((category) => {
        const statusStyling = getStatusStyling(category.status);
        const documents = getDocumentsByCategory(category.id);
        return (
          <DocumentCard
            key={category.id}
            category={category}
            documents={documents}
            hoveredStatusIcon={hoveredStatusIcon}
            statusStyling={statusStyling}
            onCycleStatus={onCycleStatus}
            onRemoveFile={onRemoveFile}
            onOpenFileDialog={onOpenFileDialog}
            onFileUpload={onFileUpload}
            fileInputRef={(el) => (fileInputRefs.current[category.id] = el)}
            onMouseEnterStatus={onMouseEnterStatus}
            onMouseLeaveStatus={onMouseLeaveStatus}
            getStatusTooltip={getStatusTooltip}
            onCardClick={onCardClick}
          />
        );
      })}
    </div>
  );
}; 