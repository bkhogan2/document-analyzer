import React from 'react';
import { Button } from '../components/Button';
import { Eye, Plus, Briefcase } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { APPLICATION_TYPES } from '../constants/applicationTypes';
import type { ApplicationType } from '../constants/applicationTypes';
import { Breadcrumbs } from '../components/Breadcrumbs';

// Minimal mock data for applications with realistic IDs
const mockApplications = [
  {
    id: '25QL-LZ29V',
    type: 'sba',
    name: 'Flow Pilot',
    applicationNumber: '25QL-LZ29V',
    primaryApplicant: 'Brian Hogan',
    email: 'bkhogan2@gmail.com',
    requestedAmount: 100000,
    status: 'incomplete',
  },
  {
    id: '25QL-AB123',
    type: 'sba',
    name: 'Tech Startup Expansion',
    applicationNumber: '25QL-AB123',
    primaryApplicant: 'Brian Hogan',
    email: 'bkhogan2@gmail.com',
    requestedAmount: 250000,
    status: 'under-review',
  },
  {
    id: '25QL-CD456',
    type: 'sba',
    name: 'Restaurant Equipment',
    applicationNumber: '25QL-CD456',
    primaryApplicant: 'Brian Hogan',
    email: 'bkhogan2@gmail.com',
    requestedAmount: 75000,
    status: 'approved',
  },
];

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

  const handleViewApplication = (application: { id: string; type: string }) => {
    navigate(`/applications/${application.type}/${application.id}`);
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
          <Button variant="primary" className="flex items-center space-x-2">
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
            {mockApplications.map((application) => (
              <div key={application.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{application.name}</h3>
                        <p className="text-sm text-gray-600">{application.applicationNumber}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div>
                      <p className="font-medium text-gray-900">{application.primaryApplicant}</p>
                      <p className="text-sm text-gray-600">{application.email}</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold text-gray-900">${application.requestedAmount.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <Button 
                      variant="primary" 
                      className="flex items-center space-x-1 px-4 py-2 text-sm"
                      onClick={() => handleViewApplication(application)}
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </Button>
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

export default ApplicationsPage; 