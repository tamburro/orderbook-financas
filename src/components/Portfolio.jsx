'use client';

import { ASSETS } from '@/lib/mockData';

function formatCurrency(n) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Portfolio({ portfolio, livePrices }) {
  const positions = Object.entries(portfolio)
    .filter(([, pos]) => pos.qty > 0)
    .map(([asset, pos]) => {
      const currentPrice = livePrices?.[asset] || ASSETS[asset].basePrice;
      const pnl = (currentPrice - pos.avgPrice) * pos.qty;
      const pnlPct = ((currentPrice - pos.avgPrice) / pos.avgPrice) * 100;
      return { asset, name: ASSETS[asset].name, ...pos, currentPrice, pnl, pnlPct };
    });

  const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0);

  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-[var(--bg-tertiary)] flex items-center justify-between">
        <span className="text-sm font-semibold">Carteira</span>
        {positions.length > 0 && (
          <span
            className="text-xs tabular-nums font-medium"
            style={{ color: totalPnl >= 0 ? 'var(--green)' : 'var(--red)' }}
          >
            P&L: {totalPnl >= 0 ? '+' : ''}R$ {formatCurrency(totalPnl)}
          </span>
        )}
      </div>
      {positions.length === 0 ? (
        <div className="p-4 text-xs text-[var(--text-secondary)] text-center">
          Nenhuma posição aberta
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[var(--text-secondary)]">
                <th className="px-2 py-1.5 text-left font-medium">Ativo</th>
                <th className="px-2 py-1.5 text-right font-medium">Qtd</th>
                <th className="px-2 py-1.5 text-right font-medium">PM</th>
                <th className="px-2 py-1.5 text-right font-medium">Atual</th>
                <th className="px-2 py-1.5 text-right font-medium">P&L</th>
                <th className="px-2 py-1.5 text-right font-medium">P&L %</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((pos) => {
                const color = pos.pnl >= 0 ? 'var(--green)' : 'var(--red)';
                return (
                  <tr key={pos.asset} className="h-7 hover:bg-[var(--bg-tertiary)] transition-colors">
                    <td className="px-2">
                      <span className="font-semibold">{pos.asset}</span>
                      <span className="text-[var(--text-secondary)] ml-1.5 hidden sm:inline">{pos.name}</span>
                    </td>
                    <td className="px-2 text-right tabular-nums">{pos.qty.toLocaleString('pt-BR')}</td>
                    <td className="px-2 text-right tabular-nums">{pos.avgPrice.toFixed(2)}</td>
                    <td className="px-2 text-right tabular-nums">{pos.currentPrice.toFixed(2)}</td>
                    <td className="px-2 text-right tabular-nums" style={{ color }}>
                      {pos.pnl >= 0 ? '+' : ''}{formatCurrency(pos.pnl)}
                    </td>
                    <td className="px-2 text-right tabular-nums" style={{ color }}>
                      {pos.pnl >= 0 ? '+' : ''}{pos.pnlPct.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
