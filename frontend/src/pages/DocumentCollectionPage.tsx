import React, { useRef, useEffect } from 'react';
import { DocumentGrid } from '../components/DocumentGrid';
import { FooterButtons } from '../components/FooterButtons';
import { ShowMoreButton } from '../components/ShowMoreButton';
import { PageHeader } from '../components/PageHeader';
import { FooterMessage } from '../components/FooterMessage';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getStatusStyling, getStatusTooltip } from '../utils/statusUtils';
import { useDocumentStore } from '../stores/documentStore';
import { useNotification } from '../components/NotificationProvider';
import { useNavigate, useParams } from 'react-router-dom';

// Example mock documents (in real code, import from a shared mock file)
const mockDocuments = [
  {
    id: 'doc-1',
    applicationId: '25QL-LZ29V',
    user_id: 'user-1',
    category_id: 'business-balance-sheet',
    filename: 'ai-in-space.pdf',
    original_filename: 'ai-in-space.pdf',
    file_path: '/uploads/25QL-LZ29V/business-balance-sheet/ai-in-space.pdf',
    file_size: 123456,
    mime_type: 'application/pdf',
    status: 'approved',
    status_message: '',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  {
    id: 'doc-2',
    applicationId: '25QL-LZ29V',
    user_id: 'user-1',
    category_id: 'personal-tax-returns',
    filename: 'ai-in-space.pdf',
    original_filename: 'ai-in-space.pdf',
    file_path: '/uploads/25QL-LZ29V/personal-tax-returns/ai-in-space.pdf',
    file_size: 123456,
    mime_type: 'application/pdf',
    status: 'pending',
    status_message: '',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  {
    id: 'doc-3',
    applicationId: '25QL-LZ29V',
    user_id: 'user-1',
    category_id: 'project-costs',
    filename: 'f1120.pdf',
    original_filename: 'f1120.pdf',
    file_path: '/uploads/25QL-LZ29V/project-costs/f1120.pdf',
    file_size: 654321,
    mime_type: 'application/pdf',
    status: 'approved',
    status_message: '',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  {
    id: 'doc-4',
    applicationId: '25QL-AB123',
    user_id: 'user-2',
    category_id: 'business-balance-sheet',
    filename: 'startup-plan.pdf',
    original_filename: 'startup-plan.pdf',
    file_path: '/uploads/25QL-AB123/business-balance-sheet/startup-plan.pdf',
    file_size: 222222,
    mime_type: 'application/pdf',
    status: 'pending',
    status_message: '',
    created_at: '2024-01-02T10:00:00Z',
    updated_at: '2024-01-02T10:00:00Z',
  },
  {
    id: 'doc-5',
    applicationId: '25QL-CD456',
    user_id: 'user-3',
    category_id: 'project-costs',
    filename: 'restaurant-equipment.pdf',
    original_filename: 'restaurant-equipment.pdf',
    file_path: '/uploads/25QL-CD456/project-costs/restaurant-equipment.pdf',
    file_size: 333333,
    mime_type: 'application/pdf',
    status: 'approved',
    status_message: '',
    created_at: '2024-01-03T10:00:00Z',
    updated_at: '2024-01-03T10:00:00Z',
  },
];

export const DocumentCollectionPage: React.FC = () => {
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
  const { id: applicationId, type: applicationType } = useParams();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Filter documents for this application
  const getDocumentsByCategory = (categoryId: string) => {
    return mockDocuments.filter(
      doc => doc.applicationId === applicationId && doc.category_id === categoryId
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