import { Home, FileText, Briefcase, Settings } from 'lucide-react';
import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

import type { ApplicationType } from '../../constants/applicationTypes';

export const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const params = useParams<{ type?: ApplicationType; id?: string }>();
  const navigate = useNavigate();

  const isApplicationContext = location.pathname.startsWith('/applications/') && params.type && params.id;

  // Quick navigation items for mobile
  const getQuickNavItems = () => {
    if (isApplicationContext && params.type && params.id) {
      return [
        {
          label: 'Home',
          icon: Home,
          onClick: () => navigate(`/applications/${params.type}/${params.id}/home`),
          active: location.pathname.includes('/home')
        },
        {
          label: 'Documents',
          icon: FileText,
          onClick: () => navigate(`/applications/${params.type}/${params.id}/documents`),
          active: location.pathname.includes('/documents')
        },
        {
          label: 'Applications',
          icon: Briefcase,
          onClick: () => navigate('/applications'),
          active: false
        },
        {
          label: 'Settings',
          icon: Settings,
          onClick: () => navigate('/settings'),
          active: false
        }
      ];
    } else {
      return [
        {
          label: 'Applications',
          icon: Briefcase,
          onClick: () => navigate('/applications'),
          active: location.pathname.includes('/applications')
        },
        {
          label: 'Documents',
          icon: FileText,
          onClick: () => navigate('/documents'),
          active: location.pathname.includes('/documents')
        },
        {
          label: 'Settings',
          icon: Settings,
          onClick: () => navigate('/settings'),
          active: false
        }
      ];
    }
  };

  const quickNavItems = getQuickNavItems();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
      <div className="flex items-center justify-around py-2">
        {quickNavItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`flex flex-col items-center p-2 text-xs transition-colors ${
                item.active 
                  ? 'text-green-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <IconComponent className="w-5 h-5 mb-1" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}; 