import React, { useState } from 'react';
import { VictoriaCustomization } from '@/src/types/game';
import { Sparkles, Crown, Image as ImageIcon, Heart, Star, Sparkle } from 'lucide-react';
import { sound } from '@/src/game/audio/soundManager';

interface ChefVictoriaRealProps {
  customization?: VictoriaCustomization;
  action: 'idle' | 'scooping' | 'celebrating' | 'thinking';
  className?: string;
}

export const ChefVictoriaReal: React.FC<ChefVictoriaRealProps> = ({
  action,
  className = '',
}) => {
  // Option 1: Real photo Café table (image_7bb3ffec.png)
  // Option 2: Real photo Garden dress (image_63a13ec7.png)
  const [activePhoto, setActivePhoto] = useState<'cafe' | 'dress'>('cafe');

  let animClass = 'animate-breathing';
  if (action === 'scooping') animClass = 'animate-scoop-motion';
  if (action === 'celebrating') animClass = 'animate-bounce-celebrate';

  const photoSrc =
    activePhoto === 'cafe'
      ? '/assets/aistudio/image_7bb3ffec.png'
      : '/assets/aistudio/image_63a13ec7.png';

  // Responsive speech dialogue based on Victoria's character and current game action
  const getDialogue = () => {
    switch (action) {
      case 'scooping':
        return '¡Mmm, esa bola quedó redondita y deliciosa! 🍨';
      case 'celebrating':
        return '¡Helado perfecto! ¡Cliente muy feliz! ⭐💖';
      case 'thinking':
        return '¿Qué receta rica prepararemos ahora? 🤔✨';
      case 'idle':
      default:
        return activePhoto === 'cafe'
          ? '«¡Hola! Hago helados con mucho amor y frutas frescas» 🍨'
          : '«¡Bienvenidos a mi heladería artesanal!» 🌸';
    }
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${animClass} ${className}`}>
      {/* Speech / Greeting Dialogue Bubble above Victoria */}
      <div className="mb-1.5 max-w-[170px] sm:max-w-[210px] bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-2xl border-2 border-pink-300 shadow-md text-center animate-in fade-in zoom-in duration-300 relative z-30">
        <p className="text-[9px] sm:text-[10px] font-black text-pink-900 leading-snug">
          {getDialogue()}
        </p>
        {/* Dialogue arrow */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r-2 border-b-2 border-pink-300 rotate-45" />
      </div>

      {/* Floating Crown / Chef Victoria Golden Medallion */}
      <div className="relative z-30 -mb-2.5 sm:-mb-3 flex items-center justify-center filter drop-shadow-md">
        <div className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-amber-950 font-black text-[10px] sm:text-xs shadow-md flex items-center gap-1 sm:gap-1.5 border border-amber-200">
          <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-950" />
          <span>Chef Victoria</span>
          <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-800" />
        </div>
      </div>

      {/* Realistic Character Portrait with Studio Golden Rim & Ambient Glow */}
      <div className="relative w-28 xs:w-36 sm:w-44 md:w-52 aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden border-3 sm:border-4 border-amber-300 shadow-xl bg-gradient-to-b from-amber-100 via-pink-100 to-rose-200 group transition-all duration-300">
        {/* Real photo / 3D Pixar avatar of Victoria */}
        <img
          src={photoSrc}
          alt="Victoria Avatar"
          className="w-full h-full object-cover object-top filter brightness-105 contrast-105 transition-transform duration-500 group-hover:scale-105"
        />

        {/* Studio Lighting Highlights */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/20 pointer-events-none" />

        {/* Signature Yellow Flower Clip badge indicator */}
        <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded-full border border-pink-200 shadow-xs text-[8px] sm:text-[10px] font-bold text-pink-700 flex items-center gap-0.5 sm:gap-1">
          <Sparkle className="w-2.5 h-2.5 text-amber-500 fill-amber-400" />
          <span>Flor Amarilla</span>
        </div>

        {/* Quick Cycle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            sound.playClick();
            setActivePhoto((p) => (p === 'cafe' ? 'dress' : 'cafe'));
          }}
          title="Cambiar entre fotos reales de Victoria"
          className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 bg-black/60 hover:bg-black/85 text-white p-1 rounded-full backdrop-blur-xs transition cursor-pointer hover:scale-110 active:scale-95 shadow-md flex items-center gap-1"
        >
          <ImageIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>

        {/* Floating Celebration Stars Overlay */}
        {action === 'celebrating' && (
          <div className="absolute inset-0 bg-pink-500/25 pointer-events-none flex flex-col items-center justify-center animate-pulse">
            <div className="flex gap-1 text-xl sm:text-2xl animate-bounce">
              <span>⭐</span>
              <span>💖</span>
              <span>⭐</span>
            </div>
            <div className="mt-1 sm:mt-2 bg-pink-600/90 text-white text-[10px] sm:text-[11px] font-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-xl shadow-lg flex items-center gap-1">
              <Heart className="w-3 h-3 fill-white" />
              <span>¡Helado Estrella!</span>
            </div>
          </div>
        )}

        {/* Photo Mode Label at bottom */}
        <div className="absolute bottom-1.5 left-1.5 right-1.5 sm:bottom-2.5 sm:left-2.5 sm:right-2.5 flex items-center justify-between pointer-events-none">
          <div className="bg-white/95 backdrop-blur-xs px-1.5 sm:px-2 py-0.5 rounded-md border border-amber-300 shadow-xs text-[8px] sm:text-[9px] font-black text-amber-900">
            {activePhoto === 'cafe' ? '🍨 Café' : '👗 Jardín'}
          </div>
          <div className="bg-amber-400 text-amber-950 px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs text-[8px] sm:text-[9px] font-black flex items-center gap-0.5">
            <Star className="w-2 h-2 fill-amber-950" />
            <span>Foto</span>
          </div>
        </div>
      </div>

      {/* Quick Photo Switcher Pills under character */}
      <div className="mt-2 flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-full border border-pink-200 shadow-xs">
        <button
          onClick={() => {
            sound.playClick();
            setActivePhoto('cafe');
          }}
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black transition cursor-pointer ${
            activePhoto === 'cafe'
              ? 'bg-pink-500 text-white shadow-xs scale-105'
              : 'text-slate-600 hover:bg-pink-50'
          }`}
        >
          🍨 Café
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setActivePhoto('dress');
          }}
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black transition cursor-pointer ${
            activePhoto === 'dress'
              ? 'bg-pink-500 text-white shadow-xs scale-105'
              : 'text-slate-600 hover:bg-pink-50'
          }`}
        >
          👗 Jardín
        </button>
      </div>

      {/* Ground Contact Shadow */}
      <div className="w-36 h-3 bg-amber-950/20 rounded-full blur-xs mt-1" />
    </div>
  );
};
