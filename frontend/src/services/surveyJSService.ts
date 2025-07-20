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
  navigate: (url: string, options?: { replace?: boolean }) => void
) {
  // Handle page changes to update URL and title
  model.onCurrentPageChanged.add((sender) => {
    const currentPage = sender.currentPageNo;
    const pageName = sender.pages[currentPage]?.name || 'welcome';
    
    // Update the main survey title to match the current page
    const pageTitle = sender.pages[currentPage]?.title || 'Welcome';
    sender.title = pageTitle;
    
    // Update URL with current page
    const newUrl = `/applications/${params.type}/${params.id}/steps?page=${pageName}`;
    navigate(newUrl, { replace: true });
  });
}

export function setupSurveyJSCompletion(model: Model, onComplete?: (data: Record<string, unknown>) => void) {
  model.onComplete.add((sender) => {
    console.log('Survey completed:', sender.data);
    if (onComplete) {
      onComplete(sender.data);
    }
  });
} 