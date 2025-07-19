import React from 'react';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/survey-core.css';
import { ApplicationLayout } from '../components/ApplicationLayout';
import { minimalTheme } from '../themes/minimalTheme';

// Simple test survey configuration
const testSurveyConfig = {
  showQuestionNumbers: false,
  showProgressBar: false,
  showPageTitles: false,
  showPageNumbers: false,
  pageNextText: "Continue",
  pagePrevText: "‹ Back",
  completeText: "Submit",
  title: "Welcome to your SBA Loan Application",
  description: "This is a dedicated page for testing SurveyJS functionality with proper theming and navigation.",
  pages: [
    {
      name: "page1",
      title: "Page 1",
      description: "This is the first page",
      elements: [
        {
          type: "text",
          name: "name",
          title: "Full Name",
          isRequired: false,
          startWithNewLine: false,
          colCount: 2
        },
        {
          type: "text",
          name: "email",
          title: "Email Address",
          isRequired: false,
          startWithNewLine: false
        },
        {
          type: "text",
          name: "phone",
          title: "Phone Number",
          isRequired: false,
          startWithNewLine: true,
          colCount: 2
        },
        {
          type: "text",
          name: "address",
          title: "Street Address",
          isRequired: false,
          startWithNewLine: false
        }
      ]
    }
  ]
};

export default function SurveyJSTestPage() {
  const [survey] = React.useState(() => {
    const model = new Model(testSurveyConfig);
    
    // Apply minimal theme
    model.applyTheme(minimalTheme);
    
    // Disable SurveyJS navigation and create our own
    model.showNavigationButtons = false;
    model.showProgressBar = false;
    
    // Handle form completion
    model.onComplete.add((sender) => {
      console.log('Survey completed:', sender.data);
    });

    return model;
  });

  return (
    <ApplicationLayout>
      <div className="flex-1 px-8 pt-16 pb-12">
        <div>
                      <div className="bg-white rounded-lg mx-auto" style={{ maxWidth: '50rem' }}>
              <div>
                <Survey model={survey} />
              </div>
            {/* Custom footer */}
            <div className="border-t border-gray-200 bg-white mt-12 py-4">
              <div className="flex justify-between items-center max-w-2xl mx-auto">
                <button 
                  className="text-gray-600 hover:text-gray-800 font-medium"
                  onClick={() => console.log('Back clicked')}
                >
                  ‹ Back
                </button>
                <div className="flex gap-4">
                  <button 
                    className="border-2 border-green-500 text-green-500 px-3 py-1.5 rounded hover:bg-green-50 font-medium"
                    onClick={() => console.log('Skip for now clicked')}
                  >
                    Skip for now
                  </button>
                  <button 
                    className="bg-green-500 text-white px-5 py-1.5 rounded hover:bg-green-600 font-medium"
                    onClick={() => console.log('Continue clicked')}
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