export type DocumentStatus = 'none' | 'approved' | 'warning' | 'error';

export interface UploadedFile {
  name: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface DocumentCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  selected: boolean;
  uploadedFiles: UploadedFile[];
  status: DocumentStatus;
} 