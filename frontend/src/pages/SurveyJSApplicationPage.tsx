import React from 'react';
import { Survey } from 'survey-react-ui';
import 'survey-core/survey-core.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createSurveyJSModel, setupSurveyJSNavigation, setupSurveyJSCompletion } from '../services/surveyJSService';
import { Breadcrumbs } from '../components/Breadcrumbs';
import '../components/SurveyJSDocumentCollection'; // Import to register the custom component

export default function SurveyJSApplicationPage() {
  const params = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [survey] = React.useState(() => {
    const model = createSurveyJSModel({
      showNavigationButtons: false,
      showProgressBar: false,
      showPageTitles: false,
    });
    
    // Setup navigation (only if params are available)
    if (params.type && params.id) {
      setupSurveyJSNavigation(model, { type: params.type, id: params.id }, navigate);
    }
    
    // Setup completion handler
    setupSurveyJSCompletion(model, (data) => {
      // TODO: Handle survey completion - save data, navigate to next step, etc.
      console.log('Survey data:', data);
    });

    return model;
  });

  // Set initial page from URL parameter
  React.useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const pageParam = urlParams.get('page');
    
    if (pageParam) {
      const pageIndex = survey.pages.findIndex(page => page.name === pageParam);
      if (pageIndex !== -1 && pageIndex !== survey.currentPageNo) {
        survey.currentPageNo = pageIndex;
      }
    }
  }, [survey, location.search]);

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
    <div className="flex-1 px-8 pt-16 pb-12">
      <div>
        <div className="bg-white rounded-lg mx-auto" style={{ maxWidth: '80rem' }}>
          <Breadcrumbs />
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
  );
} 