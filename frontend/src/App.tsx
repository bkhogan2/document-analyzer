import React, { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Routes, Route, Outlet, Navigate, useParams } from 'react-router-dom';
import { DocumentCollectionPage } from './pages/DocumentCollectionPage';
import { DocumentDetailPage } from './pages/DocumentDetailPage';
import ApplicationsPage from './pages/ApplicationsPage';
import { useDocumentStore } from './stores/documentStore';

// Placeholder for future application detail page
const ApplicationDetailPage: React.FC = () => {
  const { type, id } = useParams();
  return (
    <div className="flex-1 px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Application Detail</h1>
        <p>Type: {type}</p>
        <p>ID: {id}</p>
        <p>This is a placeholder for the application detail page.</p>
      </div>
    </div>
  );
};

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
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
        <Route index element={<DocumentCollectionPage />} />
        <Route path="documents/:categoryId" element={<DocumentDetailPage />} />
        {/* Applications routing */}
        <Route path="applications">
          <Route index element={<Navigate to="/applications/sba" replace />} />
          <Route path=":type" element={<ApplicationsPage />} />
          <Route path=":type/:id" element={<ApplicationDetailPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;