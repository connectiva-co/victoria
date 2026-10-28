import React, { useState, useEffect } from 'react';
import { Order, PreparedIceCream } from '@/src/types/game';
import {
  CONTAINER_ICONS,
  CONTAINER_NAMES,
  getGroupedFlavors,
  getToppingInfo,
  getSauceInfo,
  formatCustomerOrderSpeech,
} from '@/src/game/utils/orderUtils';
import { Clock, Coins, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, CircleDot } from 'lucide-react';
import { sound } from '@/src/game/audio/soundManager';

interface OrderHUDProps {
  order: Order | null;
  gameMode: string;
  prepared?: PreparedIceCream;
}

export const OrderHUD: React.FC<OrderHUDProps> = ({ order, gameMode, prepared }) => {
  // Mobile / compact screen auto-collapse into clean ticker, but expanded can be opened anytime
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 || window.innerHeight < 650;
    }
    return false;
  });

  if (!order) {
    return (
      <div className="pointer-events-none fixed top-14 left-2 sm:left-4 z-20">
        <div className="bg-white/95 backdrop-blur-md border-2 border-pink-200 px-3 py-1.5 rounded-full shadow-md flex items-center gap-2 text-xs font-bold text-pink-700 animate-pulse">
          <span className="text-base">🍨</span>
          <span>Esperando cliente en el mostrador...</span>
        </div>
      </div>
    );
  }

  const patiencePercent = Math.max(0, Math.min(100, (order.timeRemaining / order.targetSeconds) * 100));

  let patienceColor = 'bg-emerald-500';
  let patienceTextColor = 'text-emerald-700';
  if (patiencePercent < 30) {
    patienceColor = 'bg-rose-500 animate-pulse';
    patienceTextColor = 'text-rose-700 font-black animate-pulse';
  } else if (patiencePercent < 60) {
    patienceColor = 'bg-amber-500';
    patienceTextColor = 'text-amber-700';
  }

  const groupedFlavors = getGroupedFlavors(order.targetFlavors);
  const orderSpeech = formatCustomerOrderSpeech(order);

  // Live checklist verification if prepared is provided
  const hasCorrectContainer = prepared?.container === order.targetContainer;
  const containerCurrentName = prepared?.container ? CONTAINER_NAMES[prepared.container] : null;

  // Count current scoops
  const currentScoopCounts: Record<string, number> = {};
  prepared?.scoops.forEach((s) => {
    currentScoopCounts[s.flavor] = (currentScoopCounts[s.flavor] || 0) + 1;
  });

  return (
    <div className="pointer-events-auto fixed top-14 sm:top-16 left-2 sm:left-4 z-30 max-w-[calc(100vw-16px)] sm:max-w-md transition-all duration-300">
      {/* 1. COMPACT TICKET (Never cryptic dots! Always clear text + icons) */}
      {isCollapsed ? (
        <div
          onClick={() => {
            sound.playClick();
            setIsCollapsed(false);
          }}
          className="bg-white/95 backdrop-blur-md rounded-2xl border-2 border-amber-400 shadow-xl p-2 cursor-pointer hover:bg-amber-50/90 transition-all group"
          title="Toca para ver la comanda y checklist completo"
        >
          {/* Header row: Customer name, Time, Coins and Expand button */}
          <div className="flex items-center justify-between gap-1.5 pb-1 border-b border-amber-200/70 text-xs">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-sm">👤</span>
              <span className="font-black text-slate-900 text-xs">
                {order.customerName.split(' ')[0]} pide:
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {gameMode !== 'relaxed' && (
                <span className={`text-[11px] font-black flex items-center gap-0.5 ${patienceTextColor}`}>
                  <Clock className="w-3 h-3" />
                  <span>{Math.ceil(order.timeRemaining)}s</span>
                </span>
              )}
              <span className="text-[11px] font-black text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded-md flex items-center">
                <Coins className="w-3 h-3 fill-amber-500 text-amber-600 mr-0.5" />
                +{order.rewardCoins}
              </span>
              <button
                type="button"
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-800 text-[10px] font-black transition cursor-pointer"
              >
                <span>Ver comanda</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Body row: Explicit text chips for Container, Flavors, Toppings, Sauce */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1.5 text-xs">
            {/* Container badge */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-black text-[11px] shadow-2xs border ${
                hasCorrectContainer
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-amber-100 text-amber-950 border-amber-300'
              }`}
            >
              <span>{CONTAINER_ICONS[order.targetContainer]}</span>
              <span>{CONTAINER_NAMES[order.targetContainer]}</span>
              {hasCorrectContainer && <CheckCircle2 className="w-3 h-3 text-emerald-600 inline ml-0.5" />}
            </span>

            {/* Flavor badges with exact names and counts (NOT ambiguous dots!) */}
            {groupedFlavors.map((fl) => {
              const currentCount = currentScoopCounts[fl.id] || 0;
              const isDone = currentCount >= fl.count;
              return (
                <span
                  key={fl.id}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-black text-[11px] shadow-2xs border ${
                    isDone
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'bg-white text-slate-900 border-slate-300'
                  }`}
                  style={{ borderLeftWidth: '4px', borderLeftColor: fl.color }}
                >
                  <span>{fl.icon}</span>
                  <span>
                    {fl.count > 1 ? `${fl.count}x ` : ''}
                    {fl.name}
                  </span>
                  {isDone ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 inline ml-0.5" />
                  ) : currentCount > 0 ? (
                    <span className="text-[10px] text-amber-700 font-bold">
                      ({currentCount}/{fl.count})
                    </span>
                  ) : null}
                </span>
              );
            })}

            {/* Topping badges */}
            {order.targetToppings.map((topId) => {
              const top = getToppingInfo(topId);
              const hasTopping = prepared?.toppings.includes(topId);
              return (
                <span
                  key={topId}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-black text-[11px] shadow-2xs border ${
                    hasTopping
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-purple-100 text-purple-950 border-purple-200'
                  }`}
                >
                  <span>{top.icon}</span>
                  <span>{top.name}</span>
                  {hasTopping && <CheckCircle2 className="w-3 h-3 text-emerald-600 inline ml-0.5" />}
                </span>
              );
            })}

            {/* Sauce badge */}
            {order.targetSauce && (
              (() => {
                const sauce = getSauceInfo(order.targetSauce);
                const hasSauce = prepared?.sauce === order.targetSauce;
                return (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-black text-[11px] shadow-2xs border ${
                      hasSauce
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-rose-100 text-rose-950 border-rose-200'
                    }`}
                  >
                    <span>{sauce.icon}</span>
                    <span>{sauce.name}</span>
                    {hasSauce && <CheckCircle2 className="w-3 h-3 text-emerald-600 inline ml-0.5" />}
                  </span>
                );
              })()
            )}
          </div>
        </div>
      ) : (
        /* 2. EXPANDED COMANDA: Full Authentic Heladería Recipe Ticket with Live Verification */
        <div className="bg-white/98 backdrop-blur-md rounded-2xl border-3 border-amber-400 shadow-2xl p-3 sm:p-4 text-slate-800 max-h-[82vh] overflow-y-auto animate-in zoom-in-95 duration-150">
          {/* Header Ticket Bar */}
          <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-amber-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">📋</span>
              <div>
                <div className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span>Comanda: {order.customerName}</span>
                </div>
                <div className="text-[10px] font-bold text-pink-600">
                  {order.recipeName || 'Pedido Personalizado'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-lg text-amber-900 font-black text-xs">
                <Coins className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                <span>+{order.rewardCoins}</span>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setIsCollapsed(true);
                }}
                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1 text-[11px] font-bold px-2"
                title="Minimizar comanda"
              >
                <span>Minimizar</span>
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Customer Quote in Big Clear Letters */}
          <div className="mt-2.5 bg-gradient-to-r from-amber-50 to-pink-50 p-2.5 rounded-xl border border-amber-200">
            <div className="text-[10px] font-black uppercase text-amber-900 tracking-wider mb-0.5 flex items-center gap-1">
              <span>💬</span> Lo que pide el cliente:
            </div>
            <p className="text-xs sm:text-sm font-black text-pink-900 leading-snug">
              {orderSpeech}
            </p>
          </div>

          {/* Interactive Recipe Checklist vs Workstation */}
          <div className="mt-3 space-y-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Paso a paso de la receta:
            </div>

            {/* 1. Container Item */}
            <div
              className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                hasCorrectContainer
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : prepared?.container
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-amber-50 border-amber-200 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{CONTAINER_ICONS[order.targetContainer]}</span>
                <div>
                  <div className="font-black text-xs">
                    Recipiente: {CONTAINER_NAMES[order.targetContainer]}
                  </div>
                  <div className="text-[10px] text-slate-600">
                    {hasCorrectContainer
                      ? '¡Recipiente correcto elegido!'
                      : prepared?.container
                      ? `Has elegido ${containerCurrentName} (Cámbialo a ${CONTAINER_NAMES[order.targetContainer]})`
                      : 'Toca abajo para elegir este recipiente'}
                  </div>
                </div>
              </div>

              <div>
                {hasCorrectContainer ? (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> ¡Listo!
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-950 font-bold text-[10px] flex items-center gap-1">
                    <CircleDot className="w-3 h-3" /> Pendiente
                  </span>
                )}
              </div>
            </div>

            {/* 2. Flavors Items */}
            {groupedFlavors.map((fl) => {
              const currentCount = currentScoopCounts[fl.id] || 0;
              const isDone = currentCount >= fl.count;
              return (
                <div
                  key={fl.id}
                  className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    isDone
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : currentCount > 0
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{fl.icon}</span>
                    <div>
                      <div className="font-black text-xs flex items-center gap-1">
                        <span>{fl.name}:</span>
                        <span className="bg-slate-200/80 px-1.5 py-0.2 rounded font-black text-[11px]">
                          {fl.count} {fl.count === 1 ? 'bola' : 'bolas'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-600">
                        {isDone
                          ? `¡Todas las ${fl.count} bolas de ${fl.name} servidas!`
                          : currentCount > 0
                          ? `Llevas ${currentCount} de ${fl.count} bolas`
                          : `Falta servir las bolas de ${fl.name}`}
                      </div>
                    </div>
                  </div>

                  <div>
                    {isDone ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {fl.count}/{fl.count}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-950 font-bold text-[10px]">
                        {currentCount}/{fl.count}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* 3. Toppings Items */}
            {order.targetToppings.map((topId) => {
              const top = getToppingInfo(topId);
              const hasTopping = prepared?.toppings.includes(topId);
              return (
                <div
                  key={topId}
                  className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    hasTopping
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{top.icon}</span>
                    <div>
                      <div className="font-black text-xs">Topping: {top.fullName}</div>
                      <div className="text-[10px] text-slate-600">
                        {hasTopping ? '¡Topping espolvoreado!' : 'Agrega este topping en la pestaña Toppings'}
                      </div>
                    </div>
                  </div>

                  <div>
                    {hasTopping ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> ¡Listo!
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-950 font-bold text-[10px]">
                        Falta agregar
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* 4. Sauce Item */}
            {order.targetSauce && (
              (() => {
                const sauce = getSauceInfo(order.targetSauce);
                const hasSauce = prepared?.sauce === order.targetSauce;
                return (
                  <div
                    className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                      hasSauce
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{sauce.icon}</span>
                      <div>
                        <div className="font-black text-xs">Salsa: {sauce.fullName}</div>
                        <div className="text-[10px] text-slate-600">
                          {hasSauce ? '¡Helado bañado con la salsa!' : 'Agrega esta salsa en la pestaña Salsas'}
                        </div>
                      </div>
                    </div>

                    <div>
                      {hasSauce ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> ¡Listo!
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-950 font-bold text-[10px]">
                          Falta bañar
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()
            )}
          </div>

          {/* Patience / Time Remaining Bar */}
          {gameMode !== 'relaxed' && (
            <div className="mt-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 mb-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Paciencia del cliente:</span>
                </span>
                <span className="tabular-nums font-black text-slate-900 text-xs">
                  {Math.ceil(order.timeRemaining)} segundos
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${patienceColor}`}
                  style={{ width: `${patiencePercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Minimize footer button */}
          <div className="mt-3 text-center">
            <button
              onClick={() => {
                sound.playClick();
                setIsCollapsed(true);
              }}
              className="w-full py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs transition shadow-sm cursor-pointer"
            >
              ▲ Minimizar comanda para preparar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
