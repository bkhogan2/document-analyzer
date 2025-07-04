import React from 'react';
import { X, Check, Circle } from 'lucide-react';

interface UploadedFile {
  name: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface FileListProps {
  files: UploadedFile[];
  onRemoveFile: (fileName: string) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onRemoveFile }) => {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1 mb-2">
      {files.map((file, index) => (
        <div key={index} className="flex items-center justify-between text-xs bg-white rounded px-2 py-1">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {file.status === 'approved' && <Check className="w-3 h-3 text-green-600 flex-shrink-0" />}
            {file.status === 'rejected' && <X className="w-3 h-3 text-red-600 flex-shrink-0" />}
            {file.status === 'pending' && <Circle className="w-3 h-3 text-yellow-600 flex-shrink-0" />}
            <span className="truncate text-gray-700">{file.name}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFile(file.name);
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