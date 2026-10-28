import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '@/src/game/audio/soundManager';
import { X, Gamepad2, Coins, Sparkles, RotateCcw, CheckCircle2 } from 'lucide-react';

interface CardItem {
  id: number;
  pairId: string;
  name: string;
  icon: string;
  color: string;
}

const CARDS_DATA = [
  { pairId: 'vainilla', name: 'Vainilla', icon: '🍨', color: '#fef08a' },
  { pairId: 'chocolate', name: 'Chocolate', icon: '🍫', color: '#5c2d13' },
  { pairId: 'fresa', name: 'Fresa', icon: '🍓', color: '#f43f5e' },
  { pairId: 'mango', name: 'Mango', icon: '🥭', color: '#fb923c' },
  { pairId: 'cereza', name: 'Cereza', icon: '🍒', color: '#e11d48' },
  { pairId: 'galleta', name: 'Galleta', icon: '🍪', color: '#78350f' },
];

interface MemoryMinigameModalProps {
  onWinReward: (coins: number, xp: number) => void;
  onClose: () => void;
}

export const MemoryMinigameModal: React.FC<MemoryMinigameModalProps> = ({
  onWinReward,
  onClose,
}) => {
  const [deck, setDeck] = useState<CardItem[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const startNewGame = () => {
    // Duplicate and shuffle
    const paired: CardItem[] = [];
    CARDS_DATA.forEach((card, idx) => {
      paired.push({ ...card, id: idx * 2 });
      paired.push({ ...card, id: idx * 2 + 1 });
    });

    for (let i = paired.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [paired[i], paired[j]] = [paired[j], paired[i]];
    }

    setDeck(paired);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsWon(false);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(deck[index].pairId)) {
      return;
    }

    sound.playClick();
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const first = deck[newFlipped[0]];
      const second = deck[newFlipped[1]];

      if (first.pairId === second.pairId) {
        sound.playSprinkles();
        setMatched((prev) => [...prev, first.pairId]);
        setFlipped([]);

        // Check if all matched
        if (matched.length + 1 === CARDS_DATA.length) {
          setIsWon(true);
          sound.playFanfare();
          sound.playCoins();
          confetti({ particleCount: 80, spread: 70 });
          onWinReward(35, 30);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 800);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl border-4 border-purple-300 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-100 to-pink-100 border-b border-purple-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-purple-700" />
            <div>
              <h2 className="text-lg font-black text-slate-800">Minijuego: Memoria Heladera</h2>
              <p className="text-xs text-slate-500">
                Encuentra las parejas de ingredientes · Movimientos: {moves}
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

        {/* Board */}
        <div className="p-6">
          <div className="grid grid-cols-4 gap-3">
            {deck.map((card, idx) => {
              const isCardFlipped = flipped.includes(idx) || matched.includes(card.pairId);
              return (
                <button
                  key={idx}
                  onClick={() => handleCardClick(idx)}
                  className={`aspect-square rounded-2xl border-2 flex items-center justify-center transition-all duration-300 transform cursor-pointer text-3xl shadow-sm ${
                    isCardFlipped
                      ? 'bg-amber-50 border-purple-300 scale-95 rotate-y-180'
                      : 'bg-gradient-to-br from-pink-400 to-purple-500 border-pink-300 hover:scale-105 active:scale-95 text-white'
                  }`}
                >
                  {isCardFlipped ? card.icon : '🍦'}
                </button>
              );
            })}
          </div>

          {/* Victory Overlay if Won */}
          {isWon && (
            <div className="mt-5 p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 text-center animate-in fade-in">
              <div className="flex items-center justify-center gap-1.5 text-base font-black text-purple-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>¡Excelente Memoria!</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Completaste el reto en {moves} intentos.
              </p>
              <div className="flex justify-center items-center gap-4 my-2 text-xs font-black">
                <span className="flex items-center gap-1 text-amber-700">
                  <Coins className="w-4 h-4 fill-amber-400" /> +35 Monedas
                </span>
                <span className="flex items-center gap-1 text-pink-700">
                  <Sparkles className="w-4 h-4 text-pink-500" /> +30 XP
                </span>
              </div>
              <button
                onClick={startNewGame}
                className="mt-2 py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Jugar de Nuevo
              </button>
            </div>
          )}

          {!isWon && (
            <div className="mt-4 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">
                Parejas encontradas: {matched.length} / {CARDS_DATA.length}
              </span>
              <button
                onClick={startNewGame}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
