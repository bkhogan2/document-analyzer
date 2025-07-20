import { ChevronLeft } from 'lucide-react';
import React from 'react';

import { Button } from '../ui';

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
      <Button 
        onClick={onBack}
        variant="text"
        className="flex items-center"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back
      </Button>
      <Button 
        onClick={onContinue}
        variant="primary"
      >
        {continueText}
      </Button>
    </div>
  );
}; 