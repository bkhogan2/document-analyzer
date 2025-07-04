import React from 'react';
import { CheckCircle, Circle, X, AlertTriangle } from 'lucide-react';

type DocumentStatus = 'none' | 'approved' | 'warning' | 'error';

interface StatusIconProps {
  status: DocumentStatus;
  className?: string;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ status, className = "w-5 h-5" }) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className={`${className} text-green-600`} />;
    case 'warning':
      return <AlertTriangle className={`${className} text-yellow-600`} />;
    case 'error':
      return <X className={`${className} text-red-600`} />;
    default:
      return <Circle className={`${className} text-gray-400`} />;
  }
};

export type { DocumentStatus }; 