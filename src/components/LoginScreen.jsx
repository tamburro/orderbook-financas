'use client';

import { useState } from 'react';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => onLogin(), 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--green)] mb-4">
            <span className="text-2xl font-black text-[#0d0d14]">T</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">TradeView</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Plataforma de negociação
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[var(--bg-secondary)] rounded-xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1 block">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--bg-tertiary)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--green)]"
            />
          </div>

          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1 block">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--bg-tertiary)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--green)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-[var(--green)] text-[#0d0d14] hover:brightness-110 transition-all disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#0d0d14] border-t-transparent rounded-full animate-spin" />
                Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </button>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-[var(--bg-tertiary)]" />
            <span className="text-[10px] text-[var(--text-secondary)]">ou</span>
            <div className="flex-1 h-px bg-[var(--bg-tertiary)]" />
          </div>

          <button
            type="button"
            onClick={() => { setLoading(true); setTimeout(() => onLogin(), 800); }}
            className="w-full py-2.5 rounded-lg text-sm font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Acessar como visitante
          </button>
        </form>

        <p className="text-center text-[10px] text-[var(--text-secondary)] mt-6">
          Ambiente simulado — dados fictícios para demonstração
        </p>
      </div>
    </div>
  );
}
