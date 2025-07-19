import * as React from 'react';
import { getStatusIcon } from '../utils/statusUtils';
import type { DocumentStatus } from '../types/document';

interface StatusIconProps {
  status: DocumentStatus;
  className?: string;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ status, className }) => {
  return getStatusIcon(status, className);
};

export type { DocumentStatus }; 