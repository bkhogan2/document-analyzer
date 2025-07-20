import React from 'react';
import { Stepper } from './Stepper';
import { useApplicationStore } from '../stores/applicationStore';
import { useNavigate, useParams } from 'react-router-dom';

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
    // Only allow clicking on completed sections or the current section
    const section = sections[sectionIndex];
    const canNavigate = section.isCompleted || sectionIndex === currentSectionIndex;
    
    if (canNavigate) {
      setCurrentSection(sectionIndex);
    }
    
    if (canNavigate && params.type && params.id) {
      // Find the first step in the selected section
      const section = sections[sectionIndex];
      if (section) {
        const firstStepInSection = currentApp?.steps.find(s => s.sectionId === section.id);
        if (firstStepInSection) {
          // Parse step ID like "owner-info-1" -> section: "owner-info", step: "1"
          const parts = firstStepInSection.id.split('-');
          const stepNumber = parts[parts.length - 1]; // Last part is the step number
          const sectionId = parts.slice(0, -1).join('-'); // Everything except last part is section
          navigate(`/applications/${params.type}/${params.id}/steps/${sectionId}/${stepNumber}`);
        } else {
          navigate(`/applications/${params.type}/${params.id}/steps`);
        }
      }
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