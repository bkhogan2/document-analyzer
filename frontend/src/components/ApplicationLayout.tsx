import React from 'react';
import { useApplicationStore } from '../stores/applicationStore';
import { Stepper } from './Stepper';
import { useNavigate, useLocation } from 'react-router-dom';

interface ApplicationLayoutProps {
  children: React.ReactNode;
}

export const ApplicationLayout: React.FC<ApplicationLayoutProps> = ({ children }) => {
  const { 
    applicationId, 
    sections, 
    currentSectionIndex,
    setCurrentSection
  } = useApplicationStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Only show stepper if we have an active application
  const hasActiveApplication = applicationId !== null;

  // Calculate section progress for the stepper
  const sectionProgress = sections.map(section => section.progress);

  // Handler for clicking a section in the stepper
  const handleSectionClick = (sectionIndex: number) => {
    setCurrentSection(sectionIndex);
    // If not already on the wizard, navigate to it
    if (!location.pathname.includes('/applications/new')) {
      navigate('/applications/new');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Persistent Stepper - only show when application is active */}
      {hasActiveApplication && (
        <div className="sticky top-0 z-10 bg-white">
          <Stepper 
            sections={sections}
            sectionProgress={sectionProgress}
            currentSection={currentSectionIndex}
            onSectionClick={handleSectionClick}
          />
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}; 