import { Toast } from "./toastContext";

interface ToastProps {
    toasts: Toast[];
    removeToast: (id: number) => void;
  }
  
  export function ToastContainer({ toasts, removeToast }: ToastProps) {
    return (
      <div className="fixed bottom-0 right-0 m-6 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="rounded mb-4 mr-6 w-56 bg-white text-black h-16 flex items-center justify-center shadow-lg font-bold text-lg cursor-pointer transition-all duration-200 ease-in-out"
            onClick={() => removeToast(toast.id)}
            style={{ animation: `fadeInOut ${toast.duration}ms` }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    );
  }
  