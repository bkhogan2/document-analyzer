// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface Document {
  id: string;
  name: string;
  category_id: string;
  file_path: string;
  status: string;
  uploaded_at: string;
  file_size: number;
  mime_type: string;
}

export interface DocumentUploadResponse {
  document_id: string;
  message: string;
  success: boolean;
}

export interface DocumentDeleteResponse {
  message: string;
  success: boolean;
}

// Shared component types
export interface StepRef {
  submitForm: () => void;
}

// API Error Types
export interface ApiError {
  detail: string;
}

// Upload Progress Type
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Upload Options
export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  onCancel?: () => void;
} 