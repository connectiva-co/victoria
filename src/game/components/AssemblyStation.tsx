import React, { useState } from 'react';
import {
  ContainerInfo,
  ContainerType,
  FlavorId,
  FlavorInfo,
  PreparedIceCream,
  SauceId,
  SauceInfo,
  ToppingId,
  ToppingInfo,
} from '@/src/types/game';
import { sound } from '@/src/game/audio/soundManager';
import { Bell, RotateCcw, ChevronDown, ChevronUp, Check } from 'lucide-react';

interface AssemblyStationProps {
  prepared: PreparedIceCream;
  flavors: FlavorInfo[];
  containers: ContainerInfo[];
  toppings: ToppingInfo[];
  sauces: SauceInfo[];
  onSelectContainer: (c: ContainerType) => void;
  onAddScoop: (f: FlavorId) => void;
  onToggleTopping: (t: ToppingId) => void;
  onSetSauce: (s: SauceId | null) => void;
  onResetIceCream: () => void;
  onSubmitOrder: () => void;
  isOrderActive: boolean;
}

export const AssemblyStation: React.FC<AssemblyStationProps> = ({
  prepared,
  flavors,
  containers,
  toppings,
  sauces,
  onSelectContainer,
  onAddScoop,
  onToggleTopping,
  onSetSauce,
  onResetIceCream,
  onSubmitOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'recipiente' | 'sabores' | 'toppings' | 'salsas'>('sabores');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeContainer = containers.find((c) => c.id === prepared.container);
  const maxCapacity = activeContainer?.capacity || 3;
  const currentScoopCount = prepared.scoops.length;
  const canAddMoreScoops = !!prepared.container && currentScoopCount < maxCapacity;

  const handleContainerClick = (c: ContainerType) => {
    sound.playClick();
    onSelectContainer(c);
    setActiveTab('sabores');
  };

  const handleFlavorClick = (flavor: FlavorInfo) => {
    if (!prepared.container) {
      sound.playError();
      setActiveTab('recipiente');
      return;
    }
    if (!canAddMoreScoops) {
      sound.playError();
      return;
    }
    sound.playScoop();
    onAddScoop(flavor.id);
  };

  const handleToppingClick = (top: ToppingInfo) => {
    if (!prepared.container || prepared.scoops.length === 0) {
      sound.playError();
      return;
    }
    sound.playSprinkles();
    onToggleTopping(top.id);
  };

  const handleSauceClick = (s: SauceInfo) => {
    if (!prepared.container || prepared.scoops.length === 0) {
      sound.playError();
      return;
    }
    sound.playSauce();
    onSetSauce(prepared.sauce === s.id ? null : s.id);
  };

  const handleBellSubmit = () => {
    if (!prepared.container || prepared.scoops.length === 0) {
      sound.playError();
      return;
    }
    sound.playBell();
    onSubmitOrder();
  };

  return (
    <div className="pointer-events-auto fixed bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 w-[98%] sm:w-[96%] max-w-3xl z-40 transition-all duration-300">
      {/* Sleek Collapse Toggle Tab */}
      <div className="flex justify-center items-center gap-2 -mb-0.5">
        <button
          onClick={() => {
            sound.playClick();
            setIsCollapsed(!isCollapsed);
          }}
          className="px-3 py-0.5 rounded-t-xl bg-pink-500 hover:bg-pink-600 text-white text-[10px] sm:text-[11px] font-black shadow-md flex items-center gap-1 cursor-pointer transition hover:scale-105"
        >
          {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{isCollapsed ? '▲ Bandeja de Ingredientes' : '▼ Ocultar Bandeja'}</span>
        </button>

        {isCollapsed && prepared.container && prepared.scoops.length > 0 && (
          <button
            onClick={handleBellSubmit}
            className="px-3 py-0.5 rounded-t-xl bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black text-[10px] sm:text-[11px] shadow-md flex items-center gap-1 cursor-pointer animate-pulse hover:scale-105"
          >
            <Bell className="w-3 h-3 fill-amber-950" />
            <span>¡Entregar!</span>
          </button>
        )}
      </div>

      {!isCollapsed && (
        <div className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl border-2 border-pink-300 p-1 sm:p-1.5 text-slate-800">
          {/* Top Bar with Category Tabs and Status (Space-Optimized) */}
          <div className="flex items-center justify-between pb-0.5 sm:pb-1 mb-0.5 sm:mb-1 border-b border-pink-100 flex-wrap gap-1">
            <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('recipiente');
                }}
                className={`px-1.5 sm:px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'recipiente'
                    ? 'bg-pink-500 text-white shadow-xs scale-105'
                    : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                }`}
              >
                <span>🍧</span>
                <span>Recipiente</span>
                {prepared.container && <span className="text-[8px] bg-white/30 px-1 rounded">✓</span>}
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('sabores');
                }}
                className={`px-1.5 sm:px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'sabores'
                    ? 'bg-pink-500 text-white shadow-xs scale-105'
                    : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                }`}
              >
                <span>🍨</span>
                <span>Sabores</span>
                <span className="text-[8px] sm:text-[9px] bg-pink-600/20 px-1 rounded-full text-pink-900 font-black">
                  {currentScoopCount}/{maxCapacity}
                </span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('toppings');
                }}
                className={`px-1.5 sm:px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'toppings'
                    ? 'bg-pink-500 text-white shadow-xs scale-105'
                    : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                }`}
              >
                <span>🍒</span>
                <span>Toppings</span>
                {prepared.toppings.length > 0 && (
                  <span className="text-[8px] sm:text-[9px] bg-pink-600/20 px-1 rounded-full text-pink-900 font-black">
                    {prepared.toppings.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('salsas');
                }}
                className={`px-1.5 sm:px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'salsas'
                    ? 'bg-pink-500 text-white shadow-xs scale-105'
                    : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                }`}
              >
                <span>🍯</span>
                <span>Salsas</span>
                {prepared.sauce && <span className="text-[8px] bg-white/30 px-1 rounded">✓</span>}
              </button>
            </div>

            {/* Reset & Submit Buttons */}
            <div className="flex items-center gap-1 ml-auto">
              {prepared.container && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onResetIceCream();
                  }}
                  title="Limpiar y empezar helado de nuevo"
                  className="px-1.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[9px] sm:text-[10px] font-bold flex items-center gap-0.5 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span className="hidden xs:inline">Limpiar</span>
                </button>
              )}

              <button
                onClick={handleBellSubmit}
                disabled={!prepared.container || prepared.scoops.length === 0}
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-black flex items-center gap-1 shadow-sm transition-all cursor-pointer ${
                  prepared.container && prepared.scoops.length > 0
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 scale-105 active:scale-95 animate-pulse'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                }`}
              >
                <Bell className="w-3 h-3 fill-amber-950" />
                <span>¡Entregar!</span>
              </button>
            </div>
          </div>

          {/* Compact Horizontal Item Ribbon */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
            {/* 1. Recipiente Tab */}
            {activeTab === 'recipiente' &&
              containers.map((cont) => {
                const isSelected = prepared.container === cont.id;
                const icons: Record<ContainerType, string> = {
                  cono: '🍦',
                  vaso: '🍧',
                  copa: '🍨',
                  waffle: '🧇',
                  canasta: '🥧',
                  banana_boat: '🍌',
                  coco: '🥥',
                };
                return (
                  <button
                    key={cont.id}
                    onClick={() => handleContainerClick(cont.id)}
                    className={`shrink-0 px-2.5 py-1 rounded-lg border-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-pink-500 bg-pink-100 ring-1 ring-pink-300'
                        : 'border-amber-200 bg-amber-50/50 hover:bg-pink-50'
                    }`}
                  >
                    <span className="text-lg">{icons[cont.id]}</span>
                    <div className="text-left">
                      <div className="text-[10px] font-black text-slate-800 flex items-center gap-1">
                        {cont.name.split(' ')[0]} {cont.name.split(' ')[1] || ''}
                        {isSelected && <Check className="w-2.5 h-2.5 text-pink-600" />}
                      </div>
                      <div className="text-[8px] text-pink-700 font-bold">
                        {cont.capacity} bolas máx.
                      </div>
                    </div>
                  </button>
                );
              })}

            {/* 2. Sabores Tab */}
            {activeTab === 'sabores' && (
              <>
                {!prepared.container && (
                  <button
                    onClick={() => setActiveTab('recipiente')}
                    className="shrink-0 px-2 py-1 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold flex items-center gap-1"
                  >
                    <span>💡 Selecciona primero un recipiente aquí ➔</span>
                  </button>
                )}
                {flavors.map((fl) => {
                  const isLocked = !fl.unlocked;
                  return (
                    <button
                      key={fl.id}
                      disabled={isLocked || !canAddMoreScoops}
                      onClick={() => handleFlavorClick(fl)}
                      className={`shrink-0 px-2 py-1 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                        isLocked
                          ? 'opacity-40 bg-gray-100 border-gray-200 cursor-not-allowed'
                          : canAddMoreScoops
                          ? 'bg-amber-50/70 hover:bg-pink-50 border-amber-200 hover:scale-105 active:scale-95'
                          : 'opacity-70 bg-gray-50 border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-inner border border-black/15 shrink-0"
                        style={{ backgroundColor: fl.color }}
                      />
                      <div className="text-left">
                        <div className="text-[10px] font-black text-slate-800">{fl.name.split(' ')[0]}</div>
                        {isLocked ? (
                          <span className="text-[8px] text-amber-700 font-bold">🔒 {fl.unlockCost} 🪙</span>
                        ) : (
                          <span className="text-[8px] text-pink-600 font-bold">+1 bola</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </>
            )}

            {/* 3. Toppings Tab */}
            {activeTab === 'toppings' &&
              toppings.map((top) => {
                const isLocked = !top.unlocked;
                const isAdded = prepared.toppings.includes(top.id);
                return (
                  <button
                    key={top.id}
                    disabled={isLocked}
                    onClick={() => handleToppingClick(top)}
                    className={`shrink-0 px-2 py-1 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                      isLocked
                        ? 'opacity-40 bg-gray-100 border-gray-200 cursor-not-allowed'
                        : isAdded
                        ? 'bg-pink-100 border-pink-400 ring-1 ring-pink-300'
                        : 'bg-amber-50/70 hover:bg-pink-50 border-amber-200'
                    }`}
                  >
                    <span className="text-base">{top.icon}</span>
                    <div className="text-left">
                      <div className="text-[10px] font-bold text-slate-800">{top.name.split(' ')[0]}</div>
                      {isLocked ? (
                        <span className="text-[8px] text-amber-700 font-bold">🔒 {top.unlockCost} 🪙</span>
                      ) : isAdded ? (
                        <span className="text-[8px] text-pink-600 font-bold">✓ Puesto</span>
                      ) : (
                        <span className="text-[8px] text-slate-500 font-bold">+ Añadir</span>
                      )}
                    </div>
                  </button>
                );
              })}

            {/* 4. Salsas Tab */}
            {activeTab === 'salsas' &&
              sauces.map((s) => {
                const isSelected = prepared.sauce === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSauceClick(s)}
                    className={`shrink-0 px-2 py-1 rounded-lg border-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-pink-100 border-pink-500 ring-1 ring-pink-300'
                        : 'bg-amber-50/70 hover:bg-pink-50 border-amber-200'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-inner border border-black/15 shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                    <div className="text-left">
                      <div className="text-[10px] font-black text-slate-800">{s.name.split(' ')[0]} {s.name.split(' ')[1] || ''}</div>
                      <div className="text-[8px] text-pink-700 font-bold">
                        {isSelected ? '✓ Bañado' : 'Bañar'}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
