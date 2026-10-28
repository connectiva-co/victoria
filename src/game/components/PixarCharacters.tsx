import React, { useEffect, useState } from 'react';
import { Customer, Personality, VictoriaCustomization } from '@/src/types/game';
import { Sparkles, Crown, Heart, Sparkle, Star } from 'lucide-react';
import { sound } from '@/src/game/audio/soundManager';

interface ChefVictoriaProps {
  customization?: VictoriaCustomization;
  action: 'idle' | 'scooping' | 'celebrating' | 'thinking';
  className?: string;
}

/**
 * Victoria's Official 3D Pixar Avatar
 * Rendered from the 3D model asset (image_aebcaa13.png) with animated lighting,
 * dynamic reactions, dialogue speech bubbles, and interactive charm.
 */
export const ChefVictoriaPixar: React.FC<ChefVictoriaProps> = ({
  customization,
  action,
  className = '',
}) => {
  const [clickCount, setClickCount] = useState(0);

  // Animation CSS classes based on action
  let animClass = 'animate-breathing';
  if (action === 'scooping') animClass = 'animate-scoop-motion';
  if (action === 'celebrating') animClass = 'animate-bounce-celebrate';

  const handleClickVictoria = () => {
    sound.playClick();
    setClickCount((c) => c + 1);
  };

  // Dynamic dialogue reacting to game state and player interactions
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
        if (clickCount > 0 && clickCount % 3 === 0) {
          return '«¡Hacer helados juntos es mi momento favorito del día!» 🍦✨';
        }
        return '«¡Hola! Soy Victoria, te preparo el helado más rico de todos» 🌸🍨';
    }
  };

  return (
    <div
      onClick={handleClickVictoria}
      className={`relative flex flex-col items-center select-none cursor-pointer group ${animClass} ${className}`}
      title="Chef Victoria (Avatar 3D Pixar)"
    >
      {/* Speech / Greeting Dialogue Bubble above Victoria (Compact Space-Optimized) */}
      <div className="mb-0.5 max-w-[140px] xs:max-w-[160px] sm:max-w-[190px] bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-xl border border-pink-300 shadow-sm text-center animate-in fade-in duration-200 relative z-30">
        <p className="text-[9px] sm:text-[10px] font-black text-pink-900 leading-tight truncate">
          {getDialogue()}
        </p>
        {/* Dialogue arrow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white border-r border-b border-pink-300 rotate-45" />
      </div>

      {/* Floating Crown / Chef Victoria Golden Medallion */}
      <div className="relative z-30 -mb-2 flex items-center justify-center filter drop-shadow-sm">
        <div className="px-2 sm:px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-amber-950 font-black text-[9px] sm:text-[10px] shadow-sm flex items-center gap-1 border border-amber-200">
          <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-950" />
          <span>Chef Victoria</span>
          <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-amber-800" />
        </div>
      </div>

      {/* Realistic 3D Pixar Avatar Character Stand with Ambient Glow (Compact & Proportional) */}
      <div className="relative w-24 xs:w-28 sm:w-36 md:w-40 aspect-[4/5] rounded-2xl overflow-hidden border-2 sm:border-3 border-amber-300 shadow-lg bg-gradient-to-b from-amber-100 via-pink-100 to-rose-200 transition-all duration-300">
        {/* Victoria Official 3D Avatar Image */}
        <img
          src="/assets/aistudio/image_aebcaa13.png"
          alt="Victoria 3D Avatar"
          className="w-full h-full object-cover object-top filter brightness-105 contrast-105 transition-transform duration-500 group-hover:scale-105"
        />

        {/* Studio Lighting Highlights */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 pointer-events-none" />

        {/* Floating Celebration Overlay on Success */}
        {action === 'celebrating' && (
          <div className="absolute inset-0 bg-pink-500/25 pointer-events-none flex flex-col items-center justify-center animate-pulse">
            <div className="flex gap-1 text-lg sm:text-xl animate-bounce">
              <span>⭐</span>
              <span>💖</span>
              <span>⭐</span>
            </div>
            <div className="mt-1 bg-pink-600/90 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md flex items-center gap-1">
              <Heart className="w-2.5 h-2.5 fill-white" />
              <span>¡Helado Estrella!</span>
            </div>
          </div>
        )}
      </div>

      {/* Ground Contact Shadow */}
      <div className="w-20 sm:w-28 h-2 bg-amber-950/20 rounded-full blur-xs mt-0.5" />
    </div>
  );
};

export const ChefVictoria3D = ChefVictoriaPixar;

// ----------------------------------------------------
// 5 DISTINCT PIXAR-STYLE CUSTOMERS
// ----------------------------------------------------

interface CustomerProps {
  customer: Customer;
  isCelebrating?: boolean;
  className?: string;
}

export const CustomerPixar: React.FC<CustomerProps> = ({
  customer,
  isCelebrating = false,
  className = '',
}) => {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 3200 + Math.random() * 1000);
    return () => clearInterval(t);
  }, []);

  const cid = customer.id;

  return (
    <div
      className={`relative flex flex-col items-center select-none ${
        isCelebrating ? 'animate-bounce-celebrate' : 'animate-breathing'
      } ${className}`}
    >
      <svg
        viewBox="0 0 220 300"
        className="w-full h-auto drop-shadow-xl overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="110" cy="285" rx="50" ry="10" fill="#1e293b" opacity="0.25" />

        {/* ================= 1. MATEO (El Goloso / Tranquilo) ================= */}
        {cid === 'cust_mateo' && (
          <g>
            {/* Body: Teal Hoodie */}
            <path d="M70 170 L55 270 C90 280 130 280 165 270 L150 170 Z" fill="#0284c7" />
            {/* Hoodie pocket */}
            <rect x="85" y="215" width="50" height="30" rx="8" fill="#0369a1" />
            <path d="M95 170 Q110 185 125 170" stroke="#ffffff" strokeWidth="3" fill="none" />

            {/* Arms holding napkin */}
            <ellipse cx="65" cy="210" rx="12" ry="30" fill="#0284c7" transform="rotate(20 65 210)" />
            <ellipse cx="155" cy="210" rx="12" ry="30" fill="#0284c7" transform="rotate(-20 155 210)" />
            <rect x="95" y="240" width="30" height="25" rx="4" fill="#f8fafc" stroke="#cbd5e1" />

            {/* Head (Chubby, happy boy) */}
            <ellipse cx="110" cy="115" rx="42" ry="38" fill="#fed7aa" />
            <ellipse cx="80" cy="125" rx="10" ry="6" fill="#f43f5e" opacity="0.3" />
            <ellipse cx="140" cy="125" rx="10" ry="6" fill="#f43f5e" opacity="0.3" />

            {/* Backwards baseball cap */}
            <path d="M70 110 C70 70 150 70 150 110 Z" fill="#0284c7" />
            <path d="M60 112 Q110 100 160 112" stroke="#0369a1" strokeWidth="6" fill="none" />
            <circle cx="110" cy="74" r="5" fill="#f59e0b" />

            {/* Eyes */}
            {blink ? (
              <>
                <path d="M88 112 Q96 118 104 112" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M116 112 Q124 118 132 112" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
              </>
            ) : isCelebrating ? (
              // Heart eyes when served!
              <>
                <text x="88" y="118" fontSize="20">😍</text>
              </>
            ) : (
              <>
                <circle cx="95" cy="112" r="7" fill="#1e293b" />
                <circle cx="93" cy="109" r="2.5" fill="#ffffff" />
                <circle cx="125" cy="112" r="7" fill="#1e293b" />
                <circle cx="123" cy="109" r="2.5" fill="#ffffff" />
              </>
            )}

            {/* Tongue out / Licking lips smile */}
            <path d="M98 132 Q110 148 122 132 Z" fill="#e11d48" />
            <path d="M104 136 Q110 144 116 136" fill="#fda4af" />
          </g>
        )}

        {/* ================= 2. SOFÍA (La Exigente) ================= */}
        {cid === 'cust_sofia' && (
          <g>
            {/* Chic Coral Turtleneck & Pearl necklace */}
            <path d="M75 160 L60 270 C95 278 125 278 160 270 L145 160 Z" fill="#f43f5e" />
            <rect x="95" y="145" width="30" height="20" rx="6" fill="#e11d48" />
            {/* Pearls */}
            <circle cx="98" cy="172" r="3" fill="#ffffff" />
            <circle cx="106" cy="175" r="3" fill="#ffffff" />
            <circle cx="114" cy="175" r="3" fill="#ffffff" />
            <circle cx="122" cy="172" r="3" fill="#ffffff" />

            {/* Blonde Bob Hair */}
            <path d="M68 95 C60 160 75 185 85 170 Q80 120 85 95 Z" fill="#facc15" />
            <path d="M152 95 C160 160 145 185 135 170 Q140 120 135 95 Z" fill="#facc15" />
            <path d="M72 100 C72 55 148 55 148 100 Z" fill="#facc15" />

            {/* Head */}
            <ellipse cx="110" cy="105" rx="36" ry="34" fill="#fed7aa" />
            <ellipse cx="90" cy="115" rx="7" ry="4" fill="#f43f5e" opacity="0.25" />
            <ellipse cx="130" cy="115" rx="7" ry="4" fill="#f43f5e" opacity="0.25" />

            {/* Trendy Cat-eye glasses */}
            <ellipse cx="95" cy="105" rx="14" ry="11" fill="none" stroke="#be123c" strokeWidth="3" />
            <ellipse cx="125" cy="105" rx="14" ry="11" fill="none" stroke="#be123c" strokeWidth="3" />
            <line x1="109" y1="105" x2="111" y2="105" stroke="#be123c" strokeWidth="3" />

            {/* Eyes through glasses */}
            {blink ? (
              <line x1="90" y1="105" x2="100" y2="105" stroke="#1e293b" strokeWidth="2.5" />
            ) : (
              <>
                <circle cx="95" cy="105" r="5" fill="#0284c7" />
                <circle cx="93" cy="103" r="2" fill="#ffffff" />
                <circle cx="125" cy="105" r="5" fill="#0284c7" />
                <circle cx="123" cy="103" r="2" fill="#ffffff" />
              </>
            )}

            {/* Polite smile or sparkling delight */}
            <path d="M103 126 Q110 134 117 126" stroke="#9f1239" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* ================= 3. DON CARLOS (El Habitual) ================= */}
        {cid === 'cust_carlos' && (
          <g>
            {/* Cozy Brown Cardigan & White Shirt */}
            <path d="M70 160 L55 270 C90 280 130 280 165 270 L150 160 Z" fill="#78350f" />
            <path d="M98 160 L110 190 L122 160 Z" fill="#ffffff" />
            <circle cx="110" cy="205" r="3.5" fill="#fef3c7" />
            <circle cx="110" cy="225" r="3.5" fill="#fef3c7" />
            <circle cx="110" cy="245" r="3.5" fill="#fef3c7" />

            {/* Grandfather Head & Grey Hair */}
            <ellipse cx="110" cy="110" rx="38" ry="36" fill="#fcd34d" />
            {/* Grey temples */}
            <path d="M72 105 C70 70 85 65 95 65" stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d="M148 105 C150 70 135 65 125 65" stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" fill="none" />

            {/* Round Golden Glasses */}
            <circle cx="96" cy="105" r="12" fill="none" stroke="#d97706" strokeWidth="2.5" />
            <circle cx="124" cy="105" r="12" fill="none" stroke="#d97706" strokeWidth="2.5" />
            <line x1="108" y1="105" x2="112" y2="105" stroke="#d97706" strokeWidth="2.5" />

            {/* Friendly eyes */}
            <circle cx="96" cy="105" r="4" fill="#334155" />
            <circle cx="124" cy="105" r="4" fill="#334155" />

            {/* Bushy Friendly Grey Mustache */}
            <path
              d="M92 120 Q110 115 110 126 Q110 115 128 120 Q110 132 92 120 Z"
              fill="#94a3b8"
            />
          </g>
        )}

        {/* ================= 4. LUCAS (El Impaciente) ================= */}
        {cid === 'cust_lucas' && (
          <g>
            {/* Red Sporty Jersey */}
            <path d="M70 160 L55 270 C90 280 130 280 165 270 L150 160 Z" fill="#ef4444" />
            <text x="110" y="225" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="26">7</text>

            {/* Sporty Watch on wrist (checking time) */}
            <rect x="58" y="220" width="12" height="6" rx="2" fill="#1e293b" />
            <circle cx="64" cy="223" r="4" fill="#facc15" />

            {/* Spiky energetic hair */}
            <path d="M75 90 L85 60 L100 70 L115 55 L130 70 L145 60 L145 90 Z" fill="#78350f" />

            {/* Head */}
            <ellipse cx="110" cy="105" rx="36" ry="34" fill="#fed7aa" />
            {/* Sweating drop if waiting */}
            <path d="M142 85 Q145 95 140 98 Q137 95 142 85 Z" fill="#38bdf8" />

            {/* Big impatient / excited eyes */}
            {blink ? (
              <line x1="92" y1="104" x2="104" y2="104" stroke="#1e293b" strokeWidth="3" />
            ) : (
              <>
                <circle cx="98" cy="104" r="7" fill="#1e293b" />
                <circle cx="95" cy="101" r="2.5" fill="#ffffff" />
                <circle cx="122" cy="104" r="7" fill="#1e293b" />
                <circle cx="119" cy="101" r="2.5" fill="#ffffff" />
              </>
            )}

            {/* Energetic grin */}
            <path d="M98 122 Q110 135 122 122" stroke="#991b1b" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* ================= 5. VALENTINA (La Especial) ================= */}
        {cid === 'cust_valentina' && (
          <g>
            {/* Pastel Lavender Sweater & Camera / Smartphone */}
            <path d="M72 160 L58 270 C92 280 128 280 162 270 L148 160 Z" fill="#c084fc" />
            {/* Smartphone with camera lens */}
            <rect x="94" y="210" width="32" height="48" rx="6" fill="#1e293b" stroke="#f472b6" strokeWidth="2" />
            <circle cx="110" cy="222" r="5" fill="#38bdf8" />

            {/* Long Purple / Dark Hair & Headband */}
            <path d="M70 100 C60 180 65 240 85 240 C90 200 90 140 90 100 Z" fill="#27272a" />
            <path d="M150 100 C160 180 155 240 135 240 C130 200 130 140 130 100 Z" fill="#27272a" />
            <path d="M72 100 C72 58 148 58 148 100 Z" fill="#27272a" />

            {/* Sunglasses resting on top of hair */}
            <rect x="85" y="65" width="22" height="12" rx="3" fill="#f43f5e" />
            <rect x="113" y="65" width="22" height="12" rx="3" fill="#f43f5e" />
            <line x1="107" y1="71" x2="113" y2="71" stroke="#f43f5e" strokeWidth="2" />

            {/* Head */}
            <ellipse cx="110" cy="105" rx="36" ry="34" fill="#fed7aa" />
            <ellipse cx="88" cy="115" rx="8" ry="5" fill="#ec4899" opacity="0.35" />
            <ellipse cx="132" cy="115" rx="8" ry="5" fill="#ec4899" opacity="0.35" />

            {/* Heart earrings */}
            <text x="66" y="125" fontSize="12">💖</text>
            <text x="144" y="125" fontSize="12">💖</text>

            {/* Beautiful sparkling eyes */}
            {blink ? (
              <line x1="92" y1="104" x2="104" y2="104" stroke="#1e293b" strokeWidth="2.5" />
            ) : (
              <>
                <ellipse cx="98" cy="104" rx="7.5" ry="9" fill="#1e293b" />
                <circle cx="95" cy="100" r="3" fill="#ffffff" />
                <ellipse cx="122" cy="104" rx="7.5" ry="9" fill="#1e293b" />
                <circle cx="119" cy="100" r="3" fill="#ffffff" />
              </>
            )}

            {/* Excited smile */}
            <path d="M100 122 Q110 132 120 122" stroke="#831843" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
};
