import React, { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useApplicationStore } from '../../stores/applicationStore';
import { useDocumentStore } from '../../stores/documentStore';
import { getStatusStyling, getStatusTooltip } from '../../utils/statusUtils';
import { DocumentGrid } from '../documents';
import { useNotification } from '../ui';


interface DocumentCollectionStepProps {
  applicationId?: string;
  applicationType?: string;
}

export const DocumentCollectionStep: React.FC<DocumentCollectionStepProps> = ({ applicationId, applicationType }) => {
  const params = useParams();
  const appId = applicationId || params.id;
  const appType = applicationType || params.type;
  const { selectApplication } = useApplicationStore();

  const {
    categories,
    isLoading,
    error,
    showMore,
    hoveredStatusIcon,
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

  useEffect(() => {
    if (appId && appType) {
      selectApplication(appId, appType);
    }
  }, [appId, appType, selectApplication]);

  useEffect(() => {
    // Only fetch documents if we're not in SurveyJS context (where backend might not be available)
    if (!applicationId && !applicationType) {
      fetchDocuments();
    }
  }, [fetchDocuments]);

  const getDocumentsByCategory = (categoryId: string) => {
    // In real code, use store documents filtered by appId
    // Here, just use the store's getDocumentsByCategory
    return useDocumentStore.getState().getDocumentsByCategory(categoryId);
  };

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

  const handleCardClick = (categoryId: string) => {
    if (appType && appId && categoryId) {
      navigate(`/applications/${appType}/${appId}/documents/${categoryId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
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
    <div>
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
      {/* Optionally add ShowMoreButton, FooterMessage, etc. here if needed */}
    </div>
  );
}; 