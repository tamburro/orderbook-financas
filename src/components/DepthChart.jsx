'use client';

import { useMemo } from 'react';

export default function DepthChart({ bids, asks }) {
  const { bidPoints, askPoints, maxQty, minPrice, maxPrice } = useMemo(() => {
    let cumBid = 0;
    const bidPoints = bids.map((l) => {
      cumBid += l.qty;
      return { price: l.price, cumQty: cumBid };
    });

    let cumAsk = 0;
    const askPoints = asks.map((l) => {
      cumAsk += l.qty;
      return { price: l.price, cumQty: cumAsk };
    });

    const maxQty = Math.max(cumBid, cumAsk, 1);
    const allPrices = [...bidPoints.map((p) => p.price), ...askPoints.map((p) => p.price)];
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);

    return { bidPoints, askPoints, maxQty, minPrice, maxPrice };
  }, [bids, asks]);

  const W = 400;
  const H = 140;
  const PAD = 4;

  const toX = (price) => PAD + ((price - minPrice) / (maxPrice - minPrice || 1)) * (W - PAD * 2);
  const toY = (qty) => H - PAD - (qty / maxQty) * (H - PAD * 2);

  const bidPath = bidPoints.length > 0
    ? `M${toX(bidPoints[0].price)},${H - PAD}` +
      bidPoints.map((p, i) => {
        const x = toX(p.price);
        const y = toY(p.cumQty);
        const prevX = i === 0 ? toX(p.price) : toX(bidPoints[i - 1].price);
        return `L${x},${toY(i === 0 ? 0 : bidPoints[i - 1].cumQty)}L${x},${y}`;
      }).join('') +
      `L${toX(bidPoints[bidPoints.length - 1].price)},${H - PAD}Z`
    : '';

  const askPath = askPoints.length > 0
    ? `M${toX(askPoints[0].price)},${H - PAD}` +
      askPoints.map((p, i) => {
        const x = toX(p.price);
        const y = toY(p.cumQty);
        const prevX = i === 0 ? toX(p.price) : toX(askPoints[i - 1].price);
        return `L${x},${toY(i === 0 ? 0 : askPoints[i - 1].cumQty)}L${x},${y}`;
      }).join('') +
      `L${toX(askPoints[askPoints.length - 1].price)},${H - PAD}Z`
    : '';

  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden border border-[var(--hairline)]">
      <div className="px-3 py-2 border-b border-[var(--hairline)] text-sm font-semibold">
        Profundidade
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--green)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--green)" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="askGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--red)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--red)" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {bidPath && <path d={bidPath} fill="url(#bidGrad)" stroke="var(--green)" strokeWidth="1.5" />}
        {askPath && <path d={askPath} fill="url(#askGrad)" stroke="var(--red)" strokeWidth="1.5" />}
      </svg>
    </div>
  );
}
