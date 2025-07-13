import React from 'react';
import { Stepper } from './Stepper';
import { useApplicationStore } from '../stores/applicationStore';

export const ApplicationLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get current application state using stable selectors
  const currentApp = useApplicationStore(state => {
    const currentId = state.currentApplicationId;
    return currentId ? state.applications[currentId] : undefined;
  });
  
  const sections = currentApp?.sections || [];
  const currentSectionIndex = currentApp?.currentSectionIndex || 0;
  const sectionProgress = sections.map(s => s.progress);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Persistent Stepper - only show when application is active */}
      <div className="sticky top-0 z-10 bg-white">
        <Stepper 
          sections={sections}
          sectionProgress={sectionProgress}
          currentSection={currentSectionIndex}
          onSectionClick={() => {}}
        />
      </div>
      {/* Main content */}
      <div className="flex-1 bg-white">
        {children}
      </div>
    </div>
  );
}; 