import apiClient from './api';
import type { UploadResponse, UploadOptions, UploadProgress, Document } from '../types/api';

export class DocumentService {
  /**
   * Get all documents for a user
   */
  async getUserDocuments(userId: string = 'default'): Promise<Document[]> {
    try {
      const response = await apiClient.get<Document[]>(`/files/documents/${userId}`);
      return response.data;
    } catch (error: any) {
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
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: any) => {
        if (options?.onProgress && progressEvent.total) {
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
      const response = await apiClient.post<UploadResponse>(
        `/files/upload/${categoryId}`,
        formData,
        config
      );
      
      return response.data;
    } catch (error: any) {
      // Handle validation errors specifically
      if (error.response?.status === 400) {
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
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: any) => {
        if (options?.onProgress && progressEvent.total) {
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
      const response = await apiClient.post<UploadResponse>(
        '/files/upload',
        formData,
        config
      );
      
      return response.data;
    } catch (error: any) {
      // Handle validation errors specifically
      if (error.response?.status === 400) {
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
      await apiClient.delete(`/files/documents/${documentId}`);
    } catch (error: any) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const documentService = new DocumentService(); 