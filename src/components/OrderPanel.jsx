'use client';

import { useState, useEffect } from 'react';

export default function OrderPanel({ lastPrice, selectedPrice, asset }) {
  const [side, setSide] = useState('buy');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');

  useEffect(() => {
    if (selectedPrice !== null && selectedPrice !== undefined) {
      setPrice(selectedPrice.toFixed(2));
    }
  }, [selectedPrice]);

  useEffect(() => {
    setPrice('');
    setQty('');
  }, [asset]);

  const total = price && qty ? (parseFloat(price) * parseInt(qty, 10) || 0).toFixed(2) : '0.00';

  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden">
      <div className="flex">
        <button
          onClick={() => setSide('buy')}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
            side === 'buy'
              ? 'bg-[var(--green)] text-[#0d0d14]'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Comprar
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
            side === 'sell'
              ? 'bg-[var(--red)] text-[#0d0d14]'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Vender
        </button>
      </div>

      <div className="p-3 flex flex-col gap-3">
        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1 block">Preço (R$)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={lastPrice?.toFixed(2)}
            className="w-full bg-[var(--bg-tertiary)] border border-[#2a2a3e] rounded px-3 py-2 text-sm tabular-nums text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[#4a4a6a]"
          />
        </div>

        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1 block">Quantidade</label>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="0"
            className="w-full bg-[var(--bg-tertiary)] border border-[#2a2a3e] rounded px-3 py-2 text-sm tabular-nums text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[#4a4a6a]"
          />
        </div>

        <div className="flex justify-between text-xs text-[var(--text-secondary)] py-1">
          <span>Total</span>
          <span className="tabular-nums text-[var(--text-primary)]">R$ {total}</span>
        </div>

        <button
          className={`w-full py-2.5 rounded text-sm font-semibold transition-colors ${
            side === 'buy'
              ? 'bg-[var(--green)] hover:brightness-110 text-[#0d0d14]'
              : 'bg-[var(--red)] hover:brightness-110 text-[#0d0d14]'
          }`}
        >
          {side === 'buy' ? 'Comprar' : 'Vender'} {asset}
        </button>
      </div>
    </div>
  );
}
