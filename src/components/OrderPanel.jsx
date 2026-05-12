'use client';

import { useState, useEffect } from 'react';

export default function OrderPanel({ lastPrice, selectedPrice, asset, balance, onPlaceOrder }) {
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

  const parsedPrice = parseFloat(price) || 0;
  const parsedQty = parseInt(qty, 10) || 0;
  const total = parsedPrice * parsedQty;
  const canPlace = parsedPrice > 0 && parsedQty > 0;

  const handlePlace = () => {
    if (!canPlace) return;
    onPlaceOrder({ side, price: parsedPrice, qty: parsedQty });
    setQty('');
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden border border-[var(--hairline)]">
      <div className="flex gap-px bg-[var(--hairline)]">
        <button
          onClick={() => setSide('buy')}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
            side === 'buy'
              ? 'bg-[var(--green)] text-white'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Comprar
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
            side === 'sell'
              ? 'bg-[var(--red)] text-white'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Vender
        </button>
      </div>

      <div className="p-3 flex flex-col gap-3">
        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1.5 block font-medium">Preço (R$)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={lastPrice?.toFixed(2)}
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--hairline)] rounded-md px-3 py-2 text-sm tabular-nums text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--yellow)]"
          />
        </div>

        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1.5 block font-medium">Quantidade</label>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="0"
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--hairline)] rounded-md px-3 py-2 text-sm tabular-nums text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--yellow)]"
          />
        </div>

        <div className="flex justify-between text-xs text-[var(--text-secondary)] py-1">
          <span>Total</span>
          <span className="tabular-nums text-[var(--text-primary)] font-medium">R$ {total.toFixed(2)}</span>
        </div>

        {balance && (
          <div className="flex justify-between text-[10px] text-[var(--text-secondary)]">
            <span>Disponível</span>
            <span className="tabular-nums">R$ {balance.available.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        )}

        <button
          onClick={handlePlace}
          disabled={!canPlace}
          title={!canPlace ? 'Preencha preço e quantidade' : ''}
          className={`w-full py-2.5 rounded-md text-sm font-semibold transition-colors ${
            side === 'buy'
              ? 'bg-[var(--green)] hover:brightness-110 text-white'
              : 'bg-[var(--red)] hover:brightness-110 text-white'
          } ${!canPlace ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          {side === 'buy' ? 'Comprar' : 'Vender'} {asset}
        </button>
      </div>
    </div>
  );
}
