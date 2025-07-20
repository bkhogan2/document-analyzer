import { Model } from 'survey-core';
import { minimalTheme } from '../themes/minimalTheme';
import { documentCollectionSurveyConfig } from '../data/documentCollectionSurvey';

// Global SurveyJS settings
import { settings } from 'survey-core';
settings.designMode.showEmptyDescriptions = false;

export interface SurveyJSConfig {
  showNavigationButtons?: boolean;
  showProgressBar?: boolean;
  showPageTitles?: boolean;
  showPageNumbers?: boolean;
  showQuestionNumbers?: boolean;
}

// Utility function to get page names from survey config
export function getSurveyPageNames(): string[] {
  return documentCollectionSurveyConfig.pages.map(page => page.name);
}

// Utility function to get page name by index
export function getSurveyPageNameByIndex(index: number): string {
  const pages = documentCollectionSurveyConfig.pages;
  return pages[index]?.name || 'welcome';
}

// Utility function to get section index from page name
export function getSectionIndexFromPageName(pageName: string): number {
  const pageToSectionMap: Record<string, number> = {
    'welcome': 0,
    'loan-information': 1,
    'business-info': 2,
    'owner-information': 3,
    'certification': 4,
    'pre-screen-questions': 5,
    'document-collection': 6,
    'review': 7
  };
  return pageToSectionMap[pageName] || 0;
}

// Utility function to get section ID from page name
export function getSectionIdFromPageName(pageName: string): string {
  const pageToSectionMap: Record<string, string> = {
    'welcome': 'welcome',
    'loan-information': 'loan-info',
    'business-info': 'business-info',
    'owner-information': 'owner-info',
    'certification': 'certification',
    'pre-screen-questions': 'pre-screen',
    'document-collection': 'document-collection',
    'review': 'review'
  };
  return pageToSectionMap[pageName] || 'welcome';
}

export function createSurveyJSModel(config: SurveyJSConfig = {}) {
  const model = new Model(documentCollectionSurveyConfig);
  
  // Apply minimal theme
  model.applyTheme(minimalTheme);
  
  // Apply configuration
  model.showNavigationButtons = config.showNavigationButtons ?? false;
  model.showProgressBar = config.showProgressBar ?? false;
  model.showPageTitles = config.showPageTitles ?? false;
  model.showPageNumbers = config.showPageNumbers ?? false;
  model.showQuestionNumbers = config.showQuestionNumbers ?? false;
  
  return model;
}

export function setupSurveyJSNavigation(
  model: Model, 
  params: { type: string; id: string },
  navigate: (url: string, options?: { replace?: boolean }) => void,
  setCurrentSection?: (sectionIndex: number) => void,
  markSectionCompleted?: (sectionId: string, completed: boolean) => void
) {
  // Handle page changes to update URL and title
  model.onCurrentPageChanged.add((sender) => {
    const currentPage = sender.currentPageNo;
    const pageName = sender.pages[currentPage]?.name || 'welcome';
    
    // Update the main survey title to match the current page
    const pageTitle = getPageTitle(pageName);
    sender.title = pageTitle;
    
    // Update the current section in the application store
    if (setCurrentSection) {
      const sectionIndex = getSectionIndexFromPageName(pageName);
      setCurrentSection(sectionIndex);
    }
    
    // Update URL with current page
    const newUrl = `/applications/${params.type}/${params.id}/steps?page=${pageName}`;
    navigate(newUrl, { replace: true });
  });

  // Handle value changes to track completion
  model.onValueChanged.add((sender) => {
    const currentPage = sender.currentPageNo;
    const pageName = sender.pages[currentPage]?.name || 'welcome';
    const sectionId = getSectionIdFromPageName(pageName);
    
    console.log('[SurveyJS] Value changed:', { pageName, sectionId, currentPage });
    
    // Check if current page is complete
    const isPageComplete = checkPageCompletion(sender, currentPage);
    
    console.log('[SurveyJS] Page complete:', { isPageComplete, pageName });
    
    // Update section completion status
    if (markSectionCompleted && isPageComplete) {
      console.log('[SurveyJS] Marking section completed:', sectionId);
      markSectionCompleted(sectionId, true);
    }
  });
}

function checkPageCompletion(model: Model, pageIndex: number): boolean {
  const page = model.pages[pageIndex];
  if (!page) return false;
  
  console.log('[SurveyJS] Checking completion for page:', pageIndex, page.name);
  
  // Get all questions on this page
  const questions = page.elements;
  
  console.log('[SurveyJS] Questions on page:', questions.length);
  
  // Check if all required questions have values
  for (const question of questions) {
    const isRequired = 'isRequired' in question ? (question as { isRequired: boolean }).isRequired : false;
    const hasValue = model.getValue(question.name);
    
    console.log('[SurveyJS] Question:', question.name, { isRequired, hasValue });
    
    if (isRequired && !hasValue) {
      console.log('[SurveyJS] Required field missing:', question.name);
      return false;
    }
  }
  
  console.log('[SurveyJS] Page is complete!');
  return true;
}

function getPageTitle(pageName: string): string {
  const titleMap: Record<string, string> = {
    'welcome': 'Welcome',
    'loan-information': 'Loan Information',
    'business-info': 'Business Information',
    'owner-information': 'Owner Information',
    'certification': 'Certification',
    'pre-screen-questions': 'Pre-Screen Questions',
    'document-collection': 'Document Collection',
    'review': 'Review Application'
  };
  
  return titleMap[pageName] || 'Welcome';
}

export function setupSurveyJSCompletion(model: Model, onComplete?: (data: Record<string, unknown>) => void) {
  model.onComplete.add((sender) => {
    console.log('Survey completed:', sender.data);
    if (onComplete) {
      onComplete(sender.data);
    }
  });
} 