'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

function formatNumber(n) {
  return n.toLocaleString('pt-BR');
}

function formatPrice(n) {
  return n.toFixed(2);
}

const GROUP_OPTIONS = [
  { label: '0.01', value: 0.01 },
  { label: '0.05', value: 0.05 },
  { label: '0.10', value: 0.10 },
];

function groupLevels(levels, step, side) {
  if (step === 0.01) return levels;

  const grouped = {};
  levels.forEach((level) => {
    const bucket = side === 'bid'
      ? Math.floor(level.price / step) * step
      : Math.ceil(level.price / step) * step;
    const key = bucket.toFixed(2);
    if (!grouped[key]) {
      grouped[key] = { price: bucket, qty: 0, total: 0, changed: false };
    }
    grouped[key].qty += level.qty;
    grouped[key].total += level.total;
    if (level.changed) grouped[key].changed = true;
  });

  const result = Object.values(grouped);
  return side === 'bid'
    ? result.sort((a, b) => b.price - a.price)
    : result.sort((a, b) => a.price - b.price);
}

function Row({ level, side, maxTotal, onClickPrice }) {
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
      className="relative h-7 cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors"
      onClick={() => onClickPrice?.(level.price)}
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

export default function OrderBook({ bids, asks, lastPrice, priceDirection, onClickPrice }) {
  const [groupStep, setGroupStep] = useState(0.01);

  const groupedBids = useMemo(() => groupLevels(bids, groupStep, 'bid'), [bids, groupStep]);
  const groupedAsks = useMemo(() => groupLevels(asks, groupStep, 'ask'), [asks, groupStep]);

  const maxBidTotal = Math.max(...groupedBids.map((l) => l.total), 1);
  const maxAskTotal = Math.max(...groupedAsks.map((l) => l.total), 1);

  const spread = groupedAsks.length > 0 && groupedBids.length > 0
    ? Math.round((groupedAsks[0].price - groupedBids[0].price) * 100) / 100
    : 0;
  const spreadPct = groupedBids.length > 0
    ? Math.round((spread / groupedBids[0].price) * 10000) / 100
    : 0;

  const priceColor = priceDirection === 'up' ? 'var(--green)' : priceDirection === 'down' ? 'var(--red)' : 'var(--text-primary)';
  const arrow = priceDirection === 'up' ? '▲' : priceDirection === 'down' ? '▼' : '';

  return (
    <div className="flex flex-col bg-[var(--bg-secondary)] rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-[var(--bg-tertiary)] flex items-center justify-between">
        <span className="text-sm font-semibold">Order Book</span>
        <div className="flex gap-0.5 bg-[var(--bg-primary)] rounded p-0.5">
          {GROUP_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setGroupStep(opt.value)}
              className={`px-2 py-0.5 rounded text-[10px] tabular-nums transition-colors ${
                groupStep === opt.value
                  ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
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
          {[...groupedAsks].reverse().map((level, i) => (
            <Row key={`ask-${i}`} level={level} side="ask" maxTotal={maxAskTotal} onClickPrice={onClickPrice} />
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
          {groupedBids.map((level, i) => (
            <Row key={`bid-${i}`} level={level} side="bid" maxTotal={maxBidTotal} onClickPrice={onClickPrice} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
