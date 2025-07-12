import { CheckCircle, Circle, X, AlertTriangle, Clock } from 'lucide-react';

export type DocumentStatus = 'none' | 'approved' | 'warning' | 'error' | 'incomplete' | 'under-review' | 'rejected';

export function getStatusIcon(status: DocumentStatus, className = 'w-5 h-5') {
  switch (status) {
    case 'approved':
      return <CheckCircle className={`${className} text-green-600`} />;
    case 'warning':
      return <AlertTriangle className={`${className} text-yellow-600`} />;
    case 'error':
      return <X className={`${className} text-red-600`} />;
    case 'under-review':
      return <Clock className={`${className} text-blue-600`} />;
    case 'rejected':
      return <X className={`${className} text-red-600`} />;
    case 'incomplete':
      return <AlertTriangle className={`${className} text-yellow-600`} />;
    default:
      return <Circle className={`${className} text-gray-400`} />;
  }
}

export function getStatusColor(status: DocumentStatus) {
  switch (status) {
    case 'approved':
      return 'text-green-600 bg-green-100';
    case 'under-review':
      return 'text-blue-600 bg-blue-100';
    case 'incomplete':
      return 'text-yellow-600 bg-yellow-100';
    case 'rejected':
      return 'text-red-600 bg-red-100';
    case 'warning':
      return 'text-yellow-600 bg-yellow-100';
    case 'error':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function getStatusStyling(status: DocumentStatus) {
  switch (status) {
    case 'approved':
      return {
        background: 'bg-green-50',
        border: 'border-green-500',
        iconBg: 'bg-green-100',
      };
    case 'warning':
      return {
        background: 'bg-yellow-50',
        border: 'border-yellow-500',
        iconBg: 'bg-yellow-100',
      };
    case 'error':
      return {
        background: 'bg-red-50',
        border: 'border-red-500',
        iconBg: 'bg-red-100',
      };
    case 'under-review':
      return {
        background: 'bg-blue-50',
        border: 'border-blue-500',
        iconBg: 'bg-blue-100',
      };
    case 'rejected':
      return {
        background: 'bg-red-50',
        border: 'border-red-500',
        iconBg: 'bg-red-100',
      };
    case 'incomplete':
      return {
        background: 'bg-yellow-50',
        border: 'border-yellow-500',
        iconBg: 'bg-yellow-100',
      };
    default:
      return {
        background: 'bg-white',
        border: 'border-gray-200',
        iconBg: 'bg-gray-100',
      };
  }
}

export function getStatusTooltip(status: DocumentStatus) {
  switch (status) {
    case 'approved':
      return {
        title: '✓ Approved',
        description: 'This document has been reviewed and approved. No further action required.',
        className: 'text-green-600',
      };
    case 'warning':
      return {
        title: '⚠ Warning',
        description: 'This document may need additional information or clarification.',
        className: 'text-yellow-600',
      };
    case 'error':
      return {
        title: '✗ Error',
        description: 'This document has issues that need to be addressed before approval.',
        className: 'text-red-600',
      };
    case 'under-review':
      return {
        title: '⏳ Under Review',
        description: 'This document is currently under review.',
        className: 'text-blue-600',
      };
    case 'rejected':
      return {
        title: '✗ Rejected',
        description: 'This document was rejected. Please review and re-upload.',
        className: 'text-red-600',
      };
    case 'incomplete':
      return {
        title: '○ Incomplete',
        description: 'This document is incomplete. Please upload the required file(s).',
        className: 'text-yellow-600',
      };
    default:
      return {
        title: '○ Pending',
        description: 'This document has not been reviewed yet. Upload files to begin the review process.',
        className: 'text-gray-600',
      };
  }
} 