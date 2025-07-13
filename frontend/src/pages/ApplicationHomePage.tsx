import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, MapPin, Upload } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Button } from '../components/Button';
import { DragAndDropArea } from '../components/DragAndDropArea';
import { useApplicationStore } from '../stores/applicationStore';
import { mockApplications } from './ApplicationsPage';
type Application = typeof mockApplications[number];

const ApplicationHomePage: React.FC = () => {
  const { id: applicationId, type: applicationType } = useParams<{ id: string; type: string }>();
  const navigate = useNavigate();
  const application = mockApplications.find((app: Application) => app.id === applicationId);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    steps,
    currentStepIndex,
    setApplicationId,
    setApplicationType
  } = useApplicationStore();

  // Placeholder values for document progress
  const documentsCompleted = 3;
  const totalDocuments = 10;

  // Initialize application store with URL params
  useEffect(() => {
    if (applicationId && applicationType) {
      setApplicationId(applicationId);
      setApplicationType(applicationType);
    }
  }, [applicationId, applicationType, setApplicationId, setApplicationType]);

  const handleContinueApplication = () => {
    navigate('/applications/new');
  };

  // Handle file upload (accept any file type)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    // TODO: Implement upload logic here (for now, just alert)
    alert(`Uploading ${files.length} file(s)`);
    e.target.value = '';
  };

  const handleDropFiles = (files: FileList) => {
    // TODO: Implement upload logic here (for now, just alert)
    alert(`Uploading ${files.length} file(s)`);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs />
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                {application?.name || 'SBA Application'}
              </h1>
              <p className="text-gray-600">
                Track your SBA loan application progress and manage required documents
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">Application opened: March 15, 2024</span>
            </div>
          </div>
        </div>

        {/* First row: Primary Applicant and Continue Application */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Primary Applicant Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-6">Primary Applicant</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-green-600">BH</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{application?.primaryApplicant}</p>
                  <p className="text-sm text-gray-600">Primary Applicant</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{application?.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>1140 West Palm Street, San Diego, CA 92103</span>
              </div>
            </div>
          </div>

          {/* Continue Application Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Continue Application</h3>
              <p className="text-sm text-gray-600 mb-4">
                {currentStepIndex < steps.length 
                  ? `Continue from step ${currentStepIndex + 1} of ${steps.length}`
                  : 'Application form completed'
                }
              </p>
            </div>
            <Button 
              onClick={handleContinueApplication}
              variant="primary"
              className="w-full mt-4"
              disabled={currentStepIndex >= steps.length}
            >
              {currentStepIndex < steps.length ? 'Continue Application' : 'Review Application'}
            </Button>
          </div>
        </div>

        {/* Second row: Documents Card (full width, drag and drop area) */}
        <div className="mb-8">
          <DragAndDropArea onDropFiles={handleDropFiles} className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h3 className="font-semibold text-gray-900 mb-2 md:mb-0">Documents</h3>
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <div className="w-full md:w-64 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(documentsCompleted / totalDocuments) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 min-w-max">{documentsCompleted} of {totalDocuments}</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center py-8">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <div
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 cursor-pointer hover:bg-green-200 transition-colors"
                onClick={openFileDialog}
                tabIndex={0}
                aria-label="Upload Documents"
              >
                <Upload className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Choose a file or drag it here</h3>
              <p className="text-gray-600 mb-4">Supported formats: PDF, Excel, Word, Images (JPG, PNG)</p>
              <Button 
                variant="primary" 
                className="border-none outline-none shadow-none focus:ring-0 focus:outline-none"
                onClick={e => {
                  e.stopPropagation();
                  openFileDialog();
                }}
              >
                Browse Files
              </Button>
            </div>
          </DragAndDropArea>
        </div>
      </div>
    </div>
  );
};

export default ApplicationHomePage; 