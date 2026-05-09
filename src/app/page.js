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

export default function Home() {
  const [asset, setAsset] = useState('PETR4');
  const [state, setState] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [timeframe, setTimeframe] = useState('1m');
  const intervalRef = useRef(null);

  useEffect(() => {
    setState(generateBookState(asset));
  }, []);

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

  useEffect(() => {
    if (!state) return;
    intervalRef.current = setInterval(() => {
      setState((prev) => tick(prev));
    }, 800);

    return () => clearInterval(intervalRef.current);
  }, [asset, state !== null]);

  if (!state) return null;

  return (
    <main className="min-h-screen p-3 max-w-[1440px] mx-auto flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold tracking-tight">Base Exchange</h1>
        <PriceTicker
          asset={state.asset}
          assetName={state.assetName}
          lastPrice={state.lastPrice}
          change={state.change}
          priceDirection={state.priceDirection}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_300px_260px] gap-3">
        <div className="flex flex-col gap-3">
          <Watchlist selected={asset} onSelect={switchAsset} />
        </div>

        <div className="flex flex-col gap-3">
          <CandlestickChart
            candles={state.candles}
            timeframe={timeframe}
            onTimeframeChange={changeTimeframe}
          />
          <DepthChart bids={state.bids} asks={state.asks} />
        </div>

        <div className="flex flex-col gap-3">
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
          <OrderPanel
            lastPrice={state.lastPrice}
            selectedPrice={selectedPrice}
            asset={state.asset}
            balance={state.balance}
            onPlaceOrder={placeOrder}
          />
          <RecentTrades trades={state.trades} />
        </div>
      </div>

      <Portfolio portfolio={state.portfolio} />
      <OrderHistory orders={state.orders} />
    </main>
  );
}
