import { 
  Home, 
  FileText, 
  Briefcase, 
  Users, 
  BarChart3,
  ClipboardList,
  ArrowLeft
} from 'lucide-react';
import React from 'react';

import type { ApplicationType } from '../constants/applicationTypes';

// Types
export interface NavItem {
  label: string;
  to: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
  disabled?: boolean;
}

// Global navigation (for /applications and /documents)
export const GLOBAL_NAVIGATION: NavItem[] = [
  {
    label: 'All Applications',
    to: '/applications',
    icon: Briefcase,
  },
  {
    label: 'Document Library',
    to: '/documents',
    icon: FileText,
  },
  {
    label: 'Loan Pipeline',
    to: '',
    icon: BarChart3,
    disabled: true,
  },
];

// Application-specific navigation (when viewing a specific application)
export const getApplicationNavigation = (appType: ApplicationType, appId: string): NavItem[] => [
  {
    label: 'Back to Applications',
    to: '/applications',
    icon: ArrowLeft,
  },
  {
    label: 'Application Home',
    to: `/applications/${appType}/${appId}/home`,
    icon: Home,
  },
  {
    label: 'Document Collection',
    to: `/applications/${appType}/${appId}/steps?page=document-collection`,
    icon: FileText,
  },
  {
    label: 'Application Flow',
    to: `/applications/${appType}/${appId}/flow`,
    icon: ClipboardList,
    disabled: true,
  },
  {
    label: 'Team',
    to: `/applications/${appType}/${appId}/team`,
    icon: Users,
    disabled: true,
  },
]; 