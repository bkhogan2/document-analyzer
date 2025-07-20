import React from 'react';
import { NavLink } from 'react-router-dom';

import { SIDEBAR_STYLES } from './constants';

interface SidebarNavLinkProps {
  to: string;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  badge?: string;
  className?: string;
}

export const SidebarNavLink: React.FC<SidebarNavLinkProps> = ({
  to,
  onClick,
  icon: IconComponent,
  children,
  badge,
  className = ''
}) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }: { isActive: boolean }) =>
      `${SIDEBAR_STYLES.navItem.base} ${
        isActive 
          ? SIDEBAR_STYLES.navItem.active 
          : SIDEBAR_STYLES.navItem.inactive
      } ${className}`
    }
  >
    {IconComponent && <IconComponent className={SIDEBAR_STYLES.icon.nav} />}
    <span className="flex-1">{children}</span>
    {badge && (
      <span className={SIDEBAR_STYLES.badge}>
        {badge}
      </span>
    )}
  </NavLink>
); 