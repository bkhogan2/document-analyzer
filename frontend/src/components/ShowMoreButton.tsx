import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from './Button';

interface ShowMoreButtonProps {
  onClick: () => void;
  text?: string;
}

export const ShowMoreButton: React.FC<ShowMoreButtonProps> = ({ 
  onClick, 
  text = "Show more documents" 
}) => {
  return (
    <div className="text-center mb-8">
      <Button
        onClick={onClick}
        variant="text"
        className="inline-flex items-center font-medium text-green-600 hover:text-green-700"
      >
        {text}
        <ChevronDown className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}; 