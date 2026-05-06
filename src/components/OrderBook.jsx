'use client';

import { useEffect, useRef } from 'react';

function formatNumber(n) {
  return n.toLocaleString('pt-BR');
}

function formatPrice(n) {
  return n.toFixed(2);
}

function Row({ level, side, maxTotal }) {
  const ref = useRef(null);
  const prevChanged = useRef(false);

  useEffect(() => {
    if (level.changed && !prevChanged.current && ref.current) {
      ref.current.classList.remove('flash-green', 'flash-red');
      void ref.current.offsetWidth;
      ref.current.classList.add(side === 'bid' ? 'flash-green' : 'flash-red');
    }
    prevChanged.current = level.changed;
  }, [level.changed, level.qty, side]);

  const depthPct = maxTotal > 0 ? (level.total / maxTotal) * 100 : 0;
  const color = side === 'bid' ? 'var(--green)' : 'var(--red)';

  return (
    <tr
      ref={ref}
      className="relative h-7"
      style={{
        background: `linear-gradient(${side === 'bid' ? 'to left' : 'to right'}, ${color}15 ${depthPct}%, transparent ${depthPct}%)`,
      }}
    >
      <td className="px-2 text-right tabular-nums" style={{ color }}>
        {formatPrice(level.price)}
      </td>
      <td className="px-2 text-right tabular-nums">
        {formatNumber(level.qty)}
      </td>
      <td className="px-2 text-right tabular-nums text-[var(--text-secondary)]">
        {formatNumber(level.total)}
      </td>
    </tr>
  );
}

export default function OrderBook({ bids, asks, lastPrice, priceDirection }) {
  const maxBidTotal = Math.max(...bids.map((l) => l.total), 1);
  const maxAskTotal = Math.max(...asks.map((l) => l.total), 1);

  const spread = asks.length > 0 && bids.length > 0
    ? Math.round((asks[0].price - bids[0].price) * 100) / 100
    : 0;
  const spreadPct = bids.length > 0
    ? Math.round((spread / bids[0].price) * 10000) / 100
    : 0;

  const priceColor = priceDirection === 'up' ? 'var(--green)' : priceDirection === 'down' ? 'var(--red)' : 'var(--text-primary)';
  const arrow = priceDirection === 'up' ? '▲' : priceDirection === 'down' ? '▼' : '';

  return (
    <div className="flex flex-col bg-[var(--bg-secondary)] rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-[var(--bg-tertiary)] text-sm font-semibold">
        Order Book
      </div>

      <table className="w-full text-xs">
        <thead>
          <tr className="text-[var(--text-secondary)]">
            <th className="px-2 py-1.5 text-right font-medium">Preço</th>
            <th className="px-2 py-1.5 text-right font-medium">Qtd</th>
            <th className="px-2 py-1.5 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {[...asks].reverse().map((level, i) => (
            <Row key={`ask-${i}`} level={level} side="ask" maxTotal={maxAskTotal} />
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between px-3 py-2 border-y border-[var(--bg-tertiary)]">
        <span className="text-lg font-bold tabular-nums" style={{ color: priceColor }}>
          {arrow} {formatPrice(lastPrice)}
        </span>
        <span className="text-xs text-[var(--text-secondary)]">
          Spread: {formatPrice(spread)} ({spreadPct}%)
        </span>
      </div>

      <table className="w-full text-xs">
        <tbody>
          {bids.map((level, i) => (
            <Row key={`bid-${i}`} level={level} side="bid" maxTotal={maxBidTotal} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
