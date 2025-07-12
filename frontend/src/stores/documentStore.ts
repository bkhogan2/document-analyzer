import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DocumentCategory, DocumentStatus } from '../types/document';
import type { Document } from '../types/api';
import { sbaDocumentCategories } from '../data/documentCategories';
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
  uploadFiles: (categoryId: string, files: FileList | null) => Promise<{ anySuccess: boolean; errors: string[] }>;
  removeFile: (categoryId: string, fileName: string) => void;
  deleteDocument: (documentId: string) => Promise<void>;
  uploadFileToCategory: (categoryId: string, file: File) => Promise<void>;
  
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
        } catch (error: unknown) {
          console.error('Error fetching documents:', error);
          set({ 
            error: (error as Error)?.message || 'Failed to fetch documents', 
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
        if (!files || files.length === 0) return { anySuccess: false, errors: [] };
        let anySuccess = false;
        const errors: string[] = [];
        for (const file of Array.from(files) as File[]) {
          try {
            await documentService.uploadFileToCategory(categoryId, file);
            anySuccess = true;
          } catch (error: unknown) {
            const reason = (error as Error)?.message || 'Unknown error';
            errors.push(`Failed to upload: ${file.name} – ${reason}`);
          }
        }
        if (anySuccess) {
          await get().fetchDocuments();
        }
        return { anySuccess, errors };
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
        } catch (error: unknown) {
          // Restore previous state if error
          set({
            documents: prevDocuments,
            error: (error as Error)?.message || 'Failed to delete document'
          });
        }
      },
      
      uploadFileToCategory: async (categoryId: string, file: File) => {
        await documentService.uploadFileToCategory(categoryId, file);
      }
    }),
    {
      name: 'document-uploads',
      partialize: (state) => ({
        categories: state.categories.map(category => ({
          id: category.id,
          uploadedFiles: category.uploadedFiles,
          status: category.status
        })),
        documents: state.documents
      }),
      // Merge function to handle partial data
      merge: (persistedState: unknown, currentState: DocumentStore) => {
        if (
          persistedState &&
          typeof persistedState === 'object' &&
          'categories' in persistedState &&
          'documents' in persistedState
        ) {
          const ps = persistedState as { categories: DocumentCategory[]; documents: Document[] };
          return {
            ...currentState,
            categories: currentState.categories.map(category => {
              const persistedCategory = ps.categories.find(
                (p: DocumentCategory) => p.id === category.id
              );
              return {
                ...category,
                uploadedFiles: persistedCategory?.uploadedFiles || [],
                status: persistedCategory?.status || category.status
              };
            }),
            documents: ps.documents,
          };
        }
        return currentState;
      }
    }
  )
); 