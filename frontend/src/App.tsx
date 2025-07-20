import { useEffect, useState } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';

import { Sidebar, Header, ApplicationLayout, StickyFooter } from './components/layout';
import ApplicationHomePage from './pages/ApplicationHomePage';
import ApplicationsPage from './pages/ApplicationsPage';
import { DocumentCollectionPage } from './pages/DocumentCollectionPage';
import { DocumentDetailPage } from './pages/DocumentDetailPage';
import { DocumentLibraryPage } from './pages/DocumentLibraryPage';
import { NotFound } from './pages/NotFound';
import SurveyJSApplicationPage from './pages/SurveyJSApplicationPage';
import { useDocumentStore } from './stores/documentStore';

function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={handleMobileMenuToggle}
      />
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header onMobileMenuToggle={handleMobileMenuToggle} />
        <div className="flex-1 pb-16 lg:pb-0">
          <Outlet />
        </div>
        <StickyFooter />
      </div>
    </div>
  );
}

function ApplicationLayoutWrapper() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={handleMobileMenuToggle}
      />
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header onMobileMenuToggle={handleMobileMenuToggle} />
        <ApplicationLayout>
          <div className="pb-16 lg:pb-0">
            <Outlet />
          </div>
        </ApplicationLayout>
        <StickyFooter />
      </div>
    </div>
  );
}

function App() {
  const setIsDragging = useDocumentStore(state => state.setIsDragging);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types.includes('Files')) {
        setIsDragging(true);
      }
    };
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      // Only set to false if leaving the window
      if (!e.relatedTarget) {
        setIsDragging(false);
      }
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };
    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);
    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('drop', handleDrop);
    };
  }, [setIsDragging]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/applications" replace />} />
        <Route path="documents" element={<DocumentLibraryPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
      </Route>
      {/* Application-specific routes with persistent stepper */}
      <Route path="/" element={<ApplicationLayoutWrapper />}>
        <Route path="applications">
          <Route path=":type/:id" element={<Navigate to="/applications/:type/:id/home" replace />} />
          <Route path=":type/:id/home" element={<ApplicationHomePage />} />
          <Route path=":type/:id/documents" element={<DocumentCollectionPage />} />
          <Route path=":type/:id/documents/:categoryId" element={<DocumentDetailPage />} />
          <Route path=":type/:id/steps" element={<SurveyJSApplicationPage />} />
          <Route path=":type/:id/steps/:section" element={<SurveyJSApplicationPage />} />
          <Route path=":type/:id/steps/:section/:step" element={<SurveyJSApplicationPage />} />
        </Route>
      </Route>
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;