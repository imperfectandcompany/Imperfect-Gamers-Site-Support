import { createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { ToastContainer } from './ToastContainer';

export interface Toast {
  id: number;
  message: string;
  duration: number;
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, duration?: number) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: preact.ComponentChildren }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, duration = 3000) => {
    const id = Date.now();
    const newToast: Toast = { id, message, duration };
    setToasts(toasts => [...toasts, newToast]);

    setTimeout(() => {
      setToasts(toasts => toasts.filter(toast => toast.id !== id));
    }, duration);
  };

  const removeToast = (id: number) => {
    setToasts(toasts => toasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext) as ToastContextType;
