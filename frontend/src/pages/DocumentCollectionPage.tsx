import React, { useRef, useEffect } from 'react';
import { DocumentGrid } from '../components/DocumentGrid';
import { FooterButtons } from '../components/FooterButtons';
import { ShowMoreButton } from '../components/ShowMoreButton';
import { PageHeader } from '../components/PageHeader';
import { FooterMessage } from '../components/FooterMessage';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getStatusStyling, getStatusTooltip } from '../utils/statusUtils';
import { useDocumentStore } from '../stores/documentStore';
import { useApplicationStore } from '../stores/applicationStore';
import { useNotification } from '../components/NotificationProvider';
import { useNavigate, useParams } from 'react-router-dom';

export const DocumentCollectionPage: React.FC = () => {
  const { id: applicationId, type: applicationType } = useParams();
  const { selectApplication } = useApplicationStore();
  
  const {
    categories,
    isLoading,
    error,
    showMore,
    hoveredStatusIcon,
    setShowMore,
    setHoveredStatusIcon,
    fetchDocuments,
    getCategoryStatus,
    cycleStatus,
    uploadFiles,
    deleteDocument,
  } = useDocumentStore();

  const { notify } = useNotification();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const navigate = useNavigate();

  // Initialize application when component mounts
  useEffect(() => {
    if (applicationId && applicationType) {
      selectApplication(applicationId, applicationType);
    }
  }, [applicationId, applicationType, selectApplication]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Filter documents for this application using the documents from the store
  const getDocumentsByCategory = (categoryId: string) => {
    const { documents } = useDocumentStore.getState();
    return documents.filter(
      (doc) => doc.category_id === categoryId
    );
  };

  // Update categories with real statuses from documents
  const categoriesWithRealStatuses = categories.map(category => ({
    ...category,
    status: getCategoryStatus(category.id)
  }));

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

  // Handler to navigate to detail page
  const handleCardClick = (categoryId: string) => {
    if (applicationType && applicationId) {
      navigate(`/applications/${applicationType}/${applicationId}/documents/${categoryId}`);
    }
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
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs />
        <PageHeader />
        <div className="mb-12">
          <DocumentGrid
            categories={visibleItems}
            hoveredStatusIcon={hoveredStatusIcon}
            onCycleStatus={cycleStatus}
            onRemoveFile={(_categoryId, fileNameOrId) => deleteDocument(fileNameOrId)}
            onOpenFileDialog={openFileDialog}
            onFileUpload={handleFileUpload}
            fileInputRefs={fileInputRefs}
            onMouseEnterStatus={setHoveredStatusIcon}
            onMouseLeaveStatus={() => setHoveredStatusIcon(null)}
            getStatusStyling={getStatusStyling}
            getStatusTooltip={getStatusTooltip}
            getDocumentsByCategory={getDocumentsByCategory}
            onCardClick={handleCardClick}
          />
        </div>
        {!showMore && categoriesWithRealStatuses.length > 8 && (
          <ShowMoreButton onClick={() => setShowMore(true)} />
        )}
        <div className="mb-8">
          <FooterMessage />
        </div>
        <FooterButtons />
      </div>
    </div>
  );
}; 