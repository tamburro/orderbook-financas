'use client';

import { useState, useEffect, useRef } from 'react';

const STEPS = [
  {
    target: '[data-tour="watchlist"]',
    title: 'Watchlist',
    text: 'Acompanhe seus ativos favoritos com preços em tempo real. Clique para trocar o ativo.',
  },
  {
    target: '[data-tour="chart"]',
    title: 'Gráfico',
    text: 'Velas japonesas com múltiplos timeframes. Alterne entre 1m, 5m, 15m, 1h e diário.',
  },
  {
    target: '[data-tour="orderbook"]',
    title: 'Book de Ofertas',
    text: 'Visualize a profundidade do mercado. Clique em um preço para preencher a ordem automaticamente.',
  },
  {
    target: '[data-tour="orderpanel"]',
    title: 'Painel de Ordens',
    text: 'Envie ordens de compra e venda. O saldo e carteira atualizam em tempo real.',
  },
  {
    target: '[data-tour="alerts"]',
    title: 'Alertas de Preço',
    text: 'Defina alertas e receba notificações quando o preço atingir seu alvo.',
  },
];

function getTooltipPosition(rect, tooltipW, tooltipH) {
  const gap = 12;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const tryRight = rect.right + gap + tooltipW < vw;
  const tryLeft = rect.left - gap - tooltipW > 0;
  const tryBottom = rect.bottom + gap + tooltipH < vh;

  if (tryRight) {
    return { top: Math.max(8, rect.top), left: rect.right + gap };
  }
  if (tryBottom) {
    return { top: rect.bottom + gap, left: Math.min(rect.left, vw - tooltipW - 8) };
  }
  if (tryLeft) {
    return { top: Math.max(8, rect.top), left: rect.left - gap - tooltipW };
  }
  return { top: rect.bottom + gap, left: Math.max(8, (vw - tooltipW) / 2) };
}

export default function OnboardingTour({ active, onFinish }) {
  const [step, setStep] = useState(0);
  const [pos, setPos] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (active) {
      setStep(0);
      setPos(null);
      setTooltipPos(null);
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const update = () => {
      const el = document.querySelector(STEPS[step].target);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setPos({ top: rect.top, left: rect.left, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom });
    };

    const timer = setTimeout(update, 100);
    window.addEventListener('resize', update);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', update);
    };
  }, [step, active]);

  useEffect(() => {
    if (!pos || !tooltipRef.current) return;
    const rect = tooltipRef.current.getBoundingClientRect();
    setTooltipPos(getTooltipPosition(pos, rect.width, rect.height));
  }, [pos]);

  if (!active) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[100]" onClick={onFinish}>
      {pos && (
        <div
          className="absolute rounded-lg ring-2 ring-[var(--green)] z-[101] pointer-events-none"
          style={{
            top: pos.top - 4,
            left: pos.left - 4,
            width: pos.width + 8,
            height: pos.height + 8,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
          }}
        />
      )}

      <div
        ref={tooltipRef}
        className="fixed z-[102] w-[280px] bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-xl p-4 shadow-2xl"
        style={tooltipPos ? { top: tooltipPos.top, left: tooltipPos.left } : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
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
