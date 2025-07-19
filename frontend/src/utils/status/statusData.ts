import type { DocumentStatus } from '../../types/document';

// Status styling configurations
export interface StatusStyling {
  background: string;
  border: string;
  iconBg: string;
  textColor: string;
}

// Status styling for different document statuses
export const getStatusStyling = (status: DocumentStatus): StatusStyling => {
  switch (status) {
    case 'approved':
      return {
        background: 'bg-green-50',
        border: 'border-green-500',
        iconBg: 'bg-green-100',
        textColor: 'text-green-700'
      };
    case 'warning':
      return {
        background: 'bg-yellow-50',
        border: 'border-yellow-500',
        iconBg: 'bg-yellow-100',
        textColor: 'text-yellow-700'
      };
    case 'error':
      return {
        background: 'bg-red-50',
        border: 'border-red-500',
        iconBg: 'bg-red-100',
        textColor: 'text-red-700'
      };
    default:
      return {
        background: 'bg-white',
        border: 'border-gray-200',
        iconBg: 'bg-gray-100',
        textColor: 'text-gray-700'
      };
  }
};

// Application status styling
export const getApplicationStatusStyling = (status: string): StatusStyling => {
  switch (status) {
    case 'approved':
      return {
        background: 'bg-green-50',
        border: 'border-green-500',
        iconBg: 'bg-green-100',
        textColor: 'text-green-700'
      };
    case 'under-review':
      return {
        background: 'bg-blue-50',
        border: 'border-blue-500',
        iconBg: 'bg-blue-100',
        textColor: 'text-blue-700'
      };
    case 'complete':
      return {
        background: 'bg-green-50',
        border: 'border-green-500',
        iconBg: 'bg-green-100',
        textColor: 'text-green-700'
      };
    case 'rejected':
      return {
        background: 'bg-red-50',
        border: 'border-red-500',
        iconBg: 'bg-red-100',
        textColor: 'text-red-700'
      };
    default: // incomplete
      return {
        background: 'bg-gray-50',
        border: 'border-gray-500',
        iconBg: 'bg-gray-100',
        textColor: 'text-gray-700'
      };
  }
};

// Status tooltips
export const getStatusTooltip = (status: DocumentStatus): string => {
  switch (status) {
    case 'approved':
      return 'Document has been reviewed and approved';
    case 'warning':
      return 'Document has issues that need attention';
    case 'error':
      return 'Document has been rejected or has critical issues';
    default:
      return 'Document has not been reviewed yet';
  }
};

// Application status tooltips
export const getApplicationStatusTooltip = (status: string): string => {
  switch (status) {
    case 'approved':
      return 'Application has been approved';
    case 'under-review':
      return 'Application is currently under review';
    case 'complete':
      return 'Application is complete and ready for review';
    case 'rejected':
      return 'Application has been rejected';
    default: // incomplete
      return 'Application is incomplete';
  }
};

// Status colors for badges
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'under-review':
      return 'bg-blue-100 text-blue-800';
    case 'complete':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default: // incomplete
      return 'bg-gray-100 text-gray-800';
  }
};

// Document status colors
export const getDocumentStatusColor = (status: DocumentStatus): string => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    case 'error':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}; 