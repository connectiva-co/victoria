import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';
import { sound } from '@/src/game/audio/soundManager';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = () => {
    sound.playClick();
    install();
  };

  const handleIOSClick = () => {
    sound.playClick();
    setShowIOSGuide(true);
  };

  if (isInstallable) {
    return (
      <button
        onClick={handleInstallClick}
        title="Instalar juego en tu dispositivo para jugar offline"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Instalar PWA</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={handleIOSClick}
          title="Instalar en iPhone o iPad"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-bold border border-pink-300 transition-all cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Instalar en iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border-4 border-pink-200 text-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-pink-100">
                <h3 className="text-base font-bold text-pink-700 flex items-center gap-2">
                  <span>🍦</span> Instalar en iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full hover:bg-pink-50 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>
                  1. Toca el botón <strong>Compartir</strong> (ícono de cuadro con flecha hacia arriba) en la barra de Safari.
                </p>
                <p>
                  2. Desliza hacia abajo y selecciona <strong>Agregar a Inicio</strong> (+).
                </p>
                <p className="text-xs text-pink-600 font-medium">
                  ¡Podrás jugar Victoria's Ice Cream World a pantalla completa y sin internet!
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-pink-500 hover:bg-pink-600 py-2.5 text-sm font-bold text-white shadow-md"
              >
                ¡Entendido!
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
