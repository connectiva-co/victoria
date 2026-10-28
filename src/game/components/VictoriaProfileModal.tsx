import React, { useState } from 'react';
import { Achievement, VictoriaCustomization } from '@/src/types/game';
import { sound } from '@/src/game/audio/soundManager';
import { X, Trophy, Sparkles, Heart, Award, Star, Check } from 'lucide-react';

interface VictoriaProfileModalProps {
  customization: VictoriaCustomization;
  achievements: Achievement[];
  totalServed: number;
  totalCoinsEarned: number;
  businessStage: string;
  onUpdateCustomization: (cust: VictoriaCustomization) => void;
  onClose: () => void;
}

export const VictoriaProfileModal: React.FC<VictoriaProfileModalProps> = ({
  customization,
  achievements,
  totalServed,
  totalCoinsEarned,
  businessStage,
  onUpdateCustomization,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'bio' | 'wardrobe' | 'achievements'>('bio');

  const handleSelectApron = (apron: VictoriaCustomization['apron']) => {
    sound.playClick();
    onUpdateCustomization({ ...customization, apron });
  };

  const handleSelectHairstyle = (hairstyle: VictoriaCustomization['hairstyle']) => {
    sound.playClick();
    onUpdateCustomization({ ...customization, hairstyle });
  };

  const handleSelectAccessory = (accessory: VictoriaCustomization['accessory']) => {
    sound.playClick();
    onUpdateCustomization({ ...customization, accessory });
  };

  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl border-4 border-pink-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Victoria's Real Photo Banner */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-pink-200 via-rose-100 to-amber-100 border-b border-pink-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/assets/aistudio/image_aebcaa13.png"
                alt="Victoria 3D Avatar"
                className="w-16 h-16 rounded-full object-cover object-top border-3 border-amber-300 shadow-md ring-2 ring-pink-400"
              />
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 p-1 rounded-full text-xs shadow-xs">
                👑
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-pink-800">Victoria</h2>
                <span className="text-[10px] font-black uppercase bg-pink-500 text-white px-2 py-0.5 rounded-full shadow-2xs">
                  Chef & Fundadora
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                «Creando los helados más ricos y felices del mundo»
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

        {/* Tab Buttons */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('bio');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'bio'
                ? 'bg-pink-500 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-pink-50 border border-slate-200'
            }`}
          >
            🌸 Perfil & Historia
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('wardrobe');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'wardrobe'
                ? 'bg-pink-500 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-pink-50 border border-slate-200'
            }`}
          >
            👗 Personalizar Atuendo
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('achievements');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              activeTab === 'achievements'
                ? 'bg-pink-500 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-pink-50 border border-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Logros ({unlockedAchievementsCount}/{achievements.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: BIO & PHOTO GALLERY */}
          {activeTab === 'bio' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="relative group overflow-hidden rounded-2xl border-4 border-amber-200 shadow-md">
                  <img
                    src="/assets/aistudio/image_63a13ec7.png"
                    alt="Victoria en su heladería"
                    className="w-full h-56 object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white text-xs">
                    <span className="font-black text-amber-300">Chef Victoria</span> · Inspiración artesanal
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-pink-50/70 p-3.5 rounded-2xl border border-pink-200 text-xs text-slate-700 leading-relaxed">
                    <h4 className="font-black text-pink-800 text-sm mb-1 flex items-center gap-1">
                      <Heart className="w-4 h-4 text-pink-500 fill-pink-400" />
                      <span>La Pasión de Victoria</span>
                    </h4>
                    Victoria siempre soñó con abrir una heladería mágica donde cada receta hiciera sonreír a quien la probara. Con su flor amarilla característica y su delantal floral, crea combinaciones artesanales con frutas frescas, arequipe dorado y ricos chocolates.
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                      <div className="text-lg font-black text-amber-800">{totalServed}</div>
                      <div className="text-[10px] font-bold text-amber-900">Helados Servidos</div>
                    </div>
                    <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-200">
                      <div className="text-lg font-black text-purple-800">{businessStage}</div>
                      <div className="text-[10px] font-bold text-purple-900">Etapa del Negocio</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WARDROBE & CUSTOMIZATION */}
          {activeTab === 'wardrobe' && (
            <div className="space-y-4">
              {/* Hairstyle */}
              <div>
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  Peinado de Victoria
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'classic_flower', label: 'Flor Amarilla (Original)', icon: '🌼' },
                    { id: 'ponytail_ribbon', label: 'Coleta con Lazo', icon: '🎀' },
                    { id: 'chef_toque', label: 'Gorra de Maestra Heladera', icon: '👩‍🍳' },
                  ].map((h) => {
                    const isSelected = customization.hairstyle === h.id;
                    return (
                      <button
                        key={h.id}
                        onClick={() => handleSelectHairstyle(h.id as any)}
                        className={`p-3 rounded-2xl border-2 text-center transition cursor-pointer ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50 shadow-sm'
                            : 'border-slate-200 hover:border-pink-200 bg-white'
                        }`}
                      >
                        <div className="text-2xl mb-1">{h.icon}</div>
                        <div className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1">
                          <span>{h.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-pink-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Apron */}
              <div>
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  Delantal & Vestido
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'pastel_floral', label: 'Floral Crema (Foto)', icon: '🌸' },
                    { id: 'mint_chef', label: 'Menta Fresca', icon: '🍃' },
                    { id: 'sweet_strawberry', label: 'Fresa Dulce', icon: '🍓' },
                    { id: 'golden_star', label: 'Estrella de Oro', icon: '⭐' },
                  ].map((a) => {
                    const isSelected = customization.apron === a.id;
                    return (
                      <button
                        key={a.id}
                        onClick={() => handleSelectApron(a.id as any)}
                        className={`p-3 rounded-2xl border-2 text-center transition cursor-pointer ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50 shadow-sm'
                            : 'border-slate-200 hover:border-pink-200 bg-white'
                        }`}
                      >
                        <div className="text-2xl mb-1">{a.icon}</div>
                        <div className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1">
                          <span>{a.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-pink-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accessories */}
              <div>
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  Accesorio Especial
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'yellow_flower', label: 'Flor Amarilla en Cabello', icon: '🌼' },
                    { id: 'sparkle_clip', label: 'Horquilla Brillante', icon: '✨' },
                    { id: 'chef_medal', label: 'Medalla de Oro al Sabor', icon: '🏅' },
                  ].map((acc) => {
                    const isSelected = customization.accessory === acc.id;
                    return (
                      <button
                        key={acc.id}
                        onClick={() => handleSelectAccessory(acc.id as any)}
                        className={`p-3 rounded-2xl border-2 text-center transition cursor-pointer ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50 shadow-sm'
                            : 'border-slate-200 hover:border-pink-200 bg-white'
                        }`}
                      >
                        <div className="text-2xl mb-1">{acc.icon}</div>
                        <div className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1">
                          <span>{acc.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-pink-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition ${
                    ach.unlocked
                      ? 'border-amber-300 bg-amber-50/60 shadow-xs'
                      : 'border-slate-100 bg-slate-50/60 opacity-60'
                  }`}
                >
                  <span className="text-3xl shrink-0">{ach.icon}</span>
                  <div className="overflow-hidden">
                    <h5 className="text-xs font-black text-slate-800 flex items-center gap-1">
                      <span>{ach.title}</span>
                      {ach.unlocked && <Award className="w-3.5 h-3.5 text-amber-600" />}
                    </h5>
                    <p className="text-[11px] text-slate-500">{ach.description}</p>
                    <div className="mt-1 text-[10px] font-bold text-slate-400">
                      {ach.unlocked ? '¡Completado!' : `${ach.progress} / ${ach.maxProgress}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
