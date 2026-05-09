'use client';

const STATUS_LABELS = {
  open: { label: 'Aberta', color: 'var(--text-primary)', bg: 'rgba(232,232,240,0.1)' },
  executed: { label: 'Executada', color: 'var(--green)', bg: 'rgba(0,192,118,0.1)' },
  cancelled: { label: 'Cancelada', color: 'var(--text-secondary)', bg: 'rgba(136,136,160,0.1)' },
};

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function OrderHistory({ orders }) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-[var(--bg-tertiary)] text-sm font-semibold">
        Histórico de Ordens
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[var(--text-secondary)]">
              <th className="px-2 py-1.5 text-left font-medium">Hora</th>
              <th className="px-2 py-1.5 text-left font-medium">Ativo</th>
              <th className="px-2 py-1.5 text-left font-medium">Lado</th>
              <th className="px-2 py-1.5 text-right font-medium">Preço</th>
              <th className="px-2 py-1.5 text-right font-medium">Qtd</th>
              <th className="px-2 py-1.5 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const status = STATUS_LABELS[order.status];
              const sideColor = order.side === 'buy' ? 'var(--green)' : 'var(--red)';

              return (
                <tr key={order.id} className="h-7 hover:bg-[var(--bg-tertiary)] transition-colors">
                  <td className="px-2 tabular-nums text-[var(--text-secondary)]">
                    {formatTime(order.time)}
                  </td>
                  <td className="px-2 font-semibold">
                    {order.asset}
                  </td>
                  <td className="px-2 font-medium" style={{ color: sideColor }}>
                    {order.side === 'buy' ? 'C' : 'V'}
                  </td>
                  <td className="px-2 text-right tabular-nums">
                    {order.price.toFixed(2)}
                  </td>
                  <td className="px-2 text-right tabular-nums">
                    {order.qty.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-2 text-right">
                    <span
                      className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium"
                      style={{ color: status.color, background: status.bg }}
                    >
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
