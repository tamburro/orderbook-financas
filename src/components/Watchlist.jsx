'use client';

import { useState, useEffect, useRef } from 'react';
import { generateWatchlistData } from '@/lib/mockData';

function Sparkline({ data, color, width = 60, height = 20 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Watchlist({ selected, onSelect }) {
  const [data, setData] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    setData(generateWatchlistData());
    intervalRef.current = setInterval(() => {
      setData(generateWatchlistData());
    }, 1500);
    return () => clearInterval(intervalRef.current);
  }, []);

  if (!data) return null;

  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden border border-[var(--hairline)]">
      <div className="px-3 py-2 border-b border-[var(--hairline)] text-sm font-semibold hidden lg:block">
        Watchlist
      </div>
      {/* Mobile: horizontal scroll */}
      <div className="flex lg:hidden overflow-x-auto gap-0 scrollbar-none">
        {data.map((item) => {
          const isUp = item.change >= 0;
          const color = isUp ? 'var(--green)' : 'var(--red)';
          const isSelected = item.asset === selected;

          return (
            <div
              key={item.asset}
              onClick={() => onSelect(item.asset)}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors shrink-0 ${
                isSelected
                  ? 'bg-[var(--bg-tertiary)] border-b-2 border-[var(--yellow)]'
                  : 'border-b-2 border-transparent'
              }`}
            >
              <span className={`text-xs font-semibold ${isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                {item.asset}
              </span>
              <Sparkline data={item.sparkline} color={color} width={40} height={16} />
              <span className="text-[11px] tabular-nums font-medium" style={{ color }}>
                {item.lastPrice.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
      {/* Desktop: vertical list */}
      <div className="hidden lg:flex flex-col">
        {data.map((item) => {
          const isUp = item.change >= 0;
          const color = isUp ? 'var(--green)' : 'var(--red)';
          const isSelected = item.asset === selected;

          return (
            <div
              key={item.asset}
              onClick={() => onSelect(item.asset)}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-[var(--bg-tertiary)] border-l-2 border-[var(--yellow)]'
                  : 'hover:bg-[var(--bg-tertiary)] border-l-2 border-transparent'
              }`}
            >
              <div className="flex flex-col min-w-0">
                <span className={`text-xs font-semibold ${isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                  {item.asset}
                </span>
                <span className="text-[10px] text-[var(--text-secondary)] leading-tight truncate">
                  {item.name}
                </span>
              </div>
              <Sparkline data={item.sparkline} color={color} />
              <div className="ml-auto flex flex-col items-end">
                <span className="text-[11px] tabular-nums font-medium" style={{ color }}>
                  {item.lastPrice.toFixed(2)}
                </span>
                <span className="text-[10px] tabular-nums" style={{ color }}>
                  {isUp ? '+' : ''}{item.change.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
