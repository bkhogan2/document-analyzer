// Survey page configuration - can be loaded from backend in the future
export interface SurveyPageConfig {
  sectionIndex: number;
  sectionId: string;
  title: string;
  description?: string;
  isRequired?: boolean;
}

export const SURVEY_PAGE_CONFIG: Record<string, SurveyPageConfig> = {
  'welcome': {
    sectionIndex: 0,
    sectionId: 'welcome',
    title: 'Welcome',
    description: 'Please provide your contact information to get started.',
    isRequired: true
  },
  'loan-information': {
    sectionIndex: 1,
    sectionId: 'loan-info',
    title: 'Loan Information',
    description: 'Tell us about your loan requirements.',
    isRequired: true
  },
  'business-info': {
    sectionIndex: 2,
    sectionId: 'business-info',
    title: 'Business Information',
    description: 'Provide details about your business.',
    isRequired: true
  },
  'owner-information': {
    sectionIndex: 3,
    sectionId: 'owner-info',
    title: 'Owner Information',
    description: 'Information about business owners and stakeholders.',
    isRequired: true
  },
  'certification': {
    sectionIndex: 4,
    sectionId: 'certification',
    title: 'Certification',
    description: 'Certify the accuracy of your application.',
    isRequired: true
  },
  'pre-screen-questions': {
    sectionIndex: 5,
    sectionId: 'pre-screen',
    title: 'Pre-Screen Questions',
    description: 'Answer eligibility questions.',
    isRequired: true
  },
  'document-collection': {
    sectionIndex: 6,
    sectionId: 'document-collection',
    title: 'Document Collection',
    description: 'Upload required documents.',
    isRequired: true
  },
  'review': {
    sectionIndex: 7,
    sectionId: 'review',
    title: 'Review Application',
    description: 'Review and submit your application.',
    isRequired: true
  }
} as const;

// Utility functions for accessing page config
export function getPageConfig(pageName: string): SurveyPageConfig | undefined {
  return SURVEY_PAGE_CONFIG[pageName];
}

export function getSectionIndexFromPageName(pageName: string): number {
  return SURVEY_PAGE_CONFIG[pageName]?.sectionIndex || 0;
}

export function getSectionIdFromPageName(pageName: string): string {
  return SURVEY_PAGE_CONFIG[pageName]?.sectionId || 'welcome';
}

export function getPageTitle(pageName: string): string {
  return SURVEY_PAGE_CONFIG[pageName]?.title || 'Welcome';
}

export function getPageDescription(pageName: string): string | undefined {
  return SURVEY_PAGE_CONFIG[pageName]?.description;
}

export function isPageRequired(pageName: string): boolean {
  return SURVEY_PAGE_CONFIG[pageName]?.isRequired ?? true;
}

// Get all page names for navigation
export function getSurveyPageNames(): string[] {
  return Object.keys(SURVEY_PAGE_CONFIG);
}

// Future: Load config from backend
export async function loadSurveyPageConfig(): Promise<Record<string, SurveyPageConfig>> {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/survey-config');
  // return response.json();
  
  // For now, return the static config
  return SURVEY_PAGE_CONFIG;
} 