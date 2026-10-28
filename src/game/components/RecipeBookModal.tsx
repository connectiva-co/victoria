import React, { useState } from 'react';
import { Recipe } from '@/src/types/game';
import { INITIAL_FLAVORS, INITIAL_TOPPINGS, INITIAL_SAUCES, INITIAL_CONTAINERS } from '@/src/game/data/gameData';
import { CONTAINER_ICONS } from '@/src/game/utils/orderUtils';
import { sound } from '@/src/game/audio/soundManager';
import { X, BookOpen, Lock, Sparkles, Coins } from 'lucide-react';

interface RecipeBookModalProps {
  recipes: Recipe[];
  currentLevel: number;
  onClose: () => void;
}

export const RecipeBookModal: React.FC<RecipeBookModalProps> = ({
  recipes,
  currentLevel,
  onClose,
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(recipes[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-100 to-pink-100 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-pink-600" />
            <div>
              <h2 className="text-lg font-black text-slate-800">Recetario Artesanal de Victoria</h2>
              <p className="text-xs text-slate-500">
                {recipes.length} creaciones exclusivas · Nivel actual: {currentLevel}
              </p>
            </div>
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

        {/* Content Body: Left List, Right Detail */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Recipe List */}
          <div className="space-y-2">
            {recipes.map((rec) => {
              const isLocked = rec.unlockLevel > currentLevel;
              const isSelected = selectedRecipe.id === rec.id;

              return (
                <button
                  key={rec.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedRecipe(rec);
                  }}
                  className={`w-full p-3 rounded-2xl border-2 text-left transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-pink-500 bg-pink-50 shadow-sm'
                      : 'border-slate-100 hover:border-pink-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">
                      {CONTAINER_ICONS[rec.container] || '🍨'}
                    </span>
                    <div>
                      <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        {rec.name}
                        {isLocked && <Lock className="w-3 h-3 text-amber-600" />}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {rec.flavors.length} bolas · {rec.toppings.length} toppings
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-amber-600 flex items-center justify-end gap-1">
                      <Coins className="w-3 h-3 fill-amber-400" />
                      <span>{rec.price}</span>
                    </div>
                    {isLocked ? (
                      <span className="text-[10px] text-rose-500 font-bold">Nivel {rec.unlockLevel}</span>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-bold">Disponible</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Selected Recipe Card Preview */}
          <div className="bg-pink-50/50 rounded-2xl border-2 border-pink-200 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
                  Receta Oficial
                </span>
                <span className="text-xs font-black text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{selectedRecipe.price} monedas</span>
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-800 mt-2">{selectedRecipe.name}</h3>
              <p className="text-xs text-slate-600 mt-1 italic">{selectedRecipe.description}</p>

              {/* Ingredients breakdown */}
              <div className="mt-4 space-y-3">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Recipiente</div>
                  <div className="text-xs font-bold text-slate-700 mt-0.5 capitalize">
                    {INITIAL_CONTAINERS.find((c) => c.id === selectedRecipe.container)?.name || selectedRecipe.container}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Sabores de Helado</div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedRecipe.flavors.map((flId, i) => {
                      const fl = INITIAL_FLAVORS.find((f) => f.id === flId);
                      return (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs"
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/10"
                            style={{ backgroundColor: fl?.color }}
                          />
                          <span>{fl?.name || flId}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Toppings y Decoración</div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedRecipe.toppings.map((topId, i) => {
                      const top = INITIAL_TOPPINGS.find((t) => t.id === topId);
                      return (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-lg text-xs font-bold bg-white border border-slate-200 flex items-center gap-1 shadow-2xs"
                        >
                          <span>{top?.icon || '✨'}</span>
                          <span>{top?.name || topId}</span>
                        </span>
                      );
                    })}
                    {selectedRecipe.sauce && (
                      <span className="px-2 py-1 rounded-lg text-xs font-bold bg-pink-100 text-pink-800 border border-pink-200 shadow-2xs">
                        Salsa: {INITIAL_SAUCES.find((s) => s.id === selectedRecipe.sauce)?.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between text-xs text-pink-700 font-bold">
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span>Otorga +{selectedRecipe.xp} Puntos XP</span>
              </span>
              <span>{selectedRecipe.unlockLevel > currentLevel ? '🔒 Bloqueado' : '✅ Desbloqueado'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
