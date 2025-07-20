import React from 'react';

import type { NavItem } from '../../data/navigation';

import { SIDEBAR_STYLES } from './constants';
import { SidebarNavLink } from './SidebarNavLink';

interface NavigationItemProps {
  item: NavItem;
  onNavClick: () => void;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({ 
  item, 
  onNavClick 
}) => {
  if (item.disabled) {
    return (
      <div className={`${SIDEBAR_STYLES.navItem.base} ${SIDEBAR_STYLES.navItem.disabled}`}>
        {item.icon && <item.icon className={SIDEBAR_STYLES.icon.nav} />}
        <span className="flex-1">{item.label}</span>
      </div>
    );
  }
  
  return (
    <SidebarNavLink
      to={item.to}
      onClick={onNavClick}
      icon={item.icon}
      badge={item.badge}
    >
      {item.label}
    </SidebarNavLink>
  );
}; 