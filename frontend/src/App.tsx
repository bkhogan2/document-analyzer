import React, { useRef, useEffect } from 'react';
import { DocumentGrid } from './components/DocumentGrid';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FooterButtons } from './components/FooterButtons';
import { ShowMoreButton } from './components/ShowMoreButton';
import { PageHeader } from './components/PageHeader';
import { FooterMessage } from './components/FooterMessage';
import { getStatusStyling, getStatusTooltip } from './utils/statusUtils';
import { useDocumentStore } from './stores/documentStore';

function App() {
  const {
    categories,
    documents,
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
    removeFile,
    deleteDocument
  } = useDocumentStore();
  
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

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

  // Show loading state
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

  // Show error state
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
              onRemoveFile={(_categoryId, fileNameOrId) => deleteDocument(fileNameOrId)}
              onOpenFileDialog={openFileDialog}
              onFileUpload={uploadFiles}
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

            {/* Show More Button */}
            {!showMore && categoriesWithRealStatuses.length > 8 && (
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