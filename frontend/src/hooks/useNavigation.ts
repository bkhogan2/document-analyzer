import { useLocation, useParams } from 'react-router-dom';

import type { ApplicationType } from '../constants/applicationTypes';
import { GLOBAL_NAVIGATION, getApplicationNavigation, type NavItem } from '../data/navigation';

export const useNavigation = () => {
  const location = useLocation();
  const params = useParams<{ type?: ApplicationType; id?: string }>();
  
  const getCurrentNavigation = (): NavItem[] => {
    const pathname = location.pathname;
    
    // Application-specific context
    if (pathname.startsWith('/applications/') && params.type && params.id) {
      return getApplicationNavigation(params.type, params.id);
    }
    
    // Global context
    if (
      pathname === '/applications' ||
      pathname === '/applications/' ||
      (pathname.startsWith('/applications') && !params.id) ||
      pathname === '/documents' ||
      pathname === '/'
    ) {
      return GLOBAL_NAVIGATION;
    }
    
    return GLOBAL_NAVIGATION;
  };
  
  const isApplicationContext = location.pathname.startsWith('/applications/') && params.type && params.id;
  
  return {
    currentNavigation: getCurrentNavigation(),
    isApplicationContext,
    appType: params.type,
    appId: params.id
  };
}; 