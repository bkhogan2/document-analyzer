import React from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut,
  ArrowLeft,
  BarChart3,
  ClipboardList
} from 'lucide-react';

import type { ApplicationType } from '../constants/applicationTypes';

interface SidebarProps {
  logoUrl?: string;
}

// Navigation item interface
interface NavItem {
  label: string;
  to: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
  disabled?: boolean; // Added disabled property
}

// Global navigation (for /applications and /documents)
const globalNavigation: NavItem[] = [
  {
    label: 'All Applications',
    to: '/applications',
    icon: Briefcase,
  },
  {
    label: 'Document Library',
    to: '/documents',
    icon: FileText,
  },
  {
    label: 'Loan Pipeline',
    to: '', // Dud link
    icon: BarChart3,
    disabled: true,
  },
];

// Application-specific navigation (when viewing a specific application)
const getApplicationNavigation = (appType: ApplicationType, appId: string): NavItem[] => [
  {
    label: 'Back to Applications',
    to: '/applications',
    icon: ArrowLeft,
  },
  {
    label: 'Application Home',
    to: `/applications/${appType}/${appId}/home`,
    icon: Home,
    // enabled
  },
  {
    label: 'Document Collection',
    to: `/applications/${appType}/${appId}/documents`,
    icon: FileText,
    // enabled
  },
  {
    label: 'Application Flow',
    to: `/applications/${appType}/${appId}/flow`,
    icon: ClipboardList,
    disabled: true,
  },
  {
    label: 'Team',
    to: `/applications/${appType}/${appId}/team`,
    icon: Users,
    disabled: true,
  },
];

export const DynamicSidebar: React.FC<SidebarProps> = ({ 
  logoUrl = "/public/ampac-large-logo.png" 
}) => {
  const location = useLocation();
  const params = useParams<{ type?: ApplicationType; id?: string }>();
  
  // Determine current context and navigation
  const getCurrentNavigation = (): NavItem[] => {
    const pathname = location.pathname;
    // Application-specific context
    if (pathname.startsWith('/applications/') && params.type && params.id) {
      return getApplicationNavigation(params.type, params.id);
    }
    // Global context: /applications or /documents
    if (
      pathname === '/applications' ||
      pathname === '/applications/' ||
      pathname.startsWith('/applications') && !params.id ||
      pathname === '/documents'
    ) {
      return globalNavigation;
    }
    // Document collection context (root page) - this is the SBA application
    if (pathname === '/') {
      return globalNavigation;
    }
    // Default global navigation
    return globalNavigation;
  };

  const currentNavigation = getCurrentNavigation();
  const isApplicationContext = location.pathname.startsWith('/applications/') && params.type && params.id;

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

      {/* Context Indicator */}
      {isApplicationContext && params.type && params.id && (
        <div className="px-3 py-2 border-b border-gray-700">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            {params.type.toUpperCase()} Application
          </div>
          <div className="text-xs text-gray-300 font-medium truncate">
            {params.id}
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <div className="flex-1 py-2">
        <nav className="space-y-1">
          {currentNavigation.map((item) => {
            const IconComponent = item.icon;
            if (item.disabled) {
              return (
                <div
                  key={item.label}
                  className="flex items-center px-3 py-2 text-xs font-medium text-gray-500 opacity-50 cursor-not-allowed select-none"
                >
                  {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                  <span className="flex-1">{item.label}</span>
                </div>
              );
            }
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center px-3 py-2 text-xs font-medium transition-colors ${
                    isActive 
                      ? 'text-white bg-gray-700' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`
                }
              >
                {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 p-3">
        <div className="space-y-2">
          <NavLink
            to="/settings"
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center text-gray-300 hover:text-white text-xs transition-colors ${
                isActive ? 'text-white' : ''
              }`
            }
          >
            <Settings className="w-3 h-3 mr-2" />
            Account Settings
          </NavLink>
          <button className="flex items-center text-gray-300 hover:text-white text-xs transition-colors w-full">
            <LogOut className="w-3 h-3 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}; 