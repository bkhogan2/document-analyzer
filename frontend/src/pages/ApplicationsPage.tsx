import { Eye, Plus, Briefcase, Trash } from 'lucide-react';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Button , Breadcrumbs } from '../components/ui';
import { APPLICATION_TYPES } from '../constants/applicationTypes';
import type { ApplicationType } from '../constants/applicationTypes';
import { useApplicationStore } from '../stores/applicationStore';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'text-green-600 bg-green-100';
    case 'under-review':
      return 'text-blue-600 bg-blue-100';
    case 'incomplete':
      return 'text-yellow-600 bg-yellow-100';
    case 'rejected':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const ApplicationsPage: React.FC = () => {
  const { type } = useParams<{ type?: ApplicationType }>();
  const navigate = useNavigate();
  const appType: ApplicationType = (type && APPLICATION_TYPES.includes(type as ApplicationType) ? type : APPLICATION_TYPES[0]) as ApplicationType;
  const allApplications = useApplicationStore(state => state.applications);
  const applications = Object.entries(allApplications)
    .filter(([, app]) => app.applicationType === appType)
    .map(([id, app]) => ({ id, ...app }));
  const deleteApplication = useApplicationStore(state => state.deleteApplication);

  const handleViewApplication = (application: { id: string; type: string }) => {
    navigate(`/applications/${application.type}/${application.id}/home`);
  };

  return (
    <div className="flex-1 px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs />
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              {appType.toUpperCase()} Applications
            </h1>
            <p className="text-gray-600">
              Manage and track all your {appType.toUpperCase()} loan applications
            </p>
          </div>
          <Button variant="primary" className="flex items-center space-x-2" onClick={() => { 
            // Generate a new application ID in the same format as existing ones
            const newId = `25QL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
            navigate(`/applications/${appType}/${newId}/steps`);
          }}>
            <Plus className="w-5 h-5" />
            <span>Start New Application</span>
          </Button>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-3">Application</div>
              <div className="col-span-3">Primary Applicant</div>
              <div className="col-span-2">Requested Amount</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Actions</div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {applications.map((application) => {
              // Extract display fields from formData if available and type guard
              const welcome = (typeof application.formData?.welcome === 'object' && application.formData?.welcome !== null)
                ? application.formData.welcome as Record<string, unknown>
                : {};
              const name = typeof welcome.applicantName === 'string' ? welcome.applicantName : application.id;
              const email = typeof welcome.applicantEmail === 'string' ? welcome.applicantEmail : '';
              const primaryApplicant = typeof welcome.applicantName === 'string' ? welcome.applicantName : '';
              
              // Get loan amount from loan-information page
              const loanInfo = (typeof application.formData?.['loan-information'] === 'object' && application.formData?.['loan-information'] !== null)
                ? application.formData['loan-information'] as Record<string, unknown>
                : {};
              const requestedAmount = typeof loanInfo.loanAmount === 'number' || typeof loanInfo.loanAmount === 'string' ? loanInfo.loanAmount : '';
              
              const status = 'incomplete';
              return (
                <div key={application.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{name}</h3>
                          <p className="text-sm text-gray-600">{application.id}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div>
                        <p className="font-medium text-gray-900">{primaryApplicant}</p>
                        <p className="text-sm text-gray-600">{email}</p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="font-semibold text-gray-900">{requestedAmount ? `$${requestedAmount}` : '--'}</p>
                    </div>
                    <div className="col-span-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <Button 
                        variant="primary" 
                        className="flex items-center space-x-1 px-4 py-2 text-sm"
                        onClick={() => handleViewApplication({ id: application.id, type: application.applicationType })}
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Button>
                      <button
                        type="button"
                        title="Delete Application"
                        className="ml-2 p-1 rounded hover:bg-red-50 text-red-600 transition-colors"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
                            deleteApplication(application.id);
                          }
                        }}
                        aria-label="Delete Application"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage; 