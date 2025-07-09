import React from 'react';
import { ChevronLeft, Search, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onBack?: () => void;
  onSearch?: () => void;
  onHelp?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onBack, 
  onSearch, 
  onHelp 
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onSearch}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </button>
          <button 
            onClick={onHelp}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            Help
          </button>
        </div>
      </div>
    </div>
  );
}; 