import React from 'react';

interface StepperSection {
  label: string;
  stepCount: number;
}

interface StepperProps {
  sections: StepperSection[];
  sectionProgress: number[]; // 0-1 for each section
  currentSection: number; // index of active section
}

export const Stepper: React.FC<StepperProps> = ({ sections, sectionProgress, currentSection }) => {
  return (
    <div className="w-full px-8 pt-1 pb-1 bg-gray-50">
      {/* Segmented Progress Bar */}
      <div className="flex w-full h-1 gap-0.5">
        {sections.map((section, idx) => (
          <div
            key={section.label}
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
        {sections.map((section, idx) => (
          <div
            key={section.label}
            className={`text-[10px] text-left font-normal ${
              idx === currentSection ? 'text-black font-semibold' : 'text-gray-500'
            }`}
            style={{ flex: section.stepCount }}
          >
            {section.label}
          </div>
        ))}
      </div>
    </div>
  );
}; 