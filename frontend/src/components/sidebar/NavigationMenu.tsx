import React from 'react';

import type { NavItem } from '../../data/navigation';

import { SIDEBAR_STYLES } from './constants';
import { NavigationItem } from './NavigationItem';

interface NavigationMenuProps {
  items: NavItem[];
  onNavClick: () => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ 
  items, 
  onNavClick 
}) => (
  <div className={SIDEBAR_STYLES.container.navMenu}>
    <nav className={SIDEBAR_STYLES.container.navList}>
      {items.map((item) => (
        <NavigationItem 
          key={item.to || item.label} 
          item={item} 
          onNavClick={onNavClick} 
        />
      ))}
    </nav>
  </div>
); 