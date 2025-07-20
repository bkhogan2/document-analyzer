import React from 'react';
import { useApplicationStore } from '../stores/applicationStore';
import type { ApplicationSection } from '../stores/applicationStore';

interface StepperProps {
  sections: ApplicationSection[];
  sectionProgress: number[]; // 0-1 for each section
  currentSection: number; // index of active section
  onSectionClick?: (sectionIndex: number) => void; // Optional click handler
}

export const Stepper: React.FC<StepperProps> = ({ 
  sections, 
  sectionProgress, 
  currentSection,
  onSectionClick 
}) => {
  const { setCurrentSection } = useApplicationStore();

  const handleSectionClick = (sectionIndex: number) => {
    // Always allow clicking on any section
    if (onSectionClick) {
      onSectionClick(sectionIndex);
    } else {
      setCurrentSection(sectionIndex);
    }
  };

  return (
    <div className="w-full px-8 pt-1 pb-1">
      {/* Segmented Progress Bar */}
      <div className="flex w-full h-1 gap-0.5">
        {sections.map((section, idx) => (
          <div
            key={section.id}
            className="bg-gray-200 rounded-[0.05rem] overflow-hidden"
            style={{ flexGrow: section.stepCount, minWidth: 0 }}
          >
            <div
              className="h-1 bg-green-500 rounded-[0.05rem] transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(1, sectionProgress[idx] ?? 0)) * 100}%` }}
            />
          </div>
        ))}
      </div>
      
      {/* Section Labels */}
      <div className="flex justify-between mt-0.5">
        {sections.map((section, idx) => {
          const isCurrent = idx === currentSection;
          
          return (
            <div
              key={section.id}
              className={`text-[10px] text-left font-normal transition-colors duration-200 ${
                isCurrent ? 'text-black font-semibold' : 'text-gray-500'
              } cursor-pointer hover:text-blue-600`}
              style={{ flex: section.stepCount }}
              onClick={() => handleSectionClick(idx)}
              title={`Click to go to ${section.label}`}
            >
              {section.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}; 