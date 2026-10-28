import React, { useState } from 'react';
import { Customer, PreparedIceCream, Order } from '@/src/types/game';
import { sound } from '@/src/game/audio/soundManager';
import { Bell, Camera, Sparkles, Heart } from 'lucide-react';
import { formatCustomerOrderSpeech } from '@/src/game/utils/orderUtils';

interface ParlorWorld3DOverlayProps {
  currentCustomer: Customer | null;
  isCustomerCelebrating: boolean;
  victoriaAction: 'idle' | 'scooping' | 'celebrating' | 'thinking';
  prepared: PreparedIceCream;
  onBellClick: () => void;
  canSubmit: boolean;
  onCameraModeChange: (mode: 'parlor' | 'assembly' | 'closeUp') => void;
  activeOrder?: Order | null;
  gameMode?: string;
}

export const ParlorWorld3DOverlay: React.FC<ParlorWorld3DOverlayProps> = ({
  currentCustomer,
  isCustomerCelebrating,
  victoriaAction,
  prepared,
  onBellClick,
  canSubmit,
  onCameraModeChange,
  activeOrder,
  gameMode,
}) => {
  const [bellPressed, setBellPressed] = useState(false);
  const [activeCam, setActiveCam] = useState<'parlor' | 'assembly' | 'closeUp'>('parlor');

  const handleRingBell = () => {
    sound.playBell();
    setBellPressed(true);
    setTimeout(() => setBellPressed(false), 200);
    onBellClick();
  };

  const handleCamSelect = (cam: 'parlor' | 'assembly' | 'closeUp') => {
    sound.playClick();
    setActiveCam(cam);
    onCameraModeChange(cam);
  };

  // Victoria's speech in 3D
  const getVictoriaSpeech = () => {
    if (victoriaAction === 'scooping') return '¡Mmm, esa bola quedó perfecta! 🍨';
    if (victoriaAction === 'celebrating') return '¡Helado delicioso! ¡Cliente feliz! ⭐💖';
    if (prepared.scoops.length > 0) return '¡Toca la campana para entregar! ✨';
    return '«¡Hola! Elige sabores y toppings abajo» 🌸';
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-2 sm:p-3 select-none">
      {/* Top Section: Dialogues and Camera Controls */}
      <div className="w-full flex items-start justify-between gap-1.5 mt-14 sm:mt-16 px-1 sm:px-6">
        {/* Left: Chef Victoria Speech Bubble */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border-2 border-pink-300 shadow-md max-w-xs animate-in fade-in">
          <img
            src="/assets/aistudio/image_aebcaa13.png"
            alt="Chef Victoria"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover object-top border-2 border-amber-300 shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] sm:text-[11px] font-black text-pink-700">Chef Victoria</span>
              <span className="text-[8px] sm:text-[9px] bg-amber-400 text-amber-950 font-black px-1.5 rounded-full">3D</span>
            </div>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-700 leading-tight mt-0.5">
              {getVictoriaSpeech()}
            </p>
          </div>
        </div>

        {/* Center: Camera Presets Selector */}
        <div className="pointer-events-auto hidden md:flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-full border-2 border-amber-300 shadow-md">
          <button
            onClick={() => handleCamSelect('parlor')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-black transition cursor-pointer ${
              activeCam === 'parlor'
                ? 'bg-amber-400 text-amber-950 shadow-xs scale-105'
                : 'text-slate-600 hover:text-amber-800'
            }`}
          >
            🎥 Salón
          </button>
          <button
            onClick={() => handleCamSelect('assembly')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-black transition cursor-pointer ${
              activeCam === 'assembly'
                ? 'bg-amber-400 text-amber-950 shadow-xs scale-105'
                : 'text-slate-600 hover:text-amber-800'
            }`}
          >
            🍨 Helado
          </button>
          <button
            onClick={() => handleCamSelect('closeUp')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-black transition cursor-pointer ${
              activeCam === 'closeUp'
                ? 'bg-amber-400 text-amber-950 shadow-xs scale-105'
                : 'text-slate-600 hover:text-amber-800'
            }`}
          >
            👑 Victoria
          </button>
        </div>

        {/* Right: Active Customer Speech Bubble */}
        {currentCustomer && (
          <div className="pointer-events-auto hidden xs:flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-md px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl border-2 border-amber-300 shadow-md max-w-[200px] sm:max-w-sm animate-in fade-in ml-auto">
            <div className="text-left">
              <div className="text-[10px] sm:text-[11px] font-black text-amber-950 flex items-center justify-between gap-1">
                <span className="flex items-center gap-1">
                  <span>{currentCustomer.favoriteFlavor === 'chocolate' ? '🍫' : '🍨'}</span>
                  <span>{currentCustomer.name.split(' ')[0]}</span>
                </span>
                {activeOrder && (
                  <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1 rounded">
                    +{activeOrder.rewardCoins}🪙
                  </span>
                )}
              </div>
              <p className="text-[9px] sm:text-[10px] font-black text-pink-700 leading-tight mt-0.5 line-clamp-2">
                {isCustomerCelebrating
                  ? '«¡Qué delicia! ¡Gracias Victoria!»'
                  : activeOrder
                  ? formatCustomerOrderSpeech(activeOrder)
                  : currentCustomer.dialogueIntro[0]}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3D Orbit Interaction Hint */}
      <div className="self-center mb-1 hidden sm:block bg-black/40 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold px-3 py-0.5 rounded-full border border-white/20">
        👆 Puedes arrastrar la pantalla para rotar y explorar la heladería 3D
      </div>

      {/* Bottom Floating Service Bell on the Counter */}
      <div className="w-full flex items-center justify-between px-4 sm:px-10 pb-24 sm:pb-28">
        <div className="pointer-events-auto">
          <button
            onClick={handleRingBell}
            disabled={!canSubmit}
            title="Tocar campana para entregar pedido"
            className={`group flex items-center gap-2 p-3 sm:px-5 sm:py-3 rounded-2xl border-2 transition-all cursor-pointer shadow-2xl ${
              canSubmit
                ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 border-amber-200 animate-pulse active:scale-95'
                : 'bg-white/80 text-amber-900/40 border-amber-200 cursor-not-allowed opacity-60'
            } ${bellPressed ? 'scale-90' : ''}`}
          >
            <div className="relative">
              <Bell className={`w-7 h-7 fill-amber-950 transition-transform ${bellPressed ? 'rotate-12' : ''}`} />
              {canSubmit && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-black leading-none">Campana Dorada 3D</div>
              <div className="text-[10px] font-bold text-amber-900/90">¡Entregar Helado!</div>
            </div>
          </button>
        </div>

        {/* Mobile Camera Toggle */}
        <div className="pointer-events-auto flex md:hidden items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-full border border-amber-300 shadow-md">
          <button
            onClick={() => handleCamSelect(activeCam === 'parlor' ? 'assembly' : activeCam === 'assembly' ? 'closeUp' : 'parlor')}
            className="px-2.5 py-1 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black flex items-center gap-1"
          >
            <Camera className="w-3 h-3" />
            <span>Cámara: {activeCam === 'parlor' ? 'Salón' : activeCam === 'assembly' ? 'Helado' : 'Victoria'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
