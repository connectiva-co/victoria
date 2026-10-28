import React from 'react';
import { Mission } from '@/src/types/game';
import { sound } from '@/src/game/audio/soundManager';
import { X, Target, Coins, Sparkles, CheckCircle2 } from 'lucide-react';

interface MissionsModalProps {
  missions: Mission[];
  onClaimMission: (missionId: string) => void;
  onClose: () => void;
}

export const MissionsModal: React.FC<MissionsModalProps> = ({
  missions,
  onClaimMission,
  onClose,
}) => {
  const handleClaim = (missionId: string) => {
    sound.playCoins();
    sound.playFanfare();
    onClaimMission(missionId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl border-4 border-emerald-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-100 to-teal-100 border-b border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-700" />
            <div>
              <h2 className="text-lg font-black text-slate-800">Misiones Diarias de Victoria</h2>
              <p className="text-xs text-slate-500">
                Cumple los objetivos del día para ganar monedas y experiencia extra
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/80 text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mission List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {missions.map((mis) => {
            const isFinished = mis.current >= mis.target;
            const percent = Math.min(100, (mis.current / mis.target) * 100);

            return (
              <div
                key={mis.id}
                className={`p-4 rounded-2xl border-2 transition ${
                  mis.claimed
                    ? 'border-slate-100 bg-slate-50/70 opacity-60'
                    : isFinished
                    ? 'border-emerald-300 bg-emerald-50/60 shadow-sm'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                      <span>{mis.title}</span>
                      {mis.claimed && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{mis.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                      <Coins className="w-3.5 h-3.5 fill-amber-400 text-amber-600" />
                      <span>+{mis.rewardCoins}</span>
                    </span>
                    <span className="flex items-center gap-1 text-xs font-black text-pink-700 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-lg">
                      <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                      <span>+{mis.rewardXp} XP</span>
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold tabular-nums text-slate-600 shrink-0">
                    {mis.current} / {mis.target}
                  </span>
                </div>

                {/* Claim Button */}
                {isFinished && !mis.claimed && (
                  <button
                    onClick={() => handleClaim(mis.id)}
                    className="mt-3 w-full py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs shadow-md transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 animate-bounce"
                  >
                    <span>¡Reclamar Recompensa!</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
