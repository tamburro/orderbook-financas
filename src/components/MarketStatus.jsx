'use client';

import { useState, useEffect } from 'react';

function getMarketStatus() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const time = h * 60 + m;
  const day = now.getDay();

  if (day === 0 || day === 6) return { label: 'Fechado', color: 'var(--text-secondary)', dot: '#666' };
  if (time >= 570 && time < 600) return { label: 'Pré-abertura', color: '#f0b90b', dot: '#f0b90b' };
  if (time >= 600 && time < 1020) return { label: 'Aberto', color: 'var(--green)', dot: 'var(--green)' };
  if (time >= 1020 && time < 1050) return { label: 'After Market', color: '#f0b90b', dot: '#f0b90b' };
  return { label: 'Fechado', color: 'var(--text-secondary)', dot: '#666' };
}

export default function MarketStatus() {
  const [status, setStatus] = useState(getMarketStatus);

  useEffect(() => {
    const interval = setInterval(() => setStatus(getMarketStatus()), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md bg-[var(--bg-tertiary)]">
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ backgroundColor: status.dot }}
      />
      <span style={{ color: status.color }}>{status.label}</span>
    </div>
  );
}
