import type { DocumentCategory } from '../types/document';
import { Calculator, CreditCard, TrendingUp, FileText, Building2, Users, Banknote } from 'lucide-react';

export const sbaDocumentCategories: DocumentCategory[] = [
  { 
    id: 'balance-sheet', 
    title: 'Business Balance Sheet', 
    subtitle: '(Interim/YE)', 
    icon: Calculator, 
    selected: false,
    uploadedFiles: [],
    status: 'none'
  },
  { 
    id: 'debt-schedule', 
    title: 'Business Debt Schedule', 
    subtitle: '', 
    icon: CreditCard, 
    selected: false,
    uploadedFiles: [],
    status: 'warning'
  },
  { 
    id: 'profit-loss', 
    title: 'Business Profit & Loss', 
    subtitle: '(Interim/YE)', 
    icon: TrendingUp, 
    selected: false,
    uploadedFiles: [],
    status: 'approved'
  },
  { 
    id: 'business-tax-returns', 
    title: 'Business Tax Returns', 
    subtitle: '(BTR)', 
    icon: FileText, 
    selected: false,
    uploadedFiles: [],
    status: 'none'
  },
  { 
    id: 'personal-tax-returns', 
    title: 'Personal Tax Returns', 
    subtitle: '(PTR)', 
    icon: FileText, 
    selected: false,
    uploadedFiles: [],
    status: 'none'
  },
  { 
    id: 'project-costs', 
    title: 'Project Costs Documents', 
    subtitle: 'Working Capital/Start-Up Costs', 
    icon: Building2, 
    selected: false,
    uploadedFiles: [],
    status: 'none'
  },
  { 
    id: 'personal-financial-statement', 
    title: 'SBA Form 413 Personal', 
    subtitle: 'Financial Statement (PFS)', 
    icon: Users, 
    selected: false,
    uploadedFiles: [],
    status: 'none'
  }
]; 