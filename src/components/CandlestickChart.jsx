'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { TIMEFRAME_LIST } from '@/lib/mockData';

export default function CandlestickChart({ candles, timeframe, onTimeframeChange }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#12121c' },
        textColor: '#8888a0',
        fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
        fontSize: 10,
      },
      grid: {
        vertLines: { color: '#1a1a2e' },
        horzLines: { color: '#1a1a2e' },
      },
      crosshair: {
        vertLine: { color: '#4a4a6a', width: 1, style: 2 },
        horzLine: { color: '#4a4a6a', width: 1, style: 2 },
      },
      rightPriceScale: {
        borderColor: '#1a1a2e',
      },
      timeScale: {
        borderColor: '#1a1a2e',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: false,
      handleScale: false,
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00c076',
      downColor: '#f6465d',
      borderUpColor: '#00c076',
      borderDownColor: '#f6465d',
      wickUpColor: '#00c076',
      wickDownColor: '#f6465d',
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
      visible: false,
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      chart.applyOptions({ width });
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!candleSeriesRef.current || !candles.length) return;

    candleSeriesRef.current.setData(candles);
    volumeSeriesRef.current.setData(
      candles.map((c) => ({
        time: c.time,
        value: c.volume,
        color: c.close >= c.open ? 'rgba(0,192,118,0.3)' : 'rgba(246,70,93,0.3)',
      }))
    );

    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-[var(--bg-tertiary)] flex items-center justify-between">
        <span className="text-sm font-semibold">Gráfico</span>
        <div className="flex gap-0.5 bg-[var(--bg-primary)] rounded p-0.5">
          {TIMEFRAME_LIST.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-2 py-0.5 rounded text-[10px] tabular-nums transition-colors ${
                timeframe === tf
                  ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div ref={containerRef} className="h-[250px]" />
    </div>
  );
}
