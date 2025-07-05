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
    showMore,
    dragOver,
    isDragging,
    hoveredStatusIcon,
    setShowMore,
    setIsDragging,
    setDragOver,
    setHoveredStatusIcon,
    cycleStatus,
    uploadFiles,
    removeFile
  } = useDocumentStore();
  
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
              onFileUpload={uploadFiles}
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