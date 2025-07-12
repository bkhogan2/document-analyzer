import React, { useState, useRef, useCallback } from 'react';

interface DragAndDropAreaProps {
  onDropFiles: (files: FileList) => void;
  className?: string;
  children?: React.ReactNode;
  overlayContent?: React.ReactNode;
  disabled?: boolean;
}

export const DragAndDropArea: React.FC<DragAndDropAreaProps> = ({
  onDropFiles,
  className = '',
  children,
  overlayContent,
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
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-20 pointer-events-none rounded-xl">
          {overlayContent || (
            <span className="text-lg font-semibold text-white drop-shadow">Drop files to upload</span>
          )}
        </div>
      )}
      <div className={isDragging ? 'opacity-50' : ''}>
        {children}
      </div>
    </div>
  );
}; 