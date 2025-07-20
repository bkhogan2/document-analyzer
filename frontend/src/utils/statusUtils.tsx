import { CheckCircle, Circle, X, AlertTriangle, Clock } from 'lucide-react';

import type { DocumentStatus } from '../types/document';

// Status styling configurations
export interface StatusStyling {
  background: string;
  border: string;
  iconBg: string;
  textColor?: string;
}

// Centralized status configuration
const STATUS_CONFIG = {
  approved: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    background: 'bg-green-50',
    border: 'border-green-500',
    iconBg: 'bg-green-100',
    textColor: 'text-green-700',
    badgeColor: 'bg-green-100 text-green-800',
    tooltip: {
      title: '✓ Approved',
      description: 'This document has been reviewed and approved. No further action required.',
      className: 'text-green-600',
    }
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    background: 'bg-yellow-50',
    border: 'border-yellow-500',
    iconBg: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    badgeColor: 'bg-yellow-100 text-yellow-800',
    tooltip: {
      title: '⚠ Warning',
      description: 'This document may need additional information or clarification.',
      className: 'text-yellow-600',
    }
  },
  error: {
    icon: X,
    iconColor: 'text-red-600',
    background: 'bg-red-50',
    border: 'border-red-500',
    iconBg: 'bg-red-100',
    textColor: 'text-red-700',
    badgeColor: 'bg-red-100 text-red-800',
    tooltip: {
      title: '✗ Error',
      description: 'This document has issues that need to be addressed before approval.',
      className: 'text-red-600',
    }
  },
  'under-review': {
    icon: Clock,
    iconColor: 'text-blue-600',
    background: 'bg-blue-50',
    border: 'border-blue-500',
    iconBg: 'bg-blue-100',
    textColor: 'text-blue-700',
    badgeColor: 'bg-blue-100 text-blue-800',
    tooltip: {
      title: '⏳ Under Review',
      description: 'This document is currently under review.',
      className: 'text-blue-600',
    }
  },
  rejected: {
    icon: X,
    iconColor: 'text-red-600',
    background: 'bg-red-50',
    border: 'border-red-500',
    iconBg: 'bg-red-100',
    textColor: 'text-red-700',
    badgeColor: 'bg-red-100 text-red-800',
    tooltip: {
      title: '✗ Rejected',
      description: 'This document was rejected. Please review and re-upload.',
      className: 'text-red-600',
    }
  },
  incomplete: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    background: 'bg-yellow-50',
    border: 'border-yellow-500',
    iconBg: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    badgeColor: 'bg-yellow-100 text-yellow-800',
    tooltip: {
      title: '○ Incomplete',
      description: 'This document is incomplete. Please upload the required file(s).',
      className: 'text-yellow-600',
    }
  },
  complete: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    background: 'bg-green-50',
    border: 'border-green-500',
    iconBg: 'bg-green-100',
    textColor: 'text-green-700',
    badgeColor: 'bg-green-100 text-green-800',
    tooltip: {
      title: '✓ Complete',
      description: 'This application is complete and ready for review.',
      className: 'text-green-600',
    }
  },
  default: {
    icon: Circle,
    iconColor: 'text-gray-400',
    background: 'bg-white',
    border: 'border-gray-200',
    iconBg: 'bg-gray-100',
    textColor: 'text-gray-700',
    badgeColor: 'bg-gray-100 text-gray-800',
    tooltip: {
      title: '○ Pending',
      description: 'This document has not been reviewed yet. Upload files to begin the review process.',
      className: 'text-gray-600',
    }
  }
} as const;

// Helper function to get status config
function getStatusConfig(status: DocumentStatus | string) {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.default;
}

// Status icon component
export function getStatusIcon(status: DocumentStatus, className = 'w-5 h-5') {
  const config = getStatusConfig(status);
  const IconComponent = config.icon;
  return <IconComponent className={`${className} ${config.iconColor}`} />;
}

// Status styling object
export function getStatusStyling(status: DocumentStatus): StatusStyling {
  const config = getStatusConfig(status);
  return {
    background: config.background,
    border: config.border,
    iconBg: config.iconBg,
    textColor: config.textColor
  };
}

// Status tooltip data
export function getStatusTooltip(status: DocumentStatus) {
  const config = getStatusConfig(status);
  return config.tooltip;
} 