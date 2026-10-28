import React, { useState } from 'react';
import { PWAInstallButton } from '@/src/game/pwa/PWAInstallButton';
import { sound } from '@/src/game/audio/soundManager';
import {
  Coins,
  Sparkles,
  Volume2,
  VolumeX,
  BookOpen,
  ShoppingBag,
  Target,
  Gamepad2,
  Pause,
  Menu,
  X,
} from 'lucide-react';

interface GameHeaderProps {
  coins: number;
  level: number;
  currentXp: number;
  requiredXp: number;
  currentDay: number;
  dailyCustomersServed: number;
  isMuted: boolean;
  renderingMode: 'pixar2d' | 'three3d';
  onToggleMute: () => void;
  onToggleRenderingMode: () => void;
  onOpenScreen: (screen: 'RECIPES' | 'SHOP' | 'MISSIONS' | 'CUSTOMIZE_VICTORIA' | 'MINIGAME_MEMORY' | 'PAUSE') => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  coins,
  level,
  currentXp,
  requiredXp,
  currentDay,
  dailyCustomersServed,
  isMuted,
  renderingMode,
  onToggleMute,
  onToggleRenderingMode,
  onOpenScreen,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const xpPercent = Math.min(100, (currentXp / requiredXp) * 100);

  const handleMobileMenuClick = (screen: 'RECIPES' | 'SHOP' | 'MISSIONS' | 'CUSTOMIZE_VICTORIA' | 'MINIGAME_MEMORY' | 'PAUSE') => {
    sound.playClick();
    setMobileMenuOpen(false);
    onOpenScreen(screen);
  };

  return (
    <>
      <header className="pointer-events-auto fixed top-1.5 inset-x-2 sm:inset-x-4 z-30 flex items-center justify-between gap-1.5">
        {/* Left: Chef Victoria Avatar Button & Day Tracker */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              onOpenScreen('CUSTOMIZE_VICTORIA');
            }}
            title="Perfil de Chef Victoria"
            className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full border-2 border-pink-300 shadow-md hover:bg-pink-50 transition cursor-pointer"
          >
            <img
              src="/assets/aistudio/image_aebcaa13.png"
              alt="Chef Victoria"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover object-top border-2 border-amber-300 shadow-2xs"
            />
            <div className="text-left hidden xs:block">
              <div className="text-[11px] sm:text-xs font-black text-pink-700 leading-none">Victoria</div>
              <div className="text-[8px] sm:text-[9px] text-amber-700 font-bold hidden sm:block">Heladería</div>
            </div>
          </button>

          {/* Day / Customers count */}
          <div className="bg-amber-100/95 backdrop-blur-md px-2 sm:px-2.5 py-1 rounded-full border border-amber-300 shadow-xs flex items-center gap-1 text-[11px] font-bold text-amber-900">
            <span>☀️</span>
            <span className="font-black text-[10px] sm:text-xs">Día {currentDay}</span>
            <span className="text-amber-500">·</span>
            <span className="tabular-nums text-amber-800 text-[10px] sm:text-xs">
              {Math.min(5, dailyCustomersServed + 1)}/5
            </span>
          </div>
        </div>

        {/* Center: Coins */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border-2 border-amber-300 shadow-xs flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
            <span className="tabular-nums font-black text-amber-900 text-xs sm:text-sm">
              {coins}
            </span>
          </div>

          {/* Level & XP (shown on md+ screens) */}
          <div className="hidden lg:flex items-center gap-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border-2 border-pink-200 shadow-xs">
            <div className="flex items-center gap-1 text-xs font-black text-pink-700">
              <Sparkles className="w-3 h-3 text-pink-500" />
              <span>Niv. {level}</span>
            </div>
            <div className="w-14 h-2 rounded-full bg-pink-100 overflow-hidden border border-pink-200">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-300"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Mode Toggle + Direct Desktop Buttons / Mobile Drawer Button */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Single, Clear 3D/2D Toggle Button */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleRenderingMode();
            }}
            title={renderingMode === 'pixar2d' ? 'Cambiar a Heladería 3D' : 'Cambiar a Heladería 2D'}
            className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-white font-black text-[11px] sm:text-xs shadow-md flex items-center gap-1 transition cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>{renderingMode === 'pixar2d' ? '🧊 3D' : '🎨 2D'}</span>
          </button>

          {/* Desktop Direct Buttons (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => {
                sound.playClick();
                onOpenScreen('RECIPES');
              }}
              title="Libro de Recetas"
              className="p-1.5 rounded-full bg-white/95 hover:bg-pink-50 border border-pink-200 shadow-xs text-pink-700 hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenScreen('SHOP');
              }}
              title="Tienda de Sabores y Mejoras"
              className="p-1.5 rounded-full bg-white/95 hover:bg-amber-50 border border-amber-200 shadow-xs text-amber-700 hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenScreen('MISSIONS');
              }}
              title="Misiones Diarias"
              className="p-1.5 rounded-full bg-white/95 hover:bg-emerald-50 border border-emerald-200 shadow-xs text-emerald-700 hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <Target className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenScreen('MINIGAME_MEMORY');
              }}
              title="Minijuego: Memoria Heladera"
              className="p-1.5 rounded-full bg-white/95 hover:bg-purple-50 border border-purple-200 shadow-xs text-purple-700 hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4" />
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
            className="p-1.5 rounded-full bg-white/95 hover:bg-slate-100 border border-slate-200 shadow-xs text-slate-700 hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
          </button>

          {/* Pause */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenScreen('PAUSE');
            }}
            title="Pausar juego"
            className="p-1.5 rounded-full bg-white/95 hover:bg-slate-100 border border-slate-200 shadow-xs text-slate-700 hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Dropdown Toggle (shown on small screens) */}
          <button
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            title="Menú de juego"
            className="md:hidden p-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md hover:scale-105 active:scale-95 transition cursor-pointer flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          </button>

          <div className="hidden sm:block">
            <PWAInstallButton />
          </div>
        </div>
      </header>

      {/* Mobile Menu Floating Popover (Keeps header clean and uncluttered) */}
      {mobileMenuOpen && (
        <div className="fixed top-12 right-2 z-50 md:hidden bg-white/95 backdrop-blur-md rounded-2xl border-3 border-pink-300 shadow-2xl p-2.5 animate-in fade-in zoom-in-95 duration-200 w-48">
          <div className="text-[10px] font-black uppercase text-pink-700 tracking-wider mb-2 px-1">
            ✨ Menú Rápido
          </div>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleMobileMenuClick('RECIPES')}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-pink-50 flex items-center gap-2.5 transition text-left cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-pink-600 shrink-0" />
              <span>Libro de Recetas</span>
            </button>
            <button
              onClick={() => handleMobileMenuClick('SHOP')}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-amber-50 flex items-center gap-2.5 transition text-left cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Tienda de Sabores</span>
            </button>
            <button
              onClick={() => handleMobileMenuClick('MISSIONS')}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 flex items-center gap-2.5 transition text-left cursor-pointer"
            >
              <Target className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Misiones Diarias</span>
            </button>
            <button
              onClick={() => handleMobileMenuClick('MINIGAME_MEMORY')}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-purple-50 flex items-center gap-2.5 transition text-left cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Minijuego Memoria</span>
            </button>
            <button
              onClick={() => handleMobileMenuClick('CUSTOMIZE_VICTORIA')}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-rose-50 flex items-center gap-2.5 transition text-left cursor-pointer"
            >
              <span className="text-sm">👑</span>
              <span>Perfil de Victoria</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
