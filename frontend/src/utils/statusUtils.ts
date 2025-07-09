import type { DocumentStatus } from '../components/StatusIcon';

export const getStatusStyling = (status: DocumentStatus) => {
  switch (status) {
    case 'approved':
      return {
        background: 'bg-green-50',
        border: 'border-green-200',
        iconBg: 'bg-green-100'
      };
    case 'warning':
      return {
        background: 'bg-yellow-50',
        border: 'border-yellow-200',
        iconBg: 'bg-yellow-100'
      };
    case 'error':
      return {
        background: 'bg-red-50',
        border: 'border-red-200',
        iconBg: 'bg-red-100'
      };
    default:
      return {
        background: 'bg-white',
        border: 'border-gray-200',
        iconBg: 'bg-gray-100'
      };
  }
};

export const getStatusTooltip = (status: DocumentStatus) => {
  switch (status) {
    case 'approved':
      return {
        title: '✓ Approved',
        description: 'This document has been reviewed and approved. No further action required.',
        className: 'text-green-600'
      };
    case 'warning':
      return {
        title: '⚠ Warning',
        description: 'This document has been reviewed but may need additional information or clarification.',
        className: 'text-yellow-600'
      };
    case 'error':
      return {
        title: '✗ Error',
        description: 'This document has issues that need to be addressed before approval.',
        className: 'text-red-600'
      };
    default:
      return {
        title: '○ Pending',
        description: 'This document has not been reviewed yet. Upload files to begin the review process.',
        className: 'text-gray-600'
      };
  }
}; 