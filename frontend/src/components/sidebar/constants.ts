// Common styling classes for sidebar components
export const SIDEBAR_STYLES = {
  // Navigation item styles
  navItem: {
    base: 'flex items-center px-3 py-2 text-xs font-medium transition-colors',
    active: 'text-white bg-gray-700',
    inactive: 'text-gray-300 hover:text-white hover:bg-gray-700',
    disabled: 'text-gray-500 opacity-50 cursor-not-allowed select-none'
  },
  
  // Icon styles
  icon: {
    nav: 'w-4 h-4 mr-2',
    small: 'w-3 h-3 mr-2'
  },
  
  // Badge styles
  badge: 'ml-2 px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded-full',
  
  // Logo styles
  logo: {
    mobile: 'w-32 h-auto object-contain',
    desktop: 'w-full h-auto object-contain'
  },
  
  // Button styles
  button: {
    close: 'text-gray-300 hover:text-white p-2',
    nav: 'text-gray-300 hover:text-white text-xs transition-colors'
  },
  
  // Container styles
  container: {
    bottom: 'border-t border-gray-700 p-3',
    navMenu: 'flex-1 py-2',
    navList: 'space-y-1',
    bottomList: 'space-y-2'
  }
} as const; 