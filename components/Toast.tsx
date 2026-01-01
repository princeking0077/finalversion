
import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-24 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-center w-80 p-4 rounded-xl border shadow-2xl backdrop-blur-xl transition-all duration-500 animate-slide-in
              ${toast.type === 'success' ? 'bg-slate-900/90 border-teal-500/50 text-teal-50' : ''}
              ${toast.type === 'error' ? 'bg-slate-900/90 border-rose-500/50 text-rose-50' : ''}
              ${toast.type === 'info' ? 'bg-slate-900/90 border-blue-500/50 text-blue-50' : ''}
            `}
          >
            <div className={`mr-3 p-2 rounded-full ${
                toast.type === 'success' ? 'bg-teal-500/20 text-teal-400' :
                toast.type === 'error' ? 'bg-rose-500/20 text-rose-400' :
                'bg-blue-500/20 text-blue-400'
            }`}>
              {toast.type === 'success' && <CheckCircle className="h-5 w-5" />}
              {toast.type === 'error' && <AlertCircle className="h-5 w-5" />}
              {toast.type === 'info' && <Info className="h-5 w-5" />}
            </div>
            <p className="flex-1 text-sm font-medium leading-tight">{toast.message}</p>
            <button 
              onClick={() => removeToast(toast.id)} 
              className="ml-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
