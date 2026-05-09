'use client';

import { useState, useEffect, useCallback } from 'react';

const STEPS = [
  {
    target: '[data-tour="watchlist"]',
    title: 'Watchlist',
    text: 'Acompanhe seus ativos favoritos com preços em tempo real. Clique para trocar o ativo ativo.',
    position: 'right',
  },
  {
    target: '[data-tour="chart"]',
    title: 'Gráfico',
    text: 'Velas japonesas com múltiplos timeframes. Alterne entre 1m, 5m, 15m, 1h e diário.',
    position: 'bottom',
  },
  {
    target: '[data-tour="orderbook"]',
    title: 'Book de Ofertas',
    text: 'Visualize a profundidade do mercado. Clique em um preço para preencher a ordem automaticamente.',
    position: 'left',
  },
  {
    target: '[data-tour="orderpanel"]',
    title: 'Painel de Ordens',
    text: 'Envie ordens de compra e venda. O saldo e carteira atualizam em tempo real.',
    position: 'left',
  },
  {
    target: '[data-tour="alerts"]',
    title: 'Alertas de Preço',
    text: 'Defina alertas e receba notificações quando o preço atingir seu alvo.',
    position: 'left',
  },
];

export default function OnboardingTour({ active, onFinish }) {
  const [step, setStep] = useState(0);
  const [pos, setPos] = useState(null);

  const updatePosition = useCallback(() => {
    if (!active) return;
    const el = document.querySelector(STEPS[step].target);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
  }, [step, active]);

  useEffect(() => {
    if (active) setStep(0);
  }, [active]);

  useEffect(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [updatePosition]);

  useEffect(() => {
    if (active) {
      const el = document.querySelector(STEPS[step].target);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(updatePosition, 300);
    }
  }, [step, active, updatePosition]);

  if (!active || !pos) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  let tooltipStyle = {};
  const gap = 12;
  if (current.position === 'right') {
    tooltipStyle = { top: pos.top, left: pos.left + pos.width + gap };
  } else if (current.position === 'left') {
    tooltipStyle = { top: pos.top, left: pos.left - 280 - gap };
  } else if (current.position === 'bottom') {
    tooltipStyle = { top: pos.top + pos.height + gap, left: pos.left };
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/60" onClick={onFinish} />

      <div
        className="absolute rounded-lg ring-2 ring-[var(--green)] z-[101] pointer-events-none"
        style={{
          top: pos.top - 4,
          left: pos.left - 4,
          width: pos.width + 8,
          height: pos.height + 8,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
        }}
      />

      <div
        className="absolute z-[102] w-[280px] bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-xl p-4 shadow-2xl"
        style={tooltipStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[var(--green)]">{current.title}</span>
          <span className="text-[10px] text-[var(--text-secondary)] tabular-nums">
            {step + 1}/{STEPS.length}
          </span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
          {current.text}
        </p>
        <div className="flex items-center justify-between">
          <button
            onClick={onFinish}
            className="text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Pular
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-3 py-1 rounded text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Voltar
              </button>
            )}
            <button
              onClick={() => isLast ? onFinish() : setStep(step + 1)}
              className="px-3 py-1 rounded text-xs font-semibold bg-[var(--green)] text-[#0d0d14]"
            >
              {isLast ? 'Concluir' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
