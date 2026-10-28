import React from 'react';
import { sound } from '@/src/game/audio/soundManager';
import { Play, RotateCcw, Home, Volume2, VolumeX, X } from 'lucide-react';

interface PauseModalProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onResume: () => void;
  onRestartDay: () => void;
  onReturnTitle: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isMuted,
  onToggleMute,
  onResume,
  onRestartDay,
  onReturnTitle,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl border-4 border-pink-300 shadow-2xl p-6 text-center text-slate-800">
        <h2 className="text-xl font-black text-pink-700 mb-1">Juego Pausado</h2>
        <p className="text-xs text-slate-500 mb-6">Tómate un respiro antes de seguir sirviendo helados</p>

        <div className="space-y-3">
          <button
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Reanudar Juego</span>
          </button>

          <button
            onClick={() => {
              onToggleMute();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            <span>{isMuted ? 'Activar Sonidos' : 'Silenciar Sonidos'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onRestartDay();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar Día Actual</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onReturnTitle();
            }}
            className="w-full py-2.5 px-4 rounded-2xl border-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Menú Principal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
