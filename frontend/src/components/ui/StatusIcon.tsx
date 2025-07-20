import * as React from 'react';

import type { DocumentStatus } from '../../types/document';
import { getStatusIcon } from '../../utils/statusUtils';

interface StatusIconProps {
  status: DocumentStatus;
  className?: string;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ status, className }) => {
  return getStatusIcon(status, className);
};

export type { DocumentStatus }; 