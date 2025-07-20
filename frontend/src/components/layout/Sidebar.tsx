import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  logoUrl?: string;
}

const mainLinks = [
  {
    label: 'SBA Applications',
    to: '/applications/sba',
  },
];

const documentLibraryLinks = [
  {
    label: 'Current Document Collection',
    to: '/',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  logoUrl = "/public/ampac-large-logo.png" 
}) => {
  return (
    <div className="w-48 bg-gray-800 flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-28 p-4">
        <img 
          src={logoUrl} 
          alt="AMPAC Logo" 
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-2">
        <nav className="space-y-1">
          {mainLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }: { isActive: boolean }) =>
                `block px-3 py-2 text-xs font-medium transition-colors ${isActive ? 'text-white bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pl-2">
            <div className="text-gray-400 text-[11px] uppercase tracking-wide mb-1 mt-2">Document Library</div>
            {documentLibraryLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }: { isActive: boolean }) =>
                  `block px-3 py-2 text-xs font-medium transition-colors ${isActive ? 'text-white bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <a href="#" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 text-xs font-medium transition-colors">
            Loan Pipeline
          </a>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 p-3">
        <div className="space-y-2">
          <a href="#" className="block text-gray-300 hover:text-white text-xs transition-colors">
            Account Settings
          </a>
          <a href="#" className="block text-gray-300 hover:text-white text-xs transition-colors">
            Sign Out
          </a>
        </div>
      </div>
    </div>
  );
}; 