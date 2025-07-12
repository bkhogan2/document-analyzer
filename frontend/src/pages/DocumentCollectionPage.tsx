import React, { useRef, useEffect } from 'react';
import { DocumentGrid } from '../components/DocumentGrid';
import { FooterButtons } from '../components/FooterButtons';
import { ShowMoreButton } from '../components/ShowMoreButton';
import { PageHeader } from '../components/PageHeader';
import { FooterMessage } from '../components/FooterMessage';
import { getStatusStyling, getStatusTooltip } from '../utils/statusUtils';
import { useDocumentStore } from '../stores/documentStore';
import { useNotification } from '../components/NotificationProvider';

export const DocumentCollectionPage: React.FC = () => {
  const {
    categories,
    isLoading,
    error,
    showMore,
    dragOver,
    isDragging,
    hoveredStatusIcon,
    setShowMore,
    setIsDragging,
    setDragOver,
    setHoveredStatusIcon,
    fetchDocuments,
    getCategoryStatus,
    cycleStatus,
    uploadFiles,
    deleteDocument,
  } = useDocumentStore();

  const { notify } = useNotification();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Update categories with real statuses from documents
  const categoriesWithRealStatuses = categories.map(category => ({
    ...category,
    status: getCategoryStatus(category.id)
  }));

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
    uploadFiles(categoryId, files);
  };

  const openFileDialog = (categoryId: string) => {
    fileInputRefs.current[categoryId]?.click();
  };

  const visibleItems = showMore ? categoriesWithRealStatuses : categoriesWithRealStatuses.slice(0, 8);

  const handleFileUpload = async (categoryId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const { anySuccess, errors } = await uploadFiles(categoryId, files);
    if (anySuccess) {
      notify('Files uploaded successfully!', 'success');
    }
    errors.forEach(msg => notify(msg, 'error'));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => fetchDocuments()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <PageHeader />
        <DocumentGrid
          categories={visibleItems}
          dragOver={dragOver}
          isDragging={isDragging}
          hoveredStatusIcon={hoveredStatusIcon}
          onCycleStatus={cycleStatus}
          onRemoveFile={(_categoryId, fileNameOrId) => deleteDocument(fileNameOrId)}
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
          getDocumentsByCategory={useDocumentStore.getState().getDocumentsByCategory}
        />
        {!showMore && categoriesWithRealStatuses.length > 8 && (
          <ShowMoreButton onClick={() => setShowMore(true)} />
        )}
        <FooterMessage />
        <FooterButtons />
      </div>
    </div>
  );
}; 