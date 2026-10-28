import React, { useState } from 'react';
import { Customer, PreparedIceCream, VictoriaCustomization, Order } from '@/src/types/game';
import { ChefVictoriaPixar, CustomerPixar } from './PixarCharacters';
import { VisualIceCream } from './VisualIceCream';
import { sound } from '@/src/game/audio/soundManager';
import { Bell, Clock, Coins, CheckCircle2, ChevronDown, ChevronUp, X, Sparkles } from 'lucide-react';
import {
  CONTAINER_ICONS,
  CONTAINER_NAMES,
  getGroupedFlavors,
  getToppingInfo,
  getSauceInfo,
  formatCustomerOrderSpeech,
} from '@/src/game/utils/orderUtils';

interface ParlorWorld2DProps {
  victoriaCustomization: VictoriaCustomization;
  victoriaAction: 'idle' | 'scooping' | 'celebrating' | 'thinking';
  currentCustomer: Customer | null;
  isCustomerCelebrating: boolean;
  prepared: PreparedIceCream;
  onBellClick: () => void;
  canSubmit: boolean;
  activeOrder?: Order | null;
  gameMode?: string;
}

export const ParlorWorld2D: React.FC<ParlorWorld2DProps> = ({
  victoriaCustomization,
  victoriaAction,
  currentCustomer,
  isCustomerCelebrating,
  prepared,
  onBellClick,
  canSubmit,
  activeOrder,
  gameMode,
}) => {
  const [bellPressed, setBellPressed] = useState(false);
  const [showFullComanda, setShowFullComanda] = useState(false);

  const handleRingBell = () => {
    sound.playBell();
    setBellPressed(true);
    setTimeout(() => setBellPressed(false), 200);
    onBellClick();
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-amber-50 via-pink-50 to-rose-100">
      {/* 1. Background Decor: Sunlit Parlor Walls & Chalkboard */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Soft pastel wall arches */}
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-pink-100/70 to-transparent flex justify-around">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-40 h-44 rounded-b-full border-b-4 border-x-4 border-pink-200/50 bg-white/30 backdrop-blur-2xs"
            />
          ))}
        </div>

        {/* Hanging Fairy Lights / Bunting Garland */}
        <div className="absolute top-2 inset-x-0 flex justify-center gap-6 opacity-80">
          {['💡', '✨', '🌸', '✨', '💡', '✨', '🌸', '✨', '💡'].map((icon, idx) => (
            <span
              key={idx}
              className="text-lg animate-pulse"
              style={{ animationDelay: `${idx * 0.25}s` }}
            >
              {icon}
            </span>
          ))}
        </div>

        {/* Menu Chalkboard in Background Center */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-80 max-w-[85vw] h-24 rounded-2xl bg-slate-900 border-4 border-amber-300 shadow-xl p-2.5 text-center hidden md:flex flex-col justify-center items-center">
          <div className="text-[11px] font-black uppercase text-amber-400 tracking-widest flex items-center gap-1.5">
            <span>🍨</span> MENÚ DEL DÍA · VICTORIA <span>🍨</span>
          </div>
          <div className="text-[10px] text-pink-200 font-semibold mt-1">
            Vainilla · Chocolate · Fresa · Mango · Arequipe
          </div>
          <div className="text-[9px] text-amber-200/80 italic mt-0.5">
            «Hecho con amor y frutas frescas de verdad»
          </div>
        </div>
      </div>

      {/* 2. Main Stage: Characters & Elevated Ice Cream Counter Workstation */}
      <div className="relative z-10 w-full flex-1 flex items-end justify-between px-2 xs:px-4 sm:px-8 md:px-14 pb-16 sm:pb-24">
        {/* LEFT: Chef Victoria Character */}
        <div className="flex flex-col items-center w-28 xs:w-36 sm:w-44 md:w-52 shrink-0 transition-transform z-20">
          <ChefVictoriaPixar
            customization={victoriaCustomization}
            action={victoriaAction}
            className="w-full"
          />
        </div>

        {/* CENTER: The Active Artisanal Ice Cream Workstation (Elevated so controls never occlude it!) */}
        <div className="flex-1 flex flex-col items-center justify-center -translate-y-8 xs:-translate-y-12 sm:-translate-y-20 md:-translate-y-28 transition-transform z-30 pointer-events-none px-1">
          <div className="pointer-events-auto relative flex flex-col items-center">
            {/* Ambient Warm Golden Spotlight Halo */}
            <div className="absolute -inset-8 sm:-inset-10 bg-gradient-to-t from-amber-300/25 via-pink-300/20 to-transparent rounded-full blur-xl pointer-events-none" />

            {/* Ice Cream Render (responsive scaling) */}
            <div className="scale-85 xs:scale-95 sm:scale-100 md:scale-105 transition-transform">
              <VisualIceCream prepared={prepared} scale={1.0} />
            </div>

            {/* Rotating Workstation Marble Turntable Stand */}
            <div className="relative w-40 xs:w-48 sm:w-60 md:w-64 h-5 sm:h-7 -mt-2 rounded-full bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 border-2 border-amber-300 shadow-xl flex items-center justify-center">
              <div className="w-32 xs:w-40 sm:w-48 h-3 sm:h-4 rounded-full bg-white/70 shadow-inner flex items-center justify-center">
                <span className="text-[8px] sm:text-[9px] font-black uppercase text-amber-900/70 tracking-widest">
                  ✨ Mesa de Creación ✨
                </span>
              </div>
            </div>
            {/* Gold Stand Base */}
            <div className="w-16 sm:w-24 h-3 sm:h-4 bg-gradient-to-b from-amber-300 to-amber-500 rounded-b-lg shadow-md -mt-0.5 border-t border-amber-400" />
          </div>
        </div>

        {/* RIGHT: The Active Customer with Expressive Speech Bubble */}
        <div className="flex flex-col items-center w-32 xs:w-40 sm:w-48 md:w-56 shrink-0 transition-transform z-20">
          {currentCustomer ? (
            <>
              {/* Customer Speech & Order Bubble (Right Side Order Hub) */}
              <div className="relative translate-y-6 xs:translate-y-8 sm:translate-y-4 mb-1 bg-white/98 backdrop-blur-md rounded-2xl border-2 border-amber-400 p-2 sm:p-2.5 shadow-xl max-w-[190px] xs:max-w-[230px] sm:max-w-[270px] text-left animate-in fade-in z-20">
                {/* Header: Customer Name, Timer & Reward */}
                <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-amber-200 text-[10px] sm:text-xs">
                  <span className="font-black text-slate-800 flex items-center gap-1 truncate">
                    <span>{currentCustomer.favoriteFlavor === 'chocolate' ? '🍫' : '🍨'}</span>
                    <span className="truncate">{currentCustomer.name.split(' ')[0]}</span>
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {activeOrder && gameMode !== 'relaxed' && (
                      <span
                        className={`text-[10px] sm:text-[11px] font-black flex items-center gap-0.5 ${
                          (activeOrder.timeRemaining / activeOrder.targetSeconds) < 0.3
                            ? 'text-rose-600 animate-pulse'
                            : (activeOrder.timeRemaining / activeOrder.targetSeconds) < 0.6
                            ? 'text-amber-600'
                            : 'text-emerald-700'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{Math.ceil(activeOrder.timeRemaining)}s</span>
                      </span>
                    )}
                    {activeOrder && (
                      <span className="text-[9px] sm:text-[10px] font-black text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded-md flex items-center">
                        +{activeOrder.rewardCoins}🪙
                      </span>
                    )}
                    {activeOrder && (
                      <button
                        onClick={() => {
                          sound.playClick();
                          setShowFullComanda(true);
                        }}
                        title="Ver receta completa"
                        className="px-1.5 py-0.5 rounded-md bg-pink-100 hover:bg-pink-200 text-pink-900 text-[9px] font-black cursor-pointer transition flex items-center gap-0.5"
                      >
                        <span>Receta</span>
                        <ChevronDown className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Speech content */}
                {isCustomerCelebrating ? (
                  <p className="text-[10px] sm:text-[11px] font-black text-emerald-700 mt-1 leading-tight">
                    «¡Mmm, qué delicia de helado! ¡Gracias Victoria! ⭐⭐⭐»
                  </p>
                ) : activeOrder ? (
                  <div className="mt-1">
                    <p className="text-[9px] sm:text-[10px] font-black text-pink-800 leading-snug line-clamp-2">
                      {formatCustomerOrderSpeech(activeOrder)}
                    </p>

                    {/* Live Visual Badges of requested items */}
                    <div className="flex items-center gap-1 flex-wrap mt-1.5">
                      {/* Container */}
                      <span
                        className={`text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-2xs border ${
                          prepared.container === activeOrder.targetContainer
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                            : 'bg-amber-100 text-amber-950 border-amber-200'
                        }`}
                      >
                        <span>{CONTAINER_ICONS[activeOrder.targetContainer]}</span>
                        <span>{CONTAINER_NAMES[activeOrder.targetContainer]}</span>
                        {prepared.container === activeOrder.targetContainer && (
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 inline ml-0.5" />
                        )}
                      </span>

                      {/* Flavors */}
                      {getGroupedFlavors(activeOrder.targetFlavors).map((fl) => {
                        const count = prepared.scoops.filter((s) => s.flavor === fl.id).length;
                        const isDone = count >= fl.count;
                        return (
                          <span
                            key={fl.id}
                            className={`text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-2xs border ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                                : 'bg-rose-50 text-rose-950 border-rose-200'
                            }`}
                            style={{ borderLeftWidth: '3px', borderLeftColor: fl.color }}
                          >
                            <span>{fl.icon}</span>
                            <span>
                              {fl.count > 1 ? `${fl.count}x ` : ''}
                              {fl.name}
                            </span>
                            {isDone ? (
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 inline ml-0.5" />
                            ) : count > 0 ? (
                              <span className="text-[8px] text-amber-700 font-bold">
                                ({count}/{fl.count})
                              </span>
                            ) : null}
                          </span>
                        );
                      })}

                      {/* Toppings */}
                      {activeOrder.targetToppings.map((topId) => {
                        const top = getToppingInfo(topId);
                        const isDone = prepared.toppings.includes(topId);
                        return (
                          <span
                            key={topId}
                            className={`text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-2xs border ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                                : 'bg-purple-50 text-purple-950 border-purple-200'
                            }`}
                          >
                            <span>{top.icon}</span>
                            <span>{top.name}</span>
                            {isDone && (
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 inline ml-0.5" />
                            )}
                          </span>
                        );
                      })}

                      {/* Sauce */}
                      {activeOrder.targetSauce && (
                        (() => {
                          const sauce = getSauceInfo(activeOrder.targetSauce);
                          const isDone = prepared.sauce === activeOrder.targetSauce;
                          return (
                            <span
                              className={`text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-2xs border ${
                                isDone
                                  ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                                  : 'bg-amber-50 text-amber-950 border-amber-200'
                              }`}
                            >
                              <span>{sauce.icon}</span>
                              <span>{sauce.name}</span>
                              {isDone && (
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 inline ml-0.5" />
                              )}
                            </span>
                          );
                        })()
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-600 mt-1 italic">
                    «¡Hola! Esperando mi turno...»
                  </p>
                )}

                {/* Speech Bubble Pointer tail towards customer */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r-2 border-b-2 border-amber-400 rotate-45" />
              </div>

              {/* Full Interactive Recipe Comanda Modal (Opened from right ticket) */}
              {showFullComanda && activeOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
                  <div className="bg-white rounded-2xl border-3 border-amber-400 shadow-2xl p-4 w-full max-w-sm max-h-[85vh] overflow-y-auto text-slate-800">
                    <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-amber-200">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">📋</span>
                        <div>
                          <div className="text-sm font-black text-slate-900">
                            Comanda: {activeOrder.customerName}
                          </div>
                          <div className="text-[10px] font-bold text-pink-600">
                            {activeOrder.recipeName || 'Pedido Personalizado'}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          sound.playClick();
                          setShowFullComanda(false);
                        }}
                        className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-2.5 bg-pink-50 p-2.5 rounded-xl border border-pink-100">
                      <div className="text-[10px] font-black uppercase text-pink-900 tracking-wider mb-0.5">
                        💬 Lo que pide el cliente:
                      </div>
                      <p className="text-xs font-black text-pink-900">
                        {formatCustomerOrderSpeech(activeOrder)}
                      </p>
                    </div>

                    {/* Step by step checklist */}
                    <div className="mt-3 space-y-1.5">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                        Paso a paso de la preparación:
                      </div>

                      {/* Recipiente */}
                      <div
                        className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                          prepared.container === activeOrder.targetContainer
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                            : 'bg-amber-50 border-amber-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{CONTAINER_ICONS[activeOrder.targetContainer]}</span>
                          <div>
                            <div className="font-black">Recipiente: {CONTAINER_NAMES[activeOrder.targetContainer]}</div>
                          </div>
                        </div>
                        {prepared.container === activeOrder.targetContainer ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-black text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> ¡Listo!
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-950 font-bold text-[10px]">
                            Pendiente
                          </span>
                        )}
                      </div>

                      {/* Sabores */}
                      {getGroupedFlavors(activeOrder.targetFlavors).map((fl) => {
                        const count = prepared.scoops.filter((s) => s.flavor === fl.id).length;
                        const isDone = count >= fl.count;
                        return (
                          <div
                            key={fl.id}
                            className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                              isDone
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                                : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{fl.icon}</span>
                              <div>
                                <div className="font-black">
                                  {fl.name}: {fl.count} {fl.count === 1 ? 'bola' : 'bolas'}
                                </div>
                              </div>
                            </div>
                            {isDone ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-black text-[10px] flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> {fl.count}/{fl.count}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-950 font-bold text-[10px]">
                                {count}/{fl.count}
                              </span>
                            )}
                          </div>
                        );
                      })}

                      {/* Toppings */}
                      {activeOrder.targetToppings.map((topId) => {
                        const top = getToppingInfo(topId);
                        const isDone = prepared.toppings.includes(topId);
                        return (
                          <div
                            key={topId}
                            className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                              isDone
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                                : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{top.icon}</span>
                              <div className="font-black">{top.fullName}</div>
                            </div>
                            {isDone ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-black text-[10px] flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> ¡Listo!
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-950 font-bold text-[10px]">
                                Falta
                              </span>
                            )}
                          </div>
                        );
                      })}

                      {/* Sauce */}
                      {activeOrder.targetSauce && (
                        (() => {
                          const sauce = getSauceInfo(activeOrder.targetSauce);
                          const isDone = prepared.sauce === activeOrder.targetSauce;
                          return (
                            <div
                              className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                                isDone
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                                  : 'bg-slate-50 border-slate-200 text-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{sauce.icon}</span>
                                <div className="font-black">{sauce.fullName}</div>
                              </div>
                              {isDone ? (
                                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-black text-[10px] flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> ¡Listo!
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-950 font-bold text-[10px]">
                                  Falta
                                </span>
                              )}
                            </div>
                          );
                        })()
                      )}
                    </div>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setShowFullComanda(false);
                      }}
                      className="mt-3 w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs transition cursor-pointer"
                    >
                      Entendido, ¡a servir!
                    </button>
                  </div>
                </div>
              )}

              <CustomerPixar
                customer={currentCustomer}
                isCelebrating={isCustomerCelebrating}
                className="w-full"
              />
            </>
          ) : (
            <div className="h-44 sm:h-64 flex flex-col items-center justify-center text-slate-400 text-center animate-pulse">
              <span className="text-3xl sm:text-4xl">🚪</span>
              <span className="text-[10px] sm:text-xs font-bold mt-1 text-slate-500">Próximo cliente...</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Front Marble Parlor Counter Barrier (low-profile ground anchor) */}
      <div className="absolute bottom-0 inset-x-0 h-12 sm:h-16 md:h-20 z-20 pointer-events-none">
        {/* Brass Molded Counter Edge */}
        <div className="w-full h-2 sm:h-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 shadow-md border-b border-amber-600" />

        {/* Polished Warm Cream Marble Counter Top */}
        <div className="w-full h-full bg-gradient-to-b from-[#fffbeb] via-[#fef3c7] to-[#fde68a] border-t border-amber-200 shadow-2xl relative flex items-center justify-between px-3 sm:px-6">
          {/* Left Service Bell (Interactive on counter) */}
          <div className="pointer-events-auto flex items-center gap-1.5">
            <button
              onClick={handleRingBell}
              disabled={!canSubmit}
              title="Tocar campana para entregar pedido"
              className={`group flex items-center gap-1.5 p-1.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer shadow-lg ${
                canSubmit
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 border-amber-300 animate-pulse active:scale-95'
                  : 'bg-amber-100/60 text-amber-800/50 border-amber-200 cursor-not-allowed opacity-60'
              } ${bellPressed ? 'scale-90' : ''}`}
            >
              <div className="relative">
                <Bell className={`w-4 h-4 sm:w-6 sm:h-6 fill-amber-950 transition-transform ${bellPressed ? 'rotate-12' : ''}`} />
                {canSubmit && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-black leading-none">Campana Dorada</div>
                <div className="text-[10px] font-bold text-amber-900/80">¡Listo para Servir!</div>
              </div>
            </button>
          </div>

          {/* Ice Cream Display Cooler with Tub Colors in Counter Center */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/10 p-1.5 sm:p-2 rounded-2xl border border-amber-300/60 shadow-inner">
            <div className="text-[10px] font-black uppercase text-amber-900/70 hidden md:block mr-1">
              Vitrina Fresca:
            </div>
            {[
              { color: '#fef08a', name: 'Vainilla' },
              { color: '#5c2d13', name: 'Chocolate' },
              { color: '#f43f5e', name: 'Fresa' },
              { color: '#fb923c', name: 'Mango' },
              { color: '#b45309', name: 'Arequipe' },
            ].map((tub, idx) => (
              <div
                key={idx}
                title={tub.name}
                className="w-6 h-6 rounded-full border-2 border-white shadow-md transform hover:scale-110 transition cursor-pointer"
                style={{ backgroundColor: tub.color }}
              />
            ))}
          </div>

          {/* Right Counter Decor: Glass Jars */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-2xl" title="Frasco de cerezas">🍒</div>
            <div className="text-2xl" title="Frasco de chispas">✨</div>
            <div className="text-2xl" title="Frasco de galletas">🍪</div>
          </div>
        </div>
      </div>
    </div>
  );
};
