import { createContext, useContext, useState, type ReactNode } from 'react';

interface Notification {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

interface NotificationContextType {
  notify: (message: string, type?: Notification['type']) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const remove = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`rounded-lg shadow-lg px-4 py-3 text-sm flex items-center space-x-2 transition-all duration-300
              ${n.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : ''}
              ${n.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : ''}
              ${n.type === 'warning' ? 'bg-yellow-50 border border-yellow-200 text-yellow-800' : ''}
              ${n.type === 'info' ? 'bg-white border border-gray-200 text-gray-800' : ''}
            `}
          >
            <span>{n.message}</span>
            <button
              className="ml-2 text-gray-400 hover:text-gray-700"
              onClick={() => remove(n.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}; 