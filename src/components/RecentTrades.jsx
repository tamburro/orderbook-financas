'use client';

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function RecentTrades({ trades }) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden border border-[var(--hairline)]">
      <div className="px-3 py-2 border-b border-[var(--hairline)] text-sm font-semibold">
        Negociações Recentes
      </div>
      <div className="max-h-[240px] overflow-y-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-[var(--text-secondary)]">
            <th className="px-2 py-1.5 text-left font-medium">Hora</th>
            <th className="px-2 py-1.5 text-right font-medium">Preço</th>
            <th className="px-2 py-1.5 text-right font-medium">Qtd</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, i) => (
            <tr key={i} className="h-6">
              <td className="px-2 tabular-nums text-[var(--text-secondary)]">
                {formatTime(trade.time)}
              </td>
              <td
                className="px-2 text-right tabular-nums"
                style={{ color: trade.side === 'buy' ? 'var(--green)' : 'var(--red)' }}
              >
                {trade.price.toFixed(2)}
              </td>
              <td className="px-2 text-right tabular-nums">
                {trade.qty.toLocaleString('pt-BR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
