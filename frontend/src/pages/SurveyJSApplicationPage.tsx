import React from 'react';
import { Survey } from 'survey-react-ui';
import 'survey-core/survey-core.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createSurveyJSModel, setupSurveyJSNavigation, setupSurveyJSCompletion } from '../services/surveyJSService';
import { Breadcrumbs } from '../components/Breadcrumbs';
import '../components/SurveyJSDocumentCollection'; // Import to register the custom component
import { useApplicationStore } from '../stores/applicationStore';

export default function SurveyJSApplicationPage() {
  const params = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentSection, markSectionCompleted, setFormData, selectApplication } = useApplicationStore();
  
  // Get current application to access form data
  const currentApp = useApplicationStore(state => {
    const currentId = state.currentApplicationId;
    return currentId ? state.applications[currentId] : undefined;
  });
  
  // Helper function to get form data for a specific step
  const getFormData = (step: string): Record<string, unknown> => {
    if (!currentApp?.formData) return {};
    return (currentApp.formData[step] as Record<string, unknown>) || {};
  };
  
  // Ensure application is selected when component mounts
  React.useEffect(() => {
    if (params.id && params.type) {
      selectApplication(params.id, params.type);
    }
  }, [params.id, params.type, selectApplication]);
  
  const [survey] = React.useState(() => {
    const model = createSurveyJSModel({
      showNavigationButtons: false,
      showProgressBar: false,
      showPageTitles: false,
    });
    
    // Setup navigation (only if params are available)
    if (params.type && params.id) {
      setupSurveyJSNavigation(model, { type: params.type, id: params.id }, navigate, setCurrentSection, markSectionCompleted, setFormData);
    }
    
    // Setup completion handler
    setupSurveyJSCompletion(model, () => {
      // TODO: Handle survey completion - save data, navigate to next step, etc.
    });

    return model;
  });

  // Load existing data when survey is ready
  React.useEffect(() => {
    if (survey && currentApp?.formData) {
      // Collect all data from all pages
      const allData: Record<string, unknown> = {};
      const pages = survey.pages;
      pages.forEach((page: { name: string }) => {
        const stepData = getFormData(page.name);
        if (stepData && Object.keys(stepData).length > 0) {
          // Merge data from this page
          Object.assign(allData, stepData);
        }
      });
      
      // Set all data at once using SurveyJS's built-in mechanism
      if (Object.keys(allData).length > 0) {
        survey.data = allData;
      }
    }
  }, [survey, currentApp?.formData, getFormData]);

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
      // The section will be updated by the onCurrentPageChanged event
    }
  };

  const handleContinue = () => {
    if (survey.currentPageNo < survey.pageCount - 1) {
      survey.nextPage();
      // The section will be updated by the onCurrentPageChanged event
    } else {
      survey.completeLastPage();
    }
  };

  const handleSkip = () => {
    // Skip to next page
    if (survey.currentPageNo < survey.pageCount - 1) {
      survey.nextPage();
      // The section will be updated by the onCurrentPageChanged event
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