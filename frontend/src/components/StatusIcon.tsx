import * as React from 'react';
import { getStatusIcon } from '../utils/statusHelpers';
import type { DocumentStatus } from '../utils/statusHelpers';

interface StatusIconProps {
  status: DocumentStatus;
  className?: string;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ status, className }) => {
  return getStatusIcon(status, className);
};

export type { DocumentStatus }; 