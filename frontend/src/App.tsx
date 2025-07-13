import { useEffect } from 'react';
import { DynamicSidebar } from './components/DynamicSidebar';
import { Header } from './components/Header';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { DocumentCollectionPage } from './pages/DocumentCollectionPage';
import { DocumentDetailPage } from './pages/DocumentDetailPage';
import { DocumentLibraryPage } from './pages/DocumentLibraryPage';
import ApplicationsPage from './pages/ApplicationsPage';
import { useDocumentStore } from './stores/documentStore';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DynamicSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <Outlet />
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
        <Route path="documents/:categoryId" element={<DocumentDetailPage />} />
        {/* Applications routing */}
        <Route path="applications">
          <Route index element={<ApplicationsPage />} />
          <Route path=":type/:id" element={<DocumentCollectionPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;