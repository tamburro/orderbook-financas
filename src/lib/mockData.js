const ASSETS = {
  PETR4: { basePrice: 28.47, name: 'Petrobras PN', change: 0.34 },
  VALE3: { basePrice: 62.15, name: 'Vale ON', change: -0.87 },
  ITUB4: { basePrice: 34.20, name: 'Itaú Unibanco PN', change: 1.12 },
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

export function generateBookState(assetKey) {
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
  };
}

export const ASSET_LIST = Object.keys(ASSETS);
export { ASSETS };
