import { create } from 'zustand';
import type { DocumentCategory, DocumentStatus } from '../types/document';
import { sbaDocumentCategories } from '../data/documentCategories';
import { createUploadedFile } from '../utils/fileUtils';

interface DocumentStore {
  // State
  categories: DocumentCategory[];
  dragOver: string | null;
  isDragging: boolean;
  hoveredStatusIcon: string | null;
  showMore: boolean;
  
  // Actions
  setDragOver: (categoryId: string | null) => void;
  setIsDragging: (isDragging: boolean) => void;
  setHoveredStatusIcon: (categoryId: string | null) => void;
  setShowMore: (showMore: boolean) => void;
  
  // Document actions
  cycleStatus: (categoryId: string) => void;
  uploadFiles: (categoryId: string, files: FileList | null) => void;
  removeFile: (categoryId: string, fileName: string) => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  // Initial state
  categories: sbaDocumentCategories,
  dragOver: null,
  isDragging: false,
  hoveredStatusIcon: null,
  showMore: false,
  
  // Basic setters
  setDragOver: (categoryId) => set({ dragOver: categoryId }),
  setIsDragging: (isDragging) => set({ isDragging }),
  setHoveredStatusIcon: (categoryId) => set({ hoveredStatusIcon: categoryId }),
  setShowMore: (showMore) => set({ showMore }),
  
  // Document actions
  cycleStatus: (categoryId) => {
    set((state) => ({
      categories: state.categories.map((category) => {
        if (category.id === categoryId) {
          const statusCycle: DocumentStatus[] = ['none', 'approved', 'warning', 'error'];
          const currentIndex = statusCycle.indexOf(category.status);
          const nextIndex = (currentIndex + 1) % statusCycle.length;
          return { ...category, status: statusCycle[nextIndex] };
        }
        return category;
      })
    }));
  },
  
  uploadFiles: (categoryId, files) => {
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map(file => createUploadedFile(file));
      
      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                selected: true,
                uploadedFiles: [...category.uploadedFiles, ...newFiles]
              }
            : category
        )
      }));
    }
  },
  
  removeFile: (categoryId, fileName) => {
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              uploadedFiles: category.uploadedFiles.filter(file => file.name !== fileName)
            }
          : category
      )
    }));
  }
})); 