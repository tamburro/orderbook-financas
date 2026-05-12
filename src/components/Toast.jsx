'use client';

import { useEffect, useState } from 'react';

export default function Toast({ toasts, onDismiss }) {
  return (
    <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-[calc(100vw-16px)]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setExiting(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (exiting) {
      const timer = setTimeout(() => onDismiss(toast.id), 300);
      return () => clearTimeout(timer);
    }
  }, [exiting, toast.id, onDismiss]);

  const borderColor = toast.type === 'up' ? 'var(--green)' : 'var(--red)';

  return (
    <div
      className={`pointer-events-auto bg-[var(--bg-secondary)] border border-[var(--hairline)] rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 shadow-lg w-[260px] sm:w-[280px] cursor-pointer ${exiting ? 'toast-exit' : 'toast-enter'}`}
      style={{ borderColor }}
      onClick={() => setExiting(true)}
    >
      <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: borderColor }}>
        {toast.type === 'up' ? '▲' : '▼'} Alerta de Preço
      </div>
      <div className="text-sm mt-1 text-[var(--text-primary)]">
        <span className="font-bold">{toast.asset}</span> atingiu R$ {toast.price.toFixed(2)}
      </div>
    </div>
  );
}
