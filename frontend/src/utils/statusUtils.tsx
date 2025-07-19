import { CheckCircle, Circle, X, AlertTriangle, Clock } from 'lucide-react';
import type { DocumentStatus } from '../types/document';

// Status styling configurations
export interface StatusStyling {
  background: string;
  border: string;
  iconBg: string;
  textColor?: string;
}

// Document status type (consolidated from multiple sources)
export type DocumentStatusType = 'none' | 'approved' | 'warning' | 'error' | 'incomplete' | 'under-review' | 'rejected';

// Status icon component
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

// Status color classes
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

// Status styling object
export function getStatusStyling(status: DocumentStatus): StatusStyling {
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
    case 'under-review':
      return {
        background: 'bg-blue-50',
        border: 'border-blue-500',
        iconBg: 'bg-blue-100',
        textColor: 'text-blue-700'
      };
    case 'rejected':
      return {
        background: 'bg-red-50',
        border: 'border-red-500',
        iconBg: 'bg-red-100',
        textColor: 'text-red-700'
      };
    case 'incomplete':
      return {
        background: 'bg-yellow-50',
        border: 'border-yellow-500',
        iconBg: 'bg-yellow-100',
        textColor: 'text-yellow-700'
      };
    default:
      return {
        background: 'bg-white',
        border: 'border-gray-200',
        iconBg: 'bg-gray-100',
        textColor: 'text-gray-700'
      };
  }
}

// Status tooltip data
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

// Application status styling (for application-level status)
export function getApplicationStatusStyling(status: string): StatusStyling {
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
}

// Application status tooltip
export function getApplicationStatusTooltip(status: string): string {
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
}

// Status colors for badges
export function getStatusColorForBadge(status: string): string {
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
}

// Document status colors for badges
export function getDocumentStatusColorForBadge(status: DocumentStatus): string {
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
} 