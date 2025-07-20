import { X } from 'lucide-react';
import React from 'react';

import { SIDEBAR_STYLES } from './constants';

interface LogoProps {
  logoUrl: string;
  className?: string;
}

const MobileLogo: React.FC<LogoProps> = ({ logoUrl, className }) => (
  <img 
    src={logoUrl} 
    alt="AMPAC Logo" 
    className={`${SIDEBAR_STYLES.logo.mobile} ${className || ''}`}
  />
);

const DesktopLogo: React.FC<LogoProps> = ({ logoUrl, className }) => (
  <img 
    src={logoUrl} 
    alt="AMPAC Logo" 
    className={`${SIDEBAR_STYLES.logo.desktop} ${className || ''}`}
  />
);

const CloseButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className={SIDEBAR_STYLES.button.close}
  >
    <X className="w-6 h-6" />
  </button>
);

interface SidebarLogoProps {
  logoUrl: string;
  onMobileToggle?: () => void;
}

export const SidebarLogo: React.FC<SidebarLogoProps> = ({ 
  logoUrl, 
  onMobileToggle 
}) => (
  <>
    {/* Mobile header */}
    <div className="flex items-center justify-between p-4 lg:hidden">
      <MobileLogo logoUrl={logoUrl} />
      <CloseButton onClick={onMobileToggle} />
    </div>

    {/* Desktop logo */}
    <div className="hidden lg:flex items-center justify-center h-28 p-4">
      <DesktopLogo logoUrl={logoUrl} />
    </div>
  </>
); 