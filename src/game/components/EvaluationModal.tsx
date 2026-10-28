import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { EvaluationResult, Order } from '@/src/types/game';
import { sound } from '@/src/game/audio/soundManager';
import { Star, Coins, Sparkles, ArrowRight, Heart } from 'lucide-react';

interface EvaluationModalProps {
  evaluation: EvaluationResult;
  order: Order;
  onNextCustomer: () => void;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  evaluation,
  order,
  onNextCustomer,
}) => {
  useEffect(() => {
    // Trigger audio & confetti based on score
    if (evaluation.stars >= 2) {
      sound.playFanfare();
      sound.playCoins();
      confetti({
        particleCount: evaluation.stars === 3 ? 100 : 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#facc15', '#38bdf8', '#4ade80', '#fb923c'],
      });
    } else {
      sound.playCoins();
    }
  }, [evaluation]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl border-4 border-amber-300 shadow-2xl p-6 text-center text-slate-800 scale-in-95 transform transition-all">
        {/* Header Ribbon */}
        <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-md mb-3">
          ¡Pedido Entregado a {order.customerName}!
        </div>

        {/* Golden Stars Rating */}
        <div className="flex justify-center items-center gap-3 my-2">
          {[1, 2, 3].map((starIndex) => {
            const isFilled = starIndex <= evaluation.stars;
            return (
              <div
                key={starIndex}
                className={`transition-all transform ${
                  isFilled ? 'scale-110 text-amber-400' : 'text-slate-200 scale-95'
                }`}
              >
                <Star
                  className={`w-12 h-12 ${
                    isFilled ? 'fill-amber-400 stroke-amber-500 filter drop-shadow' : 'stroke-slate-300'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Customer Reaction Speech Bubble */}
        <div className="my-3 p-3 rounded-2xl bg-pink-50 border-2 border-pink-100 text-xs italic text-slate-700 relative">
          <div className="flex items-center justify-center gap-1 font-bold text-pink-700 not-italic mb-1">
            <Heart className="w-3.5 h-3.5 fill-pink-500" />
            <span>{evaluation.feedbackText}</span>
          </div>
          <p className="text-slate-600">
            {evaluation.stars >= 2
              ? '«' + (order.customerPersonality === 'exigente' ? '¡Excelente trabajo! Me encantó la armonía de sabores.' : '¡Qué delicia de helado, Victoria! Volveré muy pronto.') + '»'
              : '«Gracias por el helado, la próxima vez quedará aún mejor.»'}
          </p>
        </div>

        {/* Scoring Breakdown Meters */}
        <div className="grid grid-cols-3 gap-2 my-3 text-center">
          <div className="bg-amber-50/80 p-2 rounded-xl border border-amber-200">
            <div className="text-[10px] font-bold text-amber-800">Receta</div>
            <div className="text-xs font-black text-amber-950">
              {Math.round(evaluation.accuracyScore * 100)}%
            </div>
          </div>
          <div className="bg-pink-50/80 p-2 rounded-xl border border-pink-200">
            <div className="text-[10px] font-bold text-pink-800">Presentación</div>
            <div className="text-xs font-black text-pink-950">
              {Math.round(evaluation.presentationScore * 100)}%
            </div>
          </div>
          <div className="bg-emerald-50/80 p-2 rounded-xl border border-emerald-200">
            <div className="text-[10px] font-bold text-emerald-800">Velocidad</div>
            <div className="text-xs font-black text-emerald-950">
              {Math.round(evaluation.speedScore * 100)}%
            </div>
          </div>
        </div>

        {/* Rewards Earned */}
        <div className="flex justify-center items-center gap-6 my-4 py-2 border-y border-slate-100">
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 fill-amber-400 text-amber-600" />
            <div className="text-left">
              <div className="text-lg font-black text-amber-900 leading-none">
                +{evaluation.earnedCoins}
              </div>
              <div className="text-[10px] font-bold text-amber-700">Monedas</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-pink-500 fill-pink-300" />
            <div className="text-left">
              <div className="text-lg font-black text-pink-900 leading-none">
                +{evaluation.earnedXp}
              </div>
              <div className="text-[10px] font-bold text-pink-700">Puntos XP</div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => {
            sound.playClick();
            onNextCustomer();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          <span>Continuar con el Siguiente Cliente</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
