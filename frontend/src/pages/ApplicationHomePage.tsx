import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplicationStore } from '../stores/applicationStore';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { DragAndDropArea } from '../components/DragAndDropArea';
import { Upload } from 'lucide-react';
import { Button } from '../components/Button';
import { getSurveyPageNameByIndex } from '../services/surveyJSService';

const ApplicationHomePage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { selectApplication } = useApplicationStore();

  // Get current application state
  const currentApp = useApplicationStore(state => {
    const currentId = state.currentApplicationId;
    return currentId ? state.applications[currentId] : undefined;
  });

  // Extract primary applicant info from formData.welcome
  const welcome = (typeof currentApp?.formData?.welcome === 'object' && currentApp?.formData?.welcome !== null)
    ? currentApp.formData.welcome as Record<string, unknown>
    : {};
  const applicantName = typeof welcome.applicantName === 'string' ? welcome.applicantName : '';
  const applicantEmail = typeof welcome.applicantEmail === 'string' ? welcome.applicantEmail : '';
  const streetAddress = typeof welcome.streetAddress === 'string' ? welcome.streetAddress : '';
  const city = typeof welcome.city === 'string' ? welcome.city : '';
  const stateVal = typeof welcome.state === 'string' ? welcome.state : '';
  const zip = typeof welcome.zip === 'string' ? welcome.zip : '';
  const address = [streetAddress, city, stateVal, zip].filter(Boolean).join(', ');
  // Get initials for avatar
  const initials = applicantName
    ? applicantName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '';

  // Initialize application when component mounts
  useEffect(() => {
    if (id && type) {
      selectApplication(id, type);
    }
  }, [id, type, selectApplication]);

  // Placeholder values for document progress
  const documentsCompleted = 3;
  const totalDocuments = 10;

  // Static handlers for now
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    alert(`Uploading ${files.length} file(s)`);
    e.target.value = '';
  };
  const handleDropFiles = (files: FileList) => {
    alert(`Uploading ${files.length} file(s)`);
  };
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleContinueApplication = () => {
    if (id && type && currentApp) {
      // Navigate to the current section's SurveyJS page
      const currentSectionIndex = currentApp.currentSectionIndex || 0;
      const pageName = getSurveyPageNameByIndex(currentSectionIndex);
      navigate(`/applications/${type}/${id}/steps?page=${pageName}`);
    }
  };

  // Get current step info for display
  const currentStepIndex = currentApp?.currentStepIndex || 0;
  const totalSteps = currentApp?.steps?.length || 8;

  return (
    <div className="flex-1 px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs />
        {/* Top row: Primary Applicant and Continue Application */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-8">
          {/* Primary Applicant Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-6">Primary Applicant</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-green-600">{initials}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{applicantName}</p>
                  <p className="text-sm text-gray-600">Primary Applicant</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span>{applicantEmail}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span>{address}</span>
              </div>
            </div>
          </div>
          {/* Continue Application Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Continue Application</h3>
              <p className="text-sm text-gray-600 mb-4">
                Continue from step {currentStepIndex + 1} of {totalSteps}
              </p>
            </div>
            <Button 
              variant="primary" 
              className="w-full mt-4"
              onClick={handleContinueApplication}
            >
              Continue Application
            </Button>
          </div>
        </div>
        {/* Bottom row: Documents Upload Area (full width) */}
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