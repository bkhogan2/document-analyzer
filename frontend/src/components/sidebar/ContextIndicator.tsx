import React from 'react';

import type { ApplicationType } from '../../constants/applicationTypes';

interface ContextIndicatorProps {
  appType?: ApplicationType;
  appId?: string;
}

export const ContextIndicator: React.FC<ContextIndicatorProps> = ({ 
  appType, 
  appId 
}) => {
  if (!appType || !appId) return null;
  
  return (
    <div className="px-3 py-2 border-b border-gray-700">
      <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
        {appType.toUpperCase()} Application
      </div>
      <div className="text-xs text-gray-300 font-medium truncate">
        {appId}
      </div>
    </div>
  );
}; 