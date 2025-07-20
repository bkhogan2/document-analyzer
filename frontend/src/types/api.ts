// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface Document {
  id: string;
  user_id: string;
  category_id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  status: string;
  status_message?: string;
  created_at: string;
  updated_at?: string;
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