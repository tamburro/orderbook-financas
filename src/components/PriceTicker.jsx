'use client';

export default function PriceTicker({ asset, assetName, lastPrice, change, priceDirection }) {
  const isUp = change >= 0;
  const color = isUp ? 'var(--green)' : 'var(--red)';
  const arrow = priceDirection === 'up' ? '▲' : priceDirection === 'down' ? '▼' : '–';

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
      <span className="text-xs sm:text-sm font-semibold shrink-0">{asset}</span>
      <span className="text-xs text-[var(--text-secondary)] hidden sm:inline truncate">{assetName}</span>
      <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">
        <span className="text-sm sm:text-base font-semibold tabular-nums font-[var(--font-jetbrains),ui-monospace,monospace]" style={{ color }}>
          {arrow} R$ {lastPrice.toFixed(2)}
        </span>
        <span className="text-[10px] sm:text-xs tabular-nums px-1.5 py-0.5 rounded font-medium" style={{ color, background: `${color}15` }}>
          {isUp ? '+' : ''}{change.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
