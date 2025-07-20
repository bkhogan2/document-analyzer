import { Calculator, CreditCard, TrendingUp, FileText, Building2, Users } from 'lucide-react';

import type { DocumentCategory } from '../types/document';

export const sbaDocumentCategories: DocumentCategory[] = [
  { 
    id: 'balance-sheet', 
    title: 'Business Balance Sheet', 
    subtitle: '(Interim/YE)', 
    description: 'Upload your most recent business balance sheet. Accepted formats: PDF, Excel (.xlsx, .xls), or scanned images (.jpg, .png). Document should be dated within the last 90 days.',
    icon: Calculator, 
    selected: false,
    uploadedFiles: [],
    status: 'none'
  },
  { 
    id: 'debt-schedule', 
    title: 'Business Debt Schedule', 
    subtitle: '', 
    description: 'Provide a complete schedule of all business debts including creditor names, balances, monthly payments, and terms. Accepted formats: PDF, Excel, or Word documents.',
    icon: CreditCard, 
    selected: false,
    uploadedFiles: [],
    status: 'warning'
  },
  { 
    id: 'profit-loss', 
    title: 'Business Profit & Loss', 
    subtitle: '(Interim/YE)', 
    description: 'Submit your most recent profit and loss statement. Should include detailed revenue and expense categories for the current year or most recent fiscal year.',
    icon: TrendingUp, 
    selected: false,
    uploadedFiles: [],
    status: 'approved'
  },
  { 
    id: 'business-tax-returns', 
    title: 'Business Tax Returns', 
    subtitle: '(BTR)', 
    description: 'Upload complete business tax returns for the last 2-3 years including all schedules and attachments. Must be signed copies.',
    icon: FileText, 
    selected: false,
    uploadedFiles: [],
    status: 'none'
  },
  { 
    id: 'personal-tax-returns', 
    title: 'Personal Tax Returns', 
    subtitle: '(PTR)', 
    description: 'Provide personal tax returns for all business owners with 20% or greater ownership. Include all schedules and W-2s for the last 2 years.',
    icon: FileText, 
    selected: false,
    uploadedFiles: [],
    status: 'none'
  },
  { 
    id: 'project-costs', 
    title: 'Project Costs Documents', 
    subtitle: 'Working Capital/Start-Up Costs', 
    description: 'Detail all project-related costs including equipment purchases, renovation expenses, working capital needs, and startup costs. Include quotes and estimates.',
    icon: Building2, 
    selected: false,
    uploadedFiles: [],
    status: 'none'
  },
  { 
    id: 'personal-financial-statement', 
    title: 'SBA Form 413 Personal', 
    subtitle: 'Financial Statement (PFS)', 
    description: 'Complete SBA Form 413 for each business owner. Form must be fully completed, signed, and dated within 90 days of submission.',
    icon: Users, 
    selected: false,
    uploadedFiles: [],
    status: 'none'
  }
]; 