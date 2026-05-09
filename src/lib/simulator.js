import { ASSETS } from './mockData';

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export function tick(state) {
  const base = ASSETS[state.asset].basePrice;
  const maxDrift = base * 0.02;

  const priceDrift = (Math.random() - 0.5) * base * 0.003;
  const newPrice = clamp(
    Math.round((state.lastPrice + priceDrift) * 100) / 100,
    base - maxDrift,
    base + maxDrift
  );

  const oldChange = state.change;
  const newChange = Math.round(((newPrice - base) / base) * 10000) / 100;

  const updateLevels = (levels, side) => {
    const updated = levels.map((level) => {
      if (Math.random() < 0.35) {
        const qtyDelta = Math.floor((Math.random() - 0.3) * 500);
        const newQty = Math.max(10, level.qty + qtyDelta);
        return {
          ...level,
          qty: newQty,
          total: Math.round(level.price * newQty * 100) / 100,
          changed: true,
        };
      }
      return { ...level, changed: false };
    });

    if (Math.random() < 0.2) {
      const tick = base * 0.001;
      const edge = side === 'bid' ? updated[0].price : updated[0].price;
      const newPrice = side === 'bid'
        ? Math.round((edge + tick * (0.5 + Math.random())) * 100) / 100
        : Math.round((edge - tick * (0.5 + Math.random())) * 100) / 100;
      const qty = Math.floor(100 + Math.random() * 3000);
      const newLevel = {
        price: newPrice,
        qty,
        total: Math.round(newPrice * qty * 100) / 100,
        changed: true,
      };

      if (side === 'bid') {
        updated.unshift(newLevel);
        updated.pop();
        updated.sort((a, b) => b.price - a.price);
      } else {
        updated.unshift(newLevel);
        updated.pop();
        updated.sort((a, b) => a.price - b.price);
      }
    }

    return updated;
  };

  const newTrade = {
    price: newPrice,
    qty: Math.floor(50 + Math.random() * 1500),
    side: newPrice >= state.lastPrice ? 'buy' : 'sell',
    time: Date.now(),
  };

  const candles = [...state.candles];
  const lastCandle = candles[candles.length - 1];
  const now = Math.floor(Date.now() / 1000);

  if (now - lastCandle.time >= 60) {
    candles.push({
      time: lastCandle.time + 60,
      open: newPrice,
      high: newPrice,
      low: newPrice,
      close: newPrice,
      volume: newTrade.qty,
    });
    if (candles.length > 120) candles.shift();
  } else {
    const updated = { ...lastCandle };
    updated.close = newPrice;
    updated.high = Math.max(updated.high, newPrice);
    updated.low = Math.min(updated.low, newPrice);
    updated.volume += newTrade.qty;
    candles[candles.length - 1] = updated;
  }

  const orders = [...state.orders];
  const portfolio = { ...state.portfolio };
  const balance = { ...state.balance };

  if (Math.random() < 0.1 && orders.some((o) => o.status === 'open')) {
    const openIdx = orders.findIndex((o) => o.status === 'open');
    if (openIdx >= 0) {
      const order = orders[openIdx];
      orders[openIdx] = { ...order, status: 'executed', time: Date.now() };

      const orderAsset = order.asset;
      const pos = portfolio[orderAsset] || { qty: 0, avgPrice: 0 };

      if (order.side === 'buy') {
        const totalQty = pos.qty + order.qty;
        const newAvg = totalQty > 0
          ? (pos.avgPrice * pos.qty + order.price * order.qty) / totalQty
          : 0;
        portfolio[orderAsset] = { qty: totalQty, avgPrice: Math.round(newAvg * 100) / 100 };
        balance.available = Math.round((balance.available - order.price * order.qty) * 100) / 100;
      } else {
        const totalQty = Math.max(0, pos.qty - order.qty);
        portfolio[orderAsset] = { qty: totalQty, avgPrice: totalQty > 0 ? pos.avgPrice : 0 };
        balance.available = Math.round((balance.available + order.price * order.qty) * 100) / 100;
        balance.total = Math.round((balance.total + (order.price - pos.avgPrice) * order.qty) * 100) / 100;
      }
    }
  }

  return {
    ...state,
    lastPrice: newPrice,
    change: newChange,
    priceDirection: newPrice > state.lastPrice ? 'up' : newPrice < state.lastPrice ? 'down' : state.priceDirection,
    bids: updateLevels(state.bids, 'bid'),
    asks: updateLevels(state.asks, 'ask'),
    trades: [newTrade, ...state.trades.slice(0, 19)],
    candles,
    orders,
    portfolio,
    balance,
    livePrices: {
      ...state.livePrices,
      [state.asset]: newPrice,
    },
  };
}
