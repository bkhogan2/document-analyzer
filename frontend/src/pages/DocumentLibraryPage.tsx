import { FileText, Download, Eye, Calendar, User } from 'lucide-react';
import React, { useEffect } from 'react';

import { Breadcrumbs } from '../components/ui';
import { useDocumentStore } from '../stores/documentStore';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'text-green-600 bg-green-100';
    case 'under_review':
      return 'text-blue-600 bg-blue-100';
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'rejected':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const DocumentLibraryPage: React.FC = () => {
  const { documents, fetchDocuments } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Transform documents to match the expected format
  const transformedDocuments = documents.map(doc => ({
    id: doc.id,
    applicationId: doc.user_id, // Using user_id as applicationId for now
    applicationName: `Application ${doc.user_id}`,
    filename: doc.original_filename,
    category: doc.category_id,
    fileSize: `${Math.round(doc.file_size / 1024)} KB`,
    uploadedAt: doc.created_at,
    status: doc.status,
    uploadedBy: 'User', // Placeholder
    mimeType: doc.mime_type
  }));

  return (
    <div className="flex-1 px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Document Library
          </h1>
          <p className="text-gray-600">
            All documents across all applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-semibold text-gray-900">{transformedDocuments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {transformedDocuments.filter(doc => doc.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {transformedDocuments.filter(doc => doc.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {transformedDocuments.filter(doc => doc.status === 'under_review').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-3">Document</div>
              <div className="col-span-2">Application</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Uploaded</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {transformedDocuments.map((document) => (
              <div key={document.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{document.filename}</h3>
                        <p className="text-sm text-gray-600">{document.fileSize}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="font-medium text-gray-900">{document.applicationName}</p>
                    <p className="text-sm text-gray-600">{document.applicationId}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-900">{document.category}</p>
                  </div>
                  <div className="col-span-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                      {formatStatus(document.status)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{formatDate(document.uploadedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">{document.uploadedBy}</span>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 