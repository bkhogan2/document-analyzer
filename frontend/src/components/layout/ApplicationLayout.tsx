import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getSurveyPageNames } from '../../data/surveyPageConfig';
import { useApplicationStore } from '../../stores/applicationStore';
import { Stepper } from '../ui';

export const ApplicationLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get current application state using stable selectors
  const currentApp = useApplicationStore(state => {
    const currentId = state.currentApplicationId;
    return currentId ? state.applications[currentId] : undefined;
  });
  
  const sections = currentApp?.sections || [];
  const currentSectionIndex = currentApp?.currentSectionIndex || 0;
  const sectionProgress = sections.map(s => s.progress);
  const { setCurrentSection } = useApplicationStore();
  const navigate = useNavigate();
  const params = useParams<{ type: string; id: string }>();

  const handleSectionClick = (sectionIndex: number) => {
    // Always allow navigation to any section
    setCurrentSection(sectionIndex);
    
    if (params.type && params.id) {
      // Use the survey page names directly from the config
      const surveyPageNames = getSurveyPageNames();
      const pageName = surveyPageNames[sectionIndex] || 'welcome';
      navigate(`/applications/${params.type}/${params.id}/steps?page=${pageName}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Persistent Stepper - only show when application is active */}
      <div className="sticky top-0 z-10 bg-white">
        <Stepper 
          sections={sections}
          sectionProgress={sectionProgress}
          currentSection={currentSectionIndex}
          onSectionClick={handleSectionClick}
        />
      </div>
      {/* Main content */}
      <div className="flex-1 bg-white">
        {children}
      </div>
    </div>
  );
}; 