import React, { useEffect } from 'react';
import { GameMode } from '@/src/types/game';
import { sound } from '@/src/game/audio/soundManager';
import { Play, Sparkles, Smile, Palette, Gamepad2, Volume2, VolumeX } from 'lucide-react';
import { PWAInstallButton } from '@/src/game/pwa/PWAInstallButton';

interface TitleScreenProps {
  onStartGame: (mode: GameMode) => void;
  onOpenMinigame: () => void;
  onOpenVictoriaProfile: () => void;
  isMuted: boolean;
  renderingMode: 'pixar2d' | 'three3d';
  onToggleMute: () => void;
  onToggleRenderingMode: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenMinigame,
  onOpenVictoriaProfile,
  isMuted,
  renderingMode,
  onToggleMute,
  onToggleRenderingMode,
}) => {
  // Listen for Enter / Space to start default Career mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        sound.playClick();
        sound.startBGM();
        onStartGame('career');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartGame]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center p-6 text-center select-none z-20">
      {/* Top Bar with Profile Badge & Audio Toggle */}
      <div className="w-full flex items-center justify-between max-w-4xl">
        <button
          onClick={() => {
            sound.playClick();
            onOpenVictoriaProfile();
          }}
          className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-full border-2 border-pink-300 shadow-md hover:bg-pink-50 transition cursor-pointer"
        >
          <img
            src="/assets/aistudio/image_aebcaa13.png"
            alt="Chef Victoria"
            className="w-8 h-8 rounded-full object-cover object-top border-2 border-amber-300 shadow-xs"
          />
          <div className="text-left">
            <div className="text-xs font-black text-pink-700 leading-none">Chef Victoria</div>
            <div className="text-[10px] text-amber-700 font-bold">Ver Perfil y Fotos</div>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onToggleRenderingMode();
            }}
            title={renderingMode === 'pixar2d' ? 'Cambiar a Escena 3D' : 'Cambiar a Ilustración Pixar 2D'}
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-white font-black text-xs shadow-md flex items-center gap-1.5 transition cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>{renderingMode === 'pixar2d' ? '🎨 Modo Pixar 2D' : '🧊 Modo 3D'}</span>
          </button>
          <PWAInstallButton />
          <button
            onClick={() => {
              onToggleMute();
            }}
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
            className="p-2.5 rounded-full bg-white/90 hover:bg-slate-100 border border-slate-200 shadow-md text-slate-700 transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
          </button>
        </div>
      </div>

      {/* Hero Centerpiece: Bespoke SVG Title Lockup */}
      <div className="flex flex-col items-center max-w-xl my-auto animate-in fade-in zoom-in-95 duration-500">
        {/* Inline SVG Title Lockup with High-Contrast Highlighting */}
        <svg viewBox="0 0 600 168" className="w-full max-w-lg filter drop-shadow-xl overflow-visible" fill="none">
          <defs>
            <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#be123c" />
              <stop offset="50%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
            <filter id="strongShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="2" floodColor="#4c0519" floodOpacity="0.85" />
              <feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="#831843" floodOpacity="0.4" />
            </filter>
            <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#4c0519" floodOpacity="0.3" />
            </filter>
          </defs>
          <text
            x="300"
            y="52"
            textAnchor="middle"
            fill="#881337"
            fontFamily="system-ui, sans-serif"
            fontWeight="950"
            fontSize="40"
            letterSpacing="3"
            stroke="#ffffff"
            strokeWidth="4.5"
            paintOrder="stroke fill"
            filter="url(#strongShadow)"
          >
            VICTORIA'S
          </text>
          <text
            x="300"
            y="112"
            textAnchor="middle"
            fill="url(#titleGrad)"
            fontFamily="system-ui, sans-serif"
            fontWeight="950"
            fontSize="56"
            letterSpacing="1.5"
            stroke="#ffffff"
            strokeWidth="7"
            paintOrder="stroke fill"
            filter="url(#strongShadow)"
          >
            ICE CREAM WORLD
          </text>
          {/* High-contrast pill badge for subtitle */}
          <rect
            x="145"
            y="130"
            width="310"
            height="26"
            rx="13"
            fill="#831843"
            filter="url(#badgeShadow)"
          />
          <text
            x="300"
            y="148"
            textAnchor="middle"
            fill="#ffffff"
            fontFamily="system-ui, sans-serif"
            fontWeight="900"
            fontSize="13"
            letterSpacing="4"
          >
            HELADERÍA ARTESANAL 3D
          </text>
        </svg>

        <p className="mt-2 text-xs sm:text-sm font-bold text-slate-700 bg-white/80 backdrop-blur-xs px-4 py-1.5 rounded-full border border-pink-200 shadow-xs">
          🌸 ¡Prepara ricos helados, atiende clientes y haz crecer tu heladería!
        </p>

        {/* Primary Start CTA Button */}
        <div className="mt-6 flex flex-col items-center gap-3 w-full max-w-xs">
          <button
            onClick={() => {
              sound.playClick();
              sound.startBGM();
              onStartGame('career');
            }}
            className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-black text-base shadow-xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-pink-200"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>INICIAR JORNADA</span>
          </button>

          {/* Secondary Game Modes */}
          <div className="grid grid-cols-3 gap-2 w-full">
            <button
              onClick={() => {
                sound.playClick();
                sound.startBGM();
                onStartGame('relaxed');
              }}
              title="Modo sin límite de tiempo"
              className="py-2 px-2 rounded-xl bg-white/90 hover:bg-pink-50 border-2 border-pink-200 text-pink-700 font-bold text-[11px] flex flex-col items-center gap-1 shadow-sm transition hover:scale-105 cursor-pointer"
            >
              <Smile className="w-4 h-4 text-pink-500" />
              <span>Modo Relajado</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                sound.startBGM();
                onStartGame('creative');
              }}
              title="Prepara helados libremente"
              className="py-2 px-2 rounded-xl bg-white/90 hover:bg-amber-50 border-2 border-amber-200 text-amber-800 font-bold text-[11px] flex flex-col items-center gap-1 shadow-sm transition hover:scale-105 cursor-pointer"
            >
              <Palette className="w-4 h-4 text-amber-500" />
              <span>Modo Creativo</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenMinigame();
              }}
              title="Minijuego de memoria"
              className="py-2 px-2 rounded-xl bg-white/90 hover:bg-purple-50 border-2 border-purple-200 text-purple-700 font-bold text-[11px] flex flex-col items-center gap-1 shadow-sm transition hover:scale-105 cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-purple-500" />
              <span>Memoria</span>
            </button>
          </div>
        </div>
      </div>

      {/* Flat Control-Hint Line */}
      <div className="text-[11px] font-bold text-slate-500 bg-white/75 backdrop-blur-xs px-4 py-1.5 rounded-full border border-slate-200 shadow-xs">
        Ratón / Toque para preparar · Espacio o Enter para Iniciar · Esc para Pausar
      </div>
    </div>
  );
};
