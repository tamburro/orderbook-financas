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

  return {
    ...state,
    lastPrice: newPrice,
    change: newChange,
    priceDirection: newPrice > state.lastPrice ? 'up' : newPrice < state.lastPrice ? 'down' : state.priceDirection,
    bids: updateLevels(state.bids, 'bid'),
    asks: updateLevels(state.asks, 'ask'),
    trades: [newTrade, ...state.trades.slice(0, 19)],
  };
}
