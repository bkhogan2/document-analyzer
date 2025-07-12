import React, { useState, useRef, useCallback } from 'react';

interface DragAndDropAreaProps {
  onDropFiles: (files: FileList) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const DragAndDropArea: React.FC<DragAndDropAreaProps> = ({
  onDropFiles,
  className = '',
  children,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    dragCounter.current++;
    setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, [disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDropFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [onDropFiles, disabled]);

  return (
    <div
      className={`relative ${className}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      tabIndex={-1}
      aria-disabled={disabled}
      style={{ outline: 'none' }}
    >
      {isDragging && !disabled && (
        <div className="absolute inset-0 rounded-xl border-2 border-dashed border-blue-400 bg-blue-100 flex flex-col items-center justify-center transition-all duration-200 pointer-events-none">
          <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"></path></svg>
          <p className="text-sm font-medium text-gray-500">Drop files here</p>
          <p className="text-xs text-gray-400">or click to browse</p>
        </div>
      )}
      <div className={isDragging ? 'opacity-30' : ''}>
        {children}
      </div>
    </div>
  );
}; 