'use client';

import { useState, useEffect, useRef } from 'react';
import { generateWatchlistData } from '@/lib/mockData';

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
    <div className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-[var(--bg-tertiary)] text-sm font-semibold">
        Watchlist
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-[var(--text-secondary)]">
            <th className="px-3 py-1.5 text-left font-medium">Ativo</th>
            <th className="px-3 py-1.5 text-right font-medium">Preço</th>
            <th className="px-3 py-1.5 text-right font-medium">Var%</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const isUp = item.change >= 0;
            const color = isUp ? 'var(--green)' : 'var(--red)';
            const isSelected = item.asset === selected;

            return (
              <tr
                key={item.asset}
                onClick={() => onSelect(item.asset)}
                className={`h-8 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[var(--bg-tertiary)]'
                    : 'hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                <td className="px-3">
                  <div className="font-semibold text-[var(--text-primary)]">{item.asset}</div>
                  <div className="text-[10px] text-[var(--text-secondary)] leading-tight">{item.name}</div>
                </td>
                <td className="px-3 text-right tabular-nums" style={{ color }}>
                  {item.lastPrice.toFixed(2)}
                </td>
                <td className="px-3 text-right tabular-nums" style={{ color }}>
                  {isUp ? '+' : ''}{item.change.toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
