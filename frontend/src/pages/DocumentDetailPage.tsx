import React, { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentStore } from '../stores/documentStore';
import { Upload, ChevronLeft, CheckCircle, X, Clock, FileText } from 'lucide-react';
import { Button } from '../components/Button';
import { DragAndDropArea } from '../components/DragAndDropArea';
import { useNotification } from '../components/NotificationProvider';

export const DocumentDetailPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const category = useDocumentStore(state => state.categories.find(cat => cat.id === categoryId));
  const getDocumentsByCategory = useDocumentStore(state => state.getDocumentsByCategory);
  const documents = getDocumentsByCategory(categoryId!);
  const uploadFiles = useDocumentStore(state => state.uploadFiles);
  const deleteDocument = useDocumentStore(state => state.deleteDocument);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { notify } = useNotification();
  const fetchDocuments = useDocumentStore(state => state.fetchDocuments);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  if (!category) {
    return (
      <div className="p-8">Document category not found.</div>
    );
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const { anySuccess, errors } = await uploadFiles(category.id, files);
    if (anySuccess) {
      notify('Files uploaded successfully!', 'success');
    }
    errors.forEach(msg => notify(msg, 'error'));
  };

  return (
    <div className="flex-1 px-8 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')} // Go back to collection page
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Documents
          </button>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            {category.title}
          </h1>
          <p className="text-gray-600 text-lg">
            {category.description}
          </p>
        </div>

        {/* Drag and Drop Area */}
        <DragAndDropArea
          onDropFiles={files => handleFileUpload(files)}
          className="mb-8 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Choose a file or drag it here
            </h3>
            <p className="text-gray-600 mb-4">
              Supported formats: PDF, Excel, Word, Images (JPG, PNG)
            </p>
            <Button 
              variant="primary" 
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={e => handleFileUpload(e.target.files)}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.xlsx,.xls"
            />
          </div>
        </DragAndDropArea>

        {/* Uploaded Files */}
        {documents.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Uploaded Documents</h2>
            {documents.map((file, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${file.status === 'approved' ? 'bg-green-100' : file.status === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                      {file.status === 'approved' && <CheckCircle className="w-6 h-6 text-green-600" />}
                      {file.status === 'rejected' && <X className="w-6 h-6 text-red-600" />}
                      {file.status === 'pending' && <Clock className="w-6 h-6 text-yellow-600" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{file.original_filename || file.filename}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${file.status === 'approved' ? 'bg-green-100 text-green-800' : file.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {file.status === 'approved' ? 'Approved' : file.status === 'rejected' ? 'Rejected' : 'Under Review'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await deleteDocument(file.id);
                        notify('Document deleted.', 'success');
                      } catch {
                        notify('Failed to delete document.', 'error');
                      }
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Comments/Feedback */}
                {file.status_message && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Comments & Feedback</h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${file.status === 'approved' ? 'bg-green-500' : file.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                        <p className="text-gray-700 text-sm">{file.status_message}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded yet</h3>
            <p className="text-gray-600">
              Upload your {category.title.toLowerCase()} using the area above to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 