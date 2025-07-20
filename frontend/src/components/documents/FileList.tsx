import { X, Check, Circle, AlertTriangle } from 'lucide-react';
import React, { useState } from 'react';

import type { Document } from '../../types/api';

interface FileListProps {
  files: Document[];
  onRemoveFile: (fileId: string) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onRemoveFile }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1 mb-2">
      {files.map((file, index) => (
        <div key={file.id} className="flex items-center justify-between text-xs bg-white rounded px-2 py-1">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <span
              className="relative flex items-center"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {file.status === 'approved' && <Check className="w-3 h-3 text-green-600 flex-shrink-0" />}
              {file.status === 'error' && <X className="w-3 h-3 text-red-600 flex-shrink-0" />}
              {file.status === 'warning' && <AlertTriangle className="w-3 h-3 text-yellow-600 flex-shrink-0" />}
              {file.status !== 'approved' && file.status !== 'error' && file.status !== 'warning' && <Circle className="w-3 h-3 text-gray-400 flex-shrink-0" />}
              {/* Tooltip for status message */}
              {hoveredIndex === index && file.status && (
                <div className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-48 p-2 bg-white text-gray-800 text-xs rounded-lg shadow-xl border border-gray-200 whitespace-pre-line">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                  {file.status}
                </div>
              )}
            </span>
            <span className="truncate text-gray-900 font-medium" title={file.original_filename}>{file.original_filename}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFile(file.id);
            }}
            className="text-gray-400 hover:text-red-600 transition-colors ml-2 flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}; 