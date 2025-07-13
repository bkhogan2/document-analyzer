import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Button } from '../components/Button';
import { mockApplications } from './ApplicationsPage';
type Application = typeof mockApplications[number];

const ApplicationHomePage: React.FC = () => {
  const { id: applicationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const application = mockApplications.find((app: Application) => app.id === applicationId);

  // Placeholder values for document progress
  const documentsCompleted = 3;
  const totalDocuments = 10;
  const status = application?.status || 'incomplete';

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
          {/* Application Status Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Application Status</h3>
              <div className="flex items-center space-x-2">
                {/* Status icon placeholder */}
                <span className={`text-sm font-medium ${status === 'incomplete' ? 'text-yellow-600' : 'text-green-600'}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </span>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Documents</span>
                <span className="font-medium">{documentsCompleted} of {totalDocuments}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(documentsCompleted / totalDocuments) * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Complete document upload to proceed with your application
            </p>
            <Button 
              onClick={() => navigate(`/applications/sba/${applicationId}/documents`)}
              variant="primary"
              className="w-full"
            >
              Upload Documents
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationHomePage; 