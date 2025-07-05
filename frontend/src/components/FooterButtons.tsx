import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface FooterButtonsProps {
  onBack?: () => void;
  onContinue?: () => void;
  continueText?: string;
}

export const FooterButtons: React.FC<FooterButtonsProps> = ({ 
  onBack, 
  onContinue, 
  continueText = "Continue to Review" 
}) => {
  return (
    <div className="flex justify-between items-center">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back
      </button>
      <button 
        onClick={onContinue}
        className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
      >
        {continueText}
      </button>
    </div>
  );
}; 