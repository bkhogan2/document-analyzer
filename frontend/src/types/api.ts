// API Response Types
export interface UploadResponse {
  message: string;
  filename: string;
}

// Document Type
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