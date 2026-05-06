'use client';

export default function AssetSelector({ assets, selected, onSelect }) {
  return (
    <div className="flex gap-1 bg-[var(--bg-secondary)] rounded-lg p-1">
      {assets.map((asset) => (
        <button
          key={asset}
          onClick={() => onSelect(asset)}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
            selected === asset
              ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          {asset}
        </button>
      ))}
    </div>
  );
}
