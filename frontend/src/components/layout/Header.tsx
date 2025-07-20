import { Search, HelpCircle, Menu } from 'lucide-react';
import React from 'react';

import { Button, BackButton } from '../ui';

interface HeaderProps {
  onSearch?: () => void;
  onHelp?: () => void;
  onMobileMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  onHelp,
  onMobileMenuToggle
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <BackButton />
        </div>
        <div className="flex items-center space-x-2 lg:space-x-4">
          <Button 
            onClick={onSearch}
            variant="text"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <Search className="w-5 h-5 mr-2" />
            <span className="hidden lg:inline">Search</span>
          </Button>
          <Button 
            onClick={onHelp}
            variant="text"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            <span className="hidden lg:inline">Help</span>
          </Button>
        </div>
      </div>
    </div>
  );
}; 