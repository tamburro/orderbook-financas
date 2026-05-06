'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { generateBookState, ASSET_LIST } from '@/lib/mockData';
import { tick } from '@/lib/simulator';
import OrderBook from '@/components/OrderBook';
import PriceTicker from '@/components/PriceTicker';
import RecentTrades from '@/components/RecentTrades';
import AssetSelector from '@/components/AssetSelector';

export default function Home() {
  const [asset, setAsset] = useState('PETR4');
  const [state, setState] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    setState(generateBookState(asset));
  }, []);

  const switchAsset = useCallback((newAsset) => {
    setAsset(newAsset);
    setState(generateBookState(newAsset));
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
    <main className="min-h-screen p-4 max-w-5xl mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-bold tracking-tight">Order Book</h1>
        <AssetSelector assets={ASSET_LIST} selected={asset} onSelect={switchAsset} />
      </div>

      <PriceTicker
        asset={state.asset}
        assetName={state.assetName}
        lastPrice={state.lastPrice}
        change={state.change}
        priceDirection={state.priceDirection}
      />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4">
        <OrderBook
          bids={state.bids}
          asks={state.asks}
          lastPrice={state.lastPrice}
          priceDirection={state.priceDirection}
        />
        <RecentTrades trades={state.trades} />
      </div>
    </main>
  );
}
