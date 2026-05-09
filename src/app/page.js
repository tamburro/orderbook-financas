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
    <main className="min-h-screen p-3 max-w-[1440px] mx-auto flex flex-col gap-3">
      <Toast toasts={toasts} onDismiss={dismissToast} />
      <OnboardingTour active={showTour} onFinish={() => setShowTour(false)} />

      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold tracking-tight">Base Exchange</h1>
        <MarketStatus />
        <PriceTicker
          asset={state.asset}
          assetName={state.assetName}
          lastPrice={state.lastPrice}
          change={state.change}
          priceDirection={state.priceDirection}
        />
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowTour(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
            title="Tour guiado"
          >
            ?
          </button>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
            title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_300px_260px] gap-3">
        <div className="flex flex-col gap-3" data-tour="watchlist">
          <Watchlist selected={asset} onSelect={switchAsset} />
        </div>

        <div className="flex flex-col gap-3" data-tour="chart">
          <CandlestickChart
            candles={state.candles}
            timeframe={timeframe}
            onTimeframeChange={changeTimeframe}
            theme={theme}
          />
          <DepthChart bids={state.bids} asks={state.asks} />
        </div>

        <div className="flex flex-col gap-3" data-tour="orderbook">
          <OrderBook
            bids={state.bids}
            asks={state.asks}
            lastPrice={state.lastPrice}
            priceDirection={state.priceDirection}
            onClickPrice={setSelectedPrice}
          />
        </div>

        <div className="flex flex-col gap-3">
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

      <Portfolio portfolio={state.portfolio} />
      <OrderHistory orders={state.orders} />
    </main>
  );
}
