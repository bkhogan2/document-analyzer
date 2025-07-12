export type DocumentStatus = 'none' | 'approved' | 'warning' | 'error';

export interface UploadedFile {
  name: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface DocumentCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<unknown>;
  selected: boolean;
  uploadedFiles: UploadedFile[];
  status: DocumentStatus;
} 