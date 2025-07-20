import React from 'react';

import { useNavigation } from '../../hooks/useNavigation';
import {
  BottomSection,
  ContextIndicator,
  MobileOverlay,
  NavigationMenu,
  SidebarLogo
} from '../sidebar';

interface SidebarProps {
  logoUrl?: string;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  logoUrl = "/public/ampac-large-logo.png",
  isMobileOpen = false,
  onMobileToggle
}) => {
  const { currentNavigation, isApplicationContext, appType, appId } = useNavigation();
  
  const handleNavClick = () => {
    if (onMobileToggle) {
      onMobileToggle();
    }
  };

  return (
    <>
      <MobileOverlay isOpen={isMobileOpen} onClose={onMobileToggle || (() => {})} />
      
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-800 flex flex-col transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <SidebarLogo logoUrl={logoUrl} onMobileToggle={onMobileToggle} />
        
        {isApplicationContext && (
          <ContextIndicator appType={appType} appId={appId} />
        )}
        
        <NavigationMenu items={currentNavigation} onNavClick={handleNavClick} />
        
        <BottomSection onNavClick={handleNavClick} />
      </div>
    </>
  );
}; 