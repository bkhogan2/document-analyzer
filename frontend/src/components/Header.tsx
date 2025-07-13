import React from 'react';
import { Search, HelpCircle } from 'lucide-react';
import { Button } from './Button';
import { BackButton } from './BackButton';

interface HeaderProps {
  onSearch?: () => void;
  onHelp?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  onHelp 
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <BackButton />
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={onSearch}
            variant="text"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
          <Button 
            onClick={onHelp}
            variant="text"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            Help
          </Button>
        </div>
      </div>
    </div>
  );
}; 