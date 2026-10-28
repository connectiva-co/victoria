import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '@/src/game/audio/soundManager';
import { Sun, Star, Coins, Sparkles, Trophy, ArrowRight } from 'lucide-react';

interface DaySummaryModalProps {
  day: number;
  customersServed: number;
  earnings: number;
  starsSum: number;
  businessStage: string;
  onStartNextDay: () => void;
}

export const DaySummaryModal: React.FC<DaySummaryModalProps> = ({
  day,
  customersServed,
  earnings,
  starsSum,
  businessStage,
  onStartNextDay,
}) => {
  const avgStars = customersServed > 0 ? (starsSum / customersServed).toFixed(1) : '3.0';

  useEffect(() => {
    sound.playFanfare();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white rounded-3xl border-4 border-pink-300 shadow-2xl p-6 text-center text-slate-800">
        {/* Sun Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-black text-xs uppercase tracking-wider mb-2">
          <Sun className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>¡Resumen de la Jornada {day}!</span>
        </div>

        <h2 className="text-2xl font-black text-pink-700">¡Gran Trabajo, Chef Victoria!</h2>
        <p className="text-xs text-slate-600 mt-1">
          Has atendido a todos los clientes de hoy con dedicación y alegría.
        </p>

        {/* 3 Summary Cards */}
        <div className="grid grid-cols-3 gap-3 my-5">
          <div className="bg-pink-50 p-3 rounded-2xl border border-pink-200">
            <div className="text-2xl font-black text-pink-700">{customersServed}/5</div>
            <div className="text-[11px] font-bold text-pink-900 mt-1">Clientes Felices</div>
          </div>

          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
            <div className="text-2xl font-black text-amber-600 flex items-center justify-center gap-1">
              <Coins className="w-5 h-5 fill-amber-400" />
              <span>+{earnings}</span>
            </div>
            <div className="text-[11px] font-bold text-amber-900 mt-1">Ganancias del Día</div>
          </div>

          <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200">
            <div className="text-2xl font-black text-purple-700 flex items-center justify-center gap-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              <span>{avgStars}</span>
            </div>
            <div className="text-[11px] font-bold text-purple-900 mt-1">Promedio Estrellas</div>
          </div>
        </div>

        {/* Business Stage Banner */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-pink-50 p-3.5 rounded-2xl border-2 border-amber-200 my-4 text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center text-xl shrink-0">
            <Trophy className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Etapa de la Heladería</div>
            <div className="text-sm font-black text-slate-800">{businessStage}</div>
            <div className="text-[11px] text-pink-600 font-semibold">
              ¡Tu fama como chef artesanal sigue creciendo en el barrio!
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => {
            sound.playClick();
            onStartNextDay();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          <span>Comenzar Jornada {day + 1}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
