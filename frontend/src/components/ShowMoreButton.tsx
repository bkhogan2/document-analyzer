import React from 'react';
import { ChevronDown } from 'lucide-react';

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
      <button
        onClick={onClick}
        className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors"
      >
        {text}
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
}; 