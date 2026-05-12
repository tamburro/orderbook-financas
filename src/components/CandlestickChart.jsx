'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { TIMEFRAME_LIST } from '@/lib/mockData';

export default function CandlestickChart({ candles, timeframe, onTimeframeChange, theme }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const isDark = theme !== 'light';
    const bgColor = isDark ? '#1e2329' : '#ffffff';
    const textColor = '#707a8a';
    const gridColor = isDark ? '#2b3139' : '#eaecef';

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: bgColor },
        textColor,
        fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
        fontSize: 10,
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      crosshair: {
        vertLine: { color: isDark ? '#4a4a6a' : '#b0b0c0', width: 1, style: 2 },
        horzLine: { color: isDark ? '#4a4a6a' : '#b0b0c0', width: 1, style: 2 },
      },
      rightPriceScale: {
        borderColor: gridColor,
      },
      timeScale: {
        borderColor: gridColor,
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: false,
      handleScale: false,
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#0ecb81',
      downColor: '#f6465d',
      borderUpColor: '#0ecb81',
      borderDownColor: '#f6465d',
      wickUpColor: '#0ecb81',
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
  }, [theme]);

  useEffect(() => {
    if (!candleSeriesRef.current || !candles.length) return;

    candleSeriesRef.current.setData(candles);
    volumeSeriesRef.current.setData(
      candles.map((c) => ({
        time: c.time,
        value: c.volume,
        color: c.close >= c.open ? 'rgba(14,203,129,0.3)' : 'rgba(246,70,93,0.3)',
      }))
    );

    chartRef.current?.timeScale().fitContent();
  }, [candles, theme]);

  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden border border-[var(--hairline)]">
      <div className="px-3 py-2 border-b border-[var(--hairline)] flex items-center justify-between">
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
      <div ref={containerRef} className="h-[200px] sm:h-[250px]" />
    </div>
  );
}
