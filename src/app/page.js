'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { generateBookState, generateCandlesForTimeframe, ASSETS } from '@/lib/mockData';
import { tick } from '@/lib/simulator';
import OrderBook from '@/components/OrderBook';
import PriceTicker from '@/components/PriceTicker';
import RecentTrades from '@/components/RecentTrades';
import DepthChart from '@/components/DepthChart';
import CandlestickChart from '@/components/CandlestickChart';
import OrderPanel from '@/components/OrderPanel';
import Watchlist from '@/components/Watchlist';
import OrderHistory from '@/components/OrderHistory';
import AccountBalance from '@/components/AccountBalance';
import Portfolio from '@/components/Portfolio';
import PriceAlerts from '@/components/PriceAlerts';
import Toast from '@/components/Toast';
import LoginScreen from '@/components/LoginScreen';
import OnboardingTour from '@/components/OnboardingTour';
import MarketStatus from '@/components/MarketStatus';

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [asset, setAsset] = useState('PETR4');
  const [state, setState] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [timeframe, setTimeframe] = useState('1m');
  const [theme, setTheme] = useState('dark');
  const [alerts, setAlerts] = useState([]);
  const [toasts, setToasts] = useState([]);
  const intervalRef = useRef(null);
  const prevPricesRef = useRef({});

  useEffect(() => {
    if (loggedIn) {
      setState(generateBookState(asset));
      setShowTour(true);
    }
  }, [loggedIn]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!state) return;
    const currentPrice = state.lastPrice;
    const prevPrice = prevPricesRef.current[state.asset] || currentPrice;
    prevPricesRef.current[state.asset] = currentPrice;

    setAlerts((prev) => {
      const triggered = [];
      const remaining = prev.filter((alert) => {
        if (alert.asset !== state.asset) return true;
        const hit =
          (alert.direction === 'above' && prevPrice < alert.price && currentPrice >= alert.price) ||
          (alert.direction === 'below' && prevPrice > alert.price && currentPrice <= alert.price);
        if (hit) triggered.push(alert);
        return !hit;
      });

      if (triggered.length > 0) {
        setToasts((t) => [
          ...t,
          ...triggered.map((a) => ({
            id: `toast-${Date.now()}-${Math.random()}`,
            asset: a.asset,
            price: state.lastPrice,
            type: a.direction === 'above' ? 'up' : 'down',
          })),
        ]);
      }

      return triggered.length > 0 ? remaining : prev;
    });
  }, [state?.lastPrice, state?.asset]);

  const switchAsset = useCallback((newAsset) => {
    setAsset(newAsset);
    setState((prev) => generateBookState(newAsset, prev?.portfolio, prev?.balance));
    setSelectedPrice(null);
    setTimeframe('1m');
  }, []);

  const placeOrder = useCallback((order) => {
    setState((prev) => {
      if (!prev) return prev;
      const newOrder = {
        id: `ORD-${Date.now().toString(36).toUpperCase()}`,
        asset: prev.asset,
        ...order,
        status: 'open',
        time: Date.now(),
      };
      const balance = { ...prev.balance };
      if (order.side === 'buy') {
        balance.available = Math.round((balance.available - order.price * order.qty) * 100) / 100;
      }
      return {
        ...prev,
        orders: [newOrder, ...prev.orders],
        balance,
      };
    });
  }, []);

  const changeTimeframe = useCallback((tf) => {
    setTimeframe(tf);
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        candles: generateCandlesForTimeframe(ASSETS[prev.asset].basePrice, tf),
      };
    });
  }, []);

  const addAlert = useCallback((alert) => {
    setAlerts((prev) => [...prev, { ...alert, id: `alert-${Date.now()}-${Math.random()}` }]);
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (!state) return;
    intervalRef.current = setInterval(() => {
      setState((prev) => tick(prev));
    }, 800);

    return () => clearInterval(intervalRef.current);
  }, [asset, state !== null]);

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  if (!state) return null;

  return (
    <main className="min-h-screen p-2 sm:p-3 max-w-[1440px] mx-auto flex flex-col gap-2 sm:gap-3">
      <Toast toasts={toasts} onDismiss={dismissToast} />
      <OnboardingTour active={showTour} onFinish={() => setShowTour(false)} />

      {/* Header — mobile: 2 linhas, desktop: 1 linha */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg font-bold tracking-tight">TradeView</h1>
          <MarketStatus />
          <div className="ml-auto flex sm:hidden items-center gap-2">
            <button
              onClick={() => setShowTour(true)}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-xs"
            >
              ?
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {theme === 'dark' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="hidden sm:block w-px h-6 bg-[var(--bg-tertiary)]" />
        <PriceTicker
          asset={state.asset}
          assetName={state.assetName}
          lastPrice={state.lastPrice}
          change={state.change}
          priceDirection={state.priceDirection}
        />
        <div className="ml-auto hidden sm:flex items-center gap-2">
          <button
            onClick={() => setShowTour(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
            title="Tour guiado"
          >
            ?
          </button>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Grid — mobile: stack otimizado, desktop: 4 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_300px_260px] gap-2 sm:gap-3">
        {/* Watchlist — horizontal no mobile */}
        <div className="flex flex-col gap-2 sm:gap-3" data-tour="watchlist">
          <Watchlist selected={asset} onSelect={switchAsset} />
        </div>

        {/* Gráfico + Profundidade */}
        <div className="flex flex-col gap-2 sm:gap-3" data-tour="chart">
          <CandlestickChart
            candles={state.candles}
            timeframe={timeframe}
            onTimeframeChange={changeTimeframe}
            theme={theme}
          />
          <DepthChart bids={state.bids} asks={state.asks} />
        </div>

        {/* Book — mobile: grid de 2 colunas com OrderPanel lado a lado */}
        <div className="flex flex-col gap-2 sm:gap-3" data-tour="orderbook">
          <OrderBook
            bids={state.bids}
            asks={state.asks}
            lastPrice={state.lastPrice}
            priceDirection={state.priceDirection}
            onClickPrice={setSelectedPrice}
          />
        </div>

        {/* Painel lateral */}
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
            <AccountBalance balance={state.balance} />
            <div data-tour="orderpanel">
              <OrderPanel
                lastPrice={state.lastPrice}
                selectedPrice={selectedPrice}
                asset={state.asset}
                balance={state.balance}
                onPlaceOrder={placeOrder}
              />
            </div>
          </div>
          <div data-tour="alerts">
            <PriceAlerts
              asset={state.asset}
              lastPrice={state.lastPrice}
              alerts={alerts}
              onAddAlert={addAlert}
              onRemoveAlert={removeAlert}
            />
          </div>
          <RecentTrades trades={state.trades} />
        </div>
      </div>

      <Portfolio portfolio={state.portfolio} livePrices={state.livePrices} />
      <OrderHistory orders={state.orders} />
    </main>
  );
}
