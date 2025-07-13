import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { ApplicationType } from '../constants/applicationTypes';
import { sbaDocumentCategories } from '../data/documentCategories';

interface BreadcrumbItem {
  label: string;
  to?: string;
  current?: boolean;
}

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const params = useParams<{ type?: ApplicationType; id?: string; categoryId?: string }>();
  
  const getCategoryTitle = (categoryId?: string) => {
    if (!categoryId) return '';
    const cat = sbaDocumentCategories.find(c => c.id === categoryId);
    return cat ? cat.title : categoryId;
  };

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathname = location.pathname;
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', to: '/' }
    ];

    // Application context (document collection and detail)
    if (pathname.startsWith('/applications/')) {
      breadcrumbs.push({ label: 'Applications', to: '/applications' });
      if (params.id && params.type) {
        breadcrumbs.push({ 
          label: params.id, 
          to: `/applications/${params.type}/${params.id}/home` 
        });
        // Document collection
        if (pathname.includes('/documents')) {
          breadcrumbs.push({
            label: 'Documents',
            to: `/applications/${params.type}/${params.id}/documents`,
            current: !params.categoryId
          });
          // Document detail
          if (params.categoryId) {
            breadcrumbs.push({
              label: getCategoryTitle(params.categoryId),
              current: true
            });
          }
        } else {
          // On home page
          breadcrumbs[breadcrumbs.length - 1].current = true;
        }
      }
    }
    // Documents context (global library)
    else if (pathname.startsWith('/documents/')) {
      breadcrumbs.push({ label: 'Document Library', to: '/documents' });
      if (params.categoryId) {
        breadcrumbs.push({ 
          label: `Category ${params.categoryId}`, 
          current: true 
        });
      }
    }
    // Document collection page (root)
    else if (pathname === '/') {
      breadcrumbs.push({ label: 'Document Collection', current: true });
    }
    // Document library page
    else if (pathname === '/documents') {
      breadcrumbs.push({ label: 'Document Library', current: true });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs if we're just on the home page
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-4">
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
          {item.current ? (
            <span className="text-gray-900 font-medium">{item.label}</span>
          ) : item.to ? (
            <Link
              to={item.to}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-500">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}; 