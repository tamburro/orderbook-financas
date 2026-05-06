'use client';

export default function PriceTicker({ asset, assetName, lastPrice, change, priceDirection }) {
  const isUp = change >= 0;
  const color = isUp ? 'var(--green)' : 'var(--red)';
  const arrow = priceDirection === 'up' ? '▲' : priceDirection === 'down' ? '▼' : '–';

  return (
    <div className="flex items-center gap-4 bg-[var(--bg-secondary)] rounded-lg px-4 py-3">
      <div>
        <div className="text-lg font-bold">{asset}</div>
        <div className="text-xs text-[var(--text-secondary)]">{assetName}</div>
      </div>
      <div className="ml-auto text-right">
        <div className="text-xl font-bold tabular-nums" style={{ color }}>
          {arrow} R$ {lastPrice.toFixed(2)}
        </div>
        <div className="text-sm tabular-nums" style={{ color }}>
          {isUp ? '+' : ''}{change.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}
