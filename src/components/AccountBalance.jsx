'use client';

function formatCurrency(n) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function AccountBalance({ balance }) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-[var(--bg-tertiary)] text-sm font-semibold">
        Conta
      </div>
      <div className="p-3 flex flex-col gap-2">
        <div className="flex justify-between text-xs">
          <span className="text-[var(--text-secondary)]">Saldo total</span>
          <span className="tabular-nums font-medium">R$ {formatCurrency(balance.total)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-[var(--text-secondary)]">Disponível</span>
          <span className="tabular-nums font-medium text-[var(--green)]">R$ {formatCurrency(balance.available)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-[var(--text-secondary)]">Em posições</span>
          <span className="tabular-nums font-medium">R$ {formatCurrency(balance.total - balance.available)}</span>
        </div>
      </div>
    </div>
  );
}
