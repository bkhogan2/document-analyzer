import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DocumentCategory, DocumentStatus } from '../types/document';
import type { Document } from '../types/api';
import { sbaDocumentCategories } from '../data/documentCategories';
import { createUploadedFile } from '../utils/fileUtils';
import { documentService } from '../services/documentService';

interface DocumentStore {
  // State
  categories: DocumentCategory[];
  documents: Document[];
  isLoading: boolean;
  error: string | null;
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
  fetchDocuments: (userId?: string) => Promise<void>;
  cycleStatus: (categoryId: string) => void;
  uploadFiles: (categoryId: string, files: FileList | null) => void;
  removeFile: (categoryId: string, fileName: string) => void;
  deleteDocument: (documentId: string) => Promise<void>;
  
  // Helper methods
  getDocumentsByCategory: (categoryId: string) => Document[];
  getCategoryStatus: (categoryId: string) => DocumentStatus;
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      // Initial state
      categories: sbaDocumentCategories,
      documents: [],
      isLoading: false,
      error: null,
      dragOver: null,
      isDragging: false,
      hoveredStatusIcon: null,
      showMore: false,
      
      // Basic setters
      setDragOver: (categoryId) => set({ dragOver: categoryId }),
      setIsDragging: (isDragging) => set({ isDragging }),
      setHoveredStatusIcon: (categoryId) => set({ hoveredStatusIcon: categoryId }),
      setShowMore: (showMore) => set({ showMore }),
      
      // Fetch documents from API
      fetchDocuments: async (userId = 'default') => {
        set({ isLoading: true, error: null });
        try {
          const documents = await documentService.getUserDocuments(userId);
          set({ documents, isLoading: false });
        } catch (error: any) {
          console.error('Error fetching documents:', error);
          set({ 
            error: error.message || 'Failed to fetch documents', 
            isLoading: false 
          });
        }
      },
      
      // Get documents for a specific category
      getDocumentsByCategory: (categoryId: string) => {
        const { documents } = get();
        return documents.filter(doc => doc.category_id === categoryId);
      },
      
      // Get status based on documents in category
      getCategoryStatus: (categoryId: string) => {
        const documents = get().getDocumentsByCategory(categoryId);
        if (documents.length === 0) return 'none';
        
        // Error has highest priority
        if (documents.some(doc => doc.status === 'error')) return 'error';
        
        // Warning next
        if (documents.some(doc => doc.status === 'warning')) return 'warning';
        
        // Only show approved if ALL are approved
        if (documents.every(doc => doc.status === 'approved')) {
          return 'approved';
        }
        
        // Otherwise, none
        return 'none';
      },
      
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
          for (const file of Array.from(files) as File[]) {
            await documentService.uploadFileToCategory(categoryId, file);
          }
          
          // Refresh documents from API
          await get().fetchDocuments();
          
          // Update local state with uploaded files
          const fileArray: File[] = Array.from(files);
          const newFiles = fileArray.map((file: File) => createUploadedFile(file));
          
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
      },
      
      deleteDocument: async (documentId: string) => {
        // Optimistically remove from local state
        const prevDocuments = get().documents;
        set({
          documents: prevDocuments.filter(doc => doc.id !== documentId),
          error: null
        });
        try {
          await documentService.deleteDocument(documentId);
        } catch (error: any) {
          // Restore previous state if error
          set({
            documents: prevDocuments,
            error: error.message || 'Failed to delete document'
          });
        }
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