// API Response Types
export interface UploadResponse {
  message: string;
  filename: string;
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