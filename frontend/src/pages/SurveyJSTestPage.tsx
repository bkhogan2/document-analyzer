import React from 'react';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/survey-core.css';
import { ApplicationLayout } from '../components/ApplicationLayout';
import { minimalTheme } from '../themes/minimalTheme';
import { documentCollectionSurveyConfig } from '../data/documentCollectionSurvey';
import '../components/SurveyJSDocumentCollection'; // Register custom question type

// Use document collection survey configuration with navigation
const testSurveyConfig = documentCollectionSurveyConfig;

export default function SurveyJSTestPage() {
  const [survey] = React.useState(() => {
    const model = new Model(testSurveyConfig);
    
    // Apply minimal theme
    model.applyTheme(minimalTheme);
    
    // Disable SurveyJS navigation and use our custom footer
    model.showNavigationButtons = false;
    model.showProgressBar = false;
    
    // Handle form completion
    model.onComplete.add((sender) => {
      console.log('Survey completed:', sender.data);
    });

    return model;
  });

  // Navigation handlers
  const handleBack = () => {
    if (survey.currentPageNo > 0) {
      survey.prevPage();
    }
  };

  const handleContinue = () => {
    if (survey.currentPageNo < survey.pageCount - 1) {
      survey.nextPage();
    } else {
      survey.completeLastPage();
    }
  };

  const handleSkip = () => {
    // Skip to next page
    if (survey.currentPageNo < survey.pageCount - 1) {
      survey.nextPage();
    }
  };

  return (
    <ApplicationLayout>
      <div className="flex-1 px-8 pt-16 pb-12">
        <div>
                      <div className="bg-white rounded-lg mx-auto" style={{ maxWidth: '80rem' }}>
                          <div>
              <Survey model={survey} />
            </div>
            {/* Custom footer */}
            <div className="border-t border-gray-200 bg-white mt-12 py-4">
              <div className="flex justify-between items-center">
                <button 
                  className="text-gray-600 hover:text-gray-800 font-medium"
                  onClick={handleBack}
                >
                  ‹ Back
                </button>
                <div className="flex gap-4">
                  <button 
                    className="border-2 border-green-500 text-green-500 px-3 py-1.5 rounded hover:bg-green-50 font-medium"
                    onClick={handleSkip}
                  >
                    Skip for now
                  </button>
                  <button 
                    className="bg-green-500 text-white px-5 py-1.5 rounded hover:bg-green-600 font-medium"
                    onClick={handleContinue}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ApplicationLayout>
  );
} 