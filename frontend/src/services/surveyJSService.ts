import { Model , settings } from 'survey-core';

import { documentCollectionSurveyConfig } from '../data/documentCollectionSurvey';
import { 
  getSectionIndexFromPageName, 
  getSectionIdFromPageName, 
  getPageTitle
} from '../data/surveyPageConfig';
import { minimalTheme } from '../themes/minimalTheme';

// Global SurveyJS settings
settings.designMode.showEmptyDescriptions = false;

export interface SurveyJSConfig {
  showNavigationButtons?: boolean;
  showProgressBar?: boolean;
  showPageTitles?: boolean;
  showPageNumbers?: boolean;
  showQuestionNumbers?: boolean;
}

// Utility function to get page name by index
export function getSurveyPageNameByIndex(index: number): string {
  const pages = documentCollectionSurveyConfig.pages;
  return pages[index]?.name || 'welcome';
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

function checkPageCompletion(model: Model, pageIndex: number): boolean {
  const page = model.pages[pageIndex];
  if (!page) return false;
  
  // Get all questions on this page
  const questions = page.elements;
  
  // Check if all required questions have values
  for (const question of questions) {
    const isRequired = 'isRequired' in question ? (question as { isRequired: boolean }).isRequired : false;
    const hasValue = model.getValue(question.name);
    
    if (isRequired && !hasValue) {
      return false;
    }
  }
  
  return true;
}

export function setupSurveyJSNavigation(
  model: Model, 
  params: { type: string; id: string },
  navigate: (url: string, options?: { replace?: boolean }) => void,
  setCurrentSection?: (sectionIndex: number) => void,
  markSectionCompleted?: (sectionId: string, completed: boolean) => void,
  setFormData?: (step: string, data: Record<string, unknown>) => void
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

  // Handle value changes to track completion AND save data
  model.onValueChanged.add((sender, options) => {
    const currentPage = sender.currentPageNo;
    const pageName = sender.pages[currentPage]?.name || 'welcome';
    const sectionId = getSectionIdFromPageName(pageName);
    
    // Save data to application store if setFormData is provided
    if (setFormData && pageName && options.name) {
      // Get all data for the current page
      const pageData: Record<string, unknown> = {};
      const questions = sender.pages[currentPage].elements;
      
      for (const question of questions) {
        const value = sender.getValue(question.name);
        if (value !== undefined) {
          pageData[question.name] = value;
        }
      }
      
      // Save to application store
      setFormData(pageName, pageData);
    }
    
    // Check if current page is complete
    const isPageComplete = checkPageCompletion(sender, currentPage);
    
    // Update section completion status
    if (markSectionCompleted && isPageComplete) {
      markSectionCompleted(sectionId, true);
    }
  });
}

export function setupSurveyJSCompletion(model: Model, onComplete?: (data: Record<string, unknown>) => void) {
  model.onComplete.add((sender) => {
    if (onComplete) {
      onComplete(sender.data);
    }
  });
} 