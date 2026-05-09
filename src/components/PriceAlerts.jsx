'use client';

import { useState } from 'react';

export default function PriceAlerts({ asset, lastPrice, alerts, onAddAlert, onRemoveAlert }) {
  const [targetPrice, setTargetPrice] = useState('');

  const handleAdd = () => {
    const price = parseFloat(targetPrice);
    if (!price || price <= 0) return;
    onAddAlert({ asset, price, direction: price > lastPrice ? 'above' : 'below' });
    setTargetPrice('');
  };

  const assetAlerts = alerts.filter((a) => a.asset === asset);

  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-[var(--bg-tertiary)] text-sm font-semibold">
        Alertas
      </div>
      <div className="p-3 flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="number"
            step="0.01"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            placeholder={lastPrice?.toFixed(2)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="flex-1 bg-[var(--bg-tertiary)] border border-[#2a2a3e] rounded px-2 py-1.5 text-xs tabular-nums text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[#4a4a6a]"
          />
          <button
            onClick={handleAdd}
            className="px-3 py-1.5 rounded text-xs font-semibold bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            +
          </button>
        </div>
        {assetAlerts.length === 0 ? (
          <div className="text-[10px] text-[var(--text-secondary)] text-center py-1">
            Sem alertas para {asset}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {assetAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between text-xs bg-[var(--bg-tertiary)] rounded px-2 py-1.5"
              >
                <span className="flex items-center gap-1.5">
                  <span style={{ color: alert.direction === 'above' ? 'var(--green)' : 'var(--red)' }}>
                    {alert.direction === 'above' ? '▲' : '▼'}
                  </span>
                  <span className="tabular-nums">R$ {alert.price.toFixed(2)}</span>
                </span>
                <button
                  onClick={() => onRemoveAlert(alert.id)}
                  className="text-[var(--text-secondary)] hover:text-[var(--red)] transition-colors text-[10px]"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
