import api from './api';
import type { DocumentUploadResponse, UploadOptions, UploadProgress, Document } from '../types/api';
import { AxiosError } from 'axios';

export class DocumentService {
  /**
   * Get all documents for a user
   */
  async getUserDocuments(userId: string = 'default'): Promise<Document[]> {
    try {
      const response = await api.get<Document[]>(`/files/documents/${userId}`);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  /**
   * Upload a file to a specific category
   */
  async uploadFileToCategory(
    categoryId: string, 
    file: File, 
    userId: string = 'default',
    options?: UploadOptions
  ): Promise<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: unknown) => {
        if (options?.onProgress && progressEvent instanceof ProgressEvent) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          };
          options.onProgress(progress);
        }
      },
    };

    try {
      const response = await api.post<DocumentUploadResponse>(
        `/files/upload/${categoryId}`,
        formData,
        config
      );
      
      return response.data;
    } catch (error: unknown) {
      // Handle validation errors specifically
      if (error instanceof AxiosError && error.response?.status === 400) {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          throw new Error(errorData);
        }
        if (errorData?.detail) {
          throw new Error(errorData.detail);
        }
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Upload a file for auto-classification
   */
  async uploadFileForClassification(
    file: File, 
    userId: string = 'default',
    options?: UploadOptions
  ): Promise<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: unknown) => {
        if (options?.onProgress && progressEvent instanceof ProgressEvent) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          };
          options.onProgress(progress);
        }
      },
    };

    try {
      const response = await api.post<DocumentUploadResponse>(
        '/files/upload',
        formData,
        config
      );
      
      return response.data;
    } catch (error: unknown) {
      // Handle validation errors specifically
      if (error instanceof AxiosError && error.response?.status === 400) {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          throw new Error(errorData);
        }
        if (errorData?.detail) {
          throw new Error(errorData.detail);
        }
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Delete a document by ID
   */
  async deleteDocument(documentId: string): Promise<void> {
    try {
      await api.delete(`/files/documents/${documentId}`);
    } catch (error: unknown) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const documentService = new DocumentService(); 