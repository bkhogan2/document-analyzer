import { LogOut, Settings } from 'lucide-react';
import React from 'react';

import { SIDEBAR_STYLES } from './constants';
import { SidebarNavLink } from './SidebarNavLink';

interface BottomSectionProps {
  onNavClick: () => void;
}

const SignOutButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button 
    className={`${SIDEBAR_STYLES.button.nav} w-full`}
    onClick={onClick}
  >
    <LogOut className={SIDEBAR_STYLES.icon.small} />
    Sign Out
  </button>
);

export const BottomSection: React.FC<BottomSectionProps> = ({ onNavClick }) => (
  <div className={SIDEBAR_STYLES.container.bottom}>
    <div className={SIDEBAR_STYLES.container.bottomList}>
      <SidebarNavLink
        to="/settings"
        onClick={onNavClick}
        icon={Settings}
        className={SIDEBAR_STYLES.button.nav}
      >
        Account Settings
      </SidebarNavLink>
      <SignOutButton onClick={onNavClick} />
    </div>
  </div>
); 