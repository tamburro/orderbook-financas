'use client';

export default function PriceTicker({ asset, assetName, lastPrice, change, priceDirection }) {
  const isUp = change >= 0;
  const color = isUp ? 'var(--green)' : 'var(--red)';
  const arrow = priceDirection === 'up' ? '▲' : priceDirection === 'down' ? '▼' : '–';

  return (
    <div className="flex items-center gap-3 bg-[var(--bg-secondary)] rounded-lg px-4 py-2 flex-1">
      <span className="text-sm font-bold">{asset}</span>
      <span className="text-xs text-[var(--text-secondary)] hidden sm:inline">{assetName}</span>
      <div className="ml-auto flex items-center gap-3">
        <span className="text-base font-bold tabular-nums" style={{ color }}>
          {arrow} R$ {lastPrice.toFixed(2)}
        </span>
        <span className="text-xs tabular-nums px-1.5 py-0.5 rounded" style={{ color, background: `${color}15` }}>
          {isUp ? '+' : ''}{change.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
