"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast overlay — bottom-20 to clear nav bar */}
      <div className="fixed bottom-20 inset-x-0 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium text-white max-w-sm w-full pointer-events-auto
              ${toast.type === "success" ? "bg-teal-600" : toast.type === "error" ? "bg-red-500" : "bg-stone-700"}
              animate-in fade-in slide-in-from-bottom-4 duration-200`}
          >
            {toast.type === "success" && <CheckCircle2 size={16} className="shrink-0" />}
            {toast.type === "error" && <XCircle size={16} className="shrink-0" />}
            {toast.type === "info" && <Info size={16} className="shrink-0" />}
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => dismiss(toast.id)} className="shrink-0 opacity-70 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
