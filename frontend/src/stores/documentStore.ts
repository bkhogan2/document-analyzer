import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DocumentCategory, DocumentStatus } from '../types/document';
import { sbaDocumentCategories } from '../data/documentCategories';
import { createUploadedFile } from '../utils/fileUtils';
import { documentService } from '../services/documentService';

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

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
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
      
      uploadFiles: async (categoryId: string, files: FileList | null) => {
        if (!files || files.length === 0) return;
        
        try {
          // Upload each file to the API
          for (const file of Array.from(files)) {
            await documentService.uploadFileToCategory(categoryId, file);
          }
          
          // Update local state with uploaded files
          const fileArray: File[] = Array.from(files);
          const newFiles = fileArray.map(file => createUploadedFile(file));
          
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
        } catch (error) {
          console.error('Upload failed:', error);
          // TODO: Add proper error handling/notification
          throw error;
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
    }),
    {
      name: 'document-uploads',
      partialize: (state) => ({
        // Persist both files and statuses for now (can be changed later)
        categories: state.categories.map(category => ({
          id: category.id,
          uploadedFiles: category.uploadedFiles,
          status: category.status
        }))
      }),
      // Merge function to handle partial data
      merge: (persistedState: any, currentState: DocumentStore) => {
        if (persistedState && persistedState.categories) {
          return {
            ...currentState,
            categories: currentState.categories.map(category => {
              const persistedCategory = persistedState.categories.find(
                (p: any) => p.id === category.id
              );
              return {
                ...category,
                uploadedFiles: persistedCategory?.uploadedFiles || [],
                status: persistedCategory?.status || category.status
              };
            })
          };
        }
        return currentState;
      }
    }
  )
); 