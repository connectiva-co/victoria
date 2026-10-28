import React, { useState } from 'react';
import { ShopItem } from '@/src/types/game';
import { sound } from '@/src/game/audio/soundManager';
import { X, ShoppingBag, Coins, Check, Sparkles } from 'lucide-react';

interface ShopModalProps {
  coins: number;
  shopItems: ShopItem[];
  onBuyItem: (item: ShopItem) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  coins,
  shopItems,
  onBuyItem,
  onClose,
}) => {
  const [filter, setFilter] = useState<'all' | 'flavor' | 'decor' | 'wardrobe'>('all');

  const filteredItems = shopItems.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const handleBuy = (item: ShopItem) => {
    if (item.unlocked) return;
    if (coins < item.price) {
      sound.playError();
      return;
    }
    sound.playCoins();
    onBuyItem(item);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-100 to-pink-100 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-600" />
            <div>
              <h2 className="text-lg font-black text-slate-800">Tienda y Mejoras de Victoria</h2>
              <p className="text-xs text-slate-500">
                Desbloquea nuevos sabores, decoración y atuendos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white px-3.5 py-1.5 rounded-full border-2 border-amber-300 shadow-xs flex items-center gap-1.5">
              <Coins className="w-4 h-4 fill-amber-400 text-amber-600" />
              <span className="tabular-nums font-black text-amber-900 text-sm">{coins}</span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-white/80 text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex gap-2">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'flavor', label: '🍨 Sabores' },
            { id: 'decor', label: '🎨 Decoración' },
            { id: 'wardrobe', label: '👗 Atuendos' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setFilter(cat.id as any);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                filter === cat.id
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredItems.map((item) => {
            const canAfford = coins >= item.price;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition ${
                  item.unlocked
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-amber-200 bg-white hover:border-amber-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{item.icon}</span>
                    {item.unlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Desbloqueado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                        <Coins className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                        <span>{item.price}</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-black text-slate-800 mt-2">{item.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>

                  {item.effect && (
                    <div className="mt-2 text-[11px] font-bold text-pink-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-pink-500" />
                      <span>{item.effect}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    disabled={item.unlocked || !canAfford}
                    onClick={() => handleBuy(item)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                      item.unlocked
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : canAfford
                        ? 'bg-amber-400 hover:bg-amber-500 text-amber-950 active:scale-95'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {item.unlocked
                      ? 'Adquirido'
                      : canAfford
                      ? `Comprar por ${item.price} monedas`
                      : `Faltan ${item.price - coins} monedas`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
