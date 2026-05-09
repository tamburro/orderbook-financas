const ASSETS = {
  PETR4: { basePrice: 28.47, name: 'Petrobras PN', change: 0.34 },
  VALE3: { basePrice: 62.15, name: 'Vale ON', change: -0.87 },
  ITUB4: { basePrice: 34.20, name: 'Itaú Unibanco PN', change: 1.12 },
};

const TIMEFRAMES = {
  '1m': { seconds: 60, count: 60 },
  '5m': { seconds: 300, count: 60 },
  '15m': { seconds: 900, count: 48 },
  '1h': { seconds: 3600, count: 48 },
  '1D': { seconds: 86400, count: 60 },
};

function generateLevels(basePrice, side, count = 10) {
  const levels = [];
  const tick = basePrice * 0.001;

  for (let i = 0; i < count; i++) {
    const offset = (i + 1) * tick * (0.8 + Math.random() * 0.4);
    const price = side === 'bid'
      ? basePrice - offset
      : basePrice + offset;
    const qty = Math.floor(100 + Math.random() * 5000);
    levels.push({
      price: Math.round(price * 100) / 100,
      qty,
      total: Math.round(price * qty * 100) / 100,
    });
  }

  return side === 'bid'
    ? levels.sort((a, b) => b.price - a.price)
    : levels.sort((a, b) => a.price - b.price);
}

function generateTrades(basePrice, count = 20) {
  const trades = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const drift = (Math.random() - 0.5) * basePrice * 0.004;
    const price = Math.round((basePrice + drift) * 100) / 100;
    const qty = Math.floor(50 + Math.random() * 2000);
    const side = Math.random() > 0.5 ? 'buy' : 'sell';
    trades.push({
      price,
      qty,
      side,
      time: now - i * 2000,
    });
  }

  return trades;
}

function generateCandles(basePrice, timeframe = '1m') {
  const tf = TIMEFRAMES[timeframe];
  const candles = [];
  const now = Math.floor(Date.now() / 1000);
  let price = basePrice * (0.97 + Math.random() * 0.03);
  const volatility = timeframe === '1D' ? 0.015 : timeframe === '1h' ? 0.008 : 0.006;

  for (let i = tf.count - 1; i >= 0; i--) {
    const open = price;
    const change = (Math.random() - 0.48) * basePrice * volatility;
    const close = Math.round((open + change) * 100) / 100;
    const high = Math.round((Math.max(open, close) + Math.random() * basePrice * volatility * 0.5) * 100) / 100;
    const low = Math.round((Math.min(open, close) - Math.random() * basePrice * volatility * 0.5) * 100) / 100;
    const volume = Math.floor(5000 + Math.random() * 50000);

    candles.push({
      time: now - i * tf.seconds,
      open,
      high,
      low,
      close,
      volume,
    });

    price = close;
  }

  return candles;
}

function generateOrders(basePrice, assetKey) {
  const orders = [];
  const now = Date.now();
  const statuses = ['executed', 'executed', 'executed', 'open', 'cancelled'];

  for (let i = 0; i < 8; i++) {
    const side = Math.random() > 0.5 ? 'buy' : 'sell';
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const drift = (Math.random() - 0.5) * basePrice * 0.01;
    const price = Math.round((basePrice + drift) * 100) / 100;
    const qty = Math.floor(100 + Math.random() * 2000);

    orders.push({
      id: `ORD-${String(1000 + i).slice(1)}${Math.floor(Math.random() * 900 + 100)}`,
      asset: assetKey,
      side,
      price,
      qty,
      status,
      time: now - i * 45000 - Math.floor(Math.random() * 30000),
    });
  }

  return orders.sort((a, b) => b.time - a.time);
}

function generatePortfolio() {
  return {
    PETR4: { qty: 500, avgPrice: 27.85 },
    VALE3: { qty: 200, avgPrice: 63.10 },
    ITUB4: { qty: 0, avgPrice: 0 },
  };
}

function generateBalance() {
  return {
    total: 150000,
    available: 112450,
  };
}

export function generateBookState(assetKey, prevPortfolio, prevBalance) {
  const asset = ASSETS[assetKey];
  if (!asset) throw new Error(`Asset ${assetKey} not found`);

  return {
    asset: assetKey,
    assetName: asset.name,
    lastPrice: asset.basePrice,
    change: asset.change,
    bids: generateLevels(asset.basePrice, 'bid'),
    asks: generateLevels(asset.basePrice, 'ask'),
    trades: generateTrades(asset.basePrice),
    candles: generateCandles(asset.basePrice, '1m'),
    orders: generateOrders(asset.basePrice, assetKey),
    portfolio: prevPortfolio || generatePortfolio(),
    balance: prevBalance || generateBalance(),
    livePrices: Object.fromEntries(
      Object.entries(ASSETS).map(([key, a]) => [key, a.basePrice])
    ),
  };
}

export function generateCandlesForTimeframe(basePrice, timeframe) {
  return generateCandles(basePrice, timeframe);
}

function generateSparkline(basePrice, count = 20) {
  const points = [];
  let price = basePrice * (0.99 + Math.random() * 0.02);
  for (let i = 0; i < count; i++) {
    price += (Math.random() - 0.48) * basePrice * 0.003;
    points.push(Math.round(price * 100) / 100);
  }
  return points;
}

const sparklineCache = {};

export function generateWatchlistData() {
  return Object.entries(ASSETS).map(([key, asset]) => {
    const drift = (Math.random() - 0.5) * asset.basePrice * 0.005;
    const price = Math.round((asset.basePrice + drift) * 100) / 100;

    if (!sparklineCache[key]) {
      sparklineCache[key] = generateSparkline(asset.basePrice);
    }
    sparklineCache[key].shift();
    sparklineCache[key].push(price);

    return {
      asset: key,
      name: asset.name,
      lastPrice: price,
      change: asset.change + Math.round((Math.random() - 0.5) * 20) / 100,
      sparkline: [...sparklineCache[key]],
    };
  });
}

export const ASSET_LIST = Object.keys(ASSETS);
export const TIMEFRAME_LIST = Object.keys(TIMEFRAMES);
export { ASSETS, TIMEFRAMES };
