import React from 'react';
import { ContainerType, FlavorId, PreparedIceCream, ToppingId } from '@/src/types/game';
import { INITIAL_FLAVORS } from '@/src/game/data/gameData';

interface VisualIceCreamProps {
  prepared: PreparedIceCream;
  scale?: number;
  className?: string;
}

export const VisualIceCream: React.FC<VisualIceCreamProps> = ({
  prepared,
  scale = 1,
  className = '',
}) => {
  if (!prepared.container && prepared.scoops.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center p-4 text-center select-none ${className}`}>
        <div className="w-20 h-20 rounded-full border-3 border-dashed border-pink-300 flex items-center justify-center text-3xl bg-white/60 shadow-sm animate-pulse">
          🍨
        </div>
        <p className="mt-1.5 text-[11px] font-bold text-pink-700 bg-white/80 px-3 py-0.5 rounded-full shadow-2xs">
          Selecciona un recipiente abajo (Cono, Vaso, Copa o Waffle)
        </p>
      </div>
    );
  }

  const container = prepared.container || 'cono';

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none filter drop-shadow-xl transition-transform duration-300 ${className}`}
      style={{ transform: `scale(${scale})` }}
    >
      <svg
        viewBox="0 0 280 370"
        className="w-56 sm:w-64 h-auto overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Realistic Contact Shadow */}
          <radialGradient id="dropShadowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#271004" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#271004" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#271004" stopOpacity="0" />
          </radialGradient>

          {/* Baked Waffle Cone Gradient */}
          <linearGradient id="waffleConeRealistic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="65%" stopColor="#d97706" />
            <stop offset="90%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#5c2606" />
          </linearGradient>

          {/* Cone Inside Shadow */}
          <linearGradient id="coneInsideShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#451a03" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
          </linearGradient>

          {/* Sundae Cup Realistic Gradient */}
          <linearGradient id="cupRealistic" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fce7f3" />
            <stop offset="35%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>

          {/* Crystal Glass Coupe Gradient */}
          <linearGradient id="crystalGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="30%" stopColor="#e0f2fe" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#bae6fd" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
          </linearGradient>

          {/* Maraschino Cherry Wet Shimmer */}
          <radialGradient id="cherrySpecular" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="15%" stopColor="#f43f5e" />
            <stop offset="60%" stopColor="#be123c" />
            <stop offset="85%" stopColor="#881337" />
            <stop offset="100%" stopColor="#4c0519" />
          </radialGradient>

          {/* Chocolate Syrup Viscous Shimmer */}
          <linearGradient id="chocSyrup" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#451a03" />
            <stop offset="50%" stopColor="#270e02" />
            <stop offset="100%" stopColor="#150600" />
          </linearGradient>

          {/* Arequipe Golden Caramel Shimmer */}
          <linearGradient id="arequipeSyrup" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="45%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Strawberry Coulis Shimmer */}
          <linearGradient id="fresaSyrup" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="45%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#9f1239" />
          </linearGradient>

          {/* Dynamic Scoop Shaders for each flavor */}
          {INITIAL_FLAVORS.map((fl) => (
            <radialGradient key={fl.id} id={`scoopGrad_${fl.id}`} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="20%" stopColor={fl.color} />
              <stop offset="75%" stopColor={fl.secondaryColor} />
              <stop offset="100%" stopColor="#1e0a02" stopOpacity="0.3" />
            </radialGradient>
          ))}
        </defs>

        {/* 1. Ground Contact Shadow */}
        <ellipse cx="140" cy="355" rx="60" ry="10" fill="url(#dropShadowGrad)" />

        {/* 2. RECIPIENTE (Container) Base */}
        {container === 'cono' && (
          <g id="WaffleConeLayer">
            {/* Cone Triangle Body */}
            <path
              d="M140 350 L84 210 L196 210 Z"
              fill="url(#waffleConeRealistic)"
            />
            {/* Deep waffle diamond grooves with highlights and shadows */}
            <g opacity="0.6">
              {[0, 20, 40, 60, 80, 100].map((step, idx) => (
                <g key={idx}>
                  <line
                    x1={90 + step * 0.9}
                    y1="210"
                    x2={135 + step * 0.1}
                    y2="340"
                    stroke="#78350f"
                    strokeWidth="2.5"
                  />
                  <line
                    x1={90 + step * 0.9 + 1}
                    y1="211"
                    x2={135 + step * 0.1 + 1}
                    y2="341"
                    stroke="#fef08a"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                  <line
                    x1={190 - step * 0.9}
                    y1="210"
                    x2={145 - step * 0.1}
                    y2="340"
                    stroke="#78350f"
                    strokeWidth="2.5"
                  />
                </g>
              ))}
            </g>

            {/* Toasted Baked Rim with natural wavy waffle edge */}
            <ellipse cx="140" cy="210" rx="57" ry="11" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
            <ellipse cx="140" cy="210" rx="53" ry="8" fill="url(#coneInsideShadow)" />
          </g>
        )}

        {container === 'vaso' && (
          <g id="PastelCupLayer">
            {/* Cup Body */}
            <path
              d="M74 210 L88 335 C108 344 172 344 192 335 L206 210 Z"
              fill="url(#cupRealistic)"
              stroke="#f472b6"
              strokeWidth="1.5"
            />
            {/* Pastel Stripes */}
            <path d="M96 215 L106 330" stroke="#f472b6" strokeWidth="6" opacity="0.5" />
            <path d="M124 218 L128 335" stroke="#f472b6" strokeWidth="7" opacity="0.5" />
            <path d="M156 218 L152 335" stroke="#f472b6" strokeWidth="7" opacity="0.5" />
            <path d="M184 215 L174 330" stroke="#f472b6" strokeWidth="6" opacity="0.5" />

            {/* Chef Victoria Golden Seal */}
            <rect x="110" y="250" width="60" height="38" rx="8" fill="#ffffff" opacity="0.95" stroke="#fbcfe8" strokeWidth="2" />
            <text x="140" y="268" textAnchor="middle" fontSize="10" fontWeight="950" fill="#be123c">
              VICTORIA
            </text>
            <text x="140" y="280" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#d97706">
              ARTISAN ICE CREAM
            </text>

            {/* Rolled White Paper Lip */}
            <ellipse cx="140" cy="210" rx="66" ry="12" fill="#ffffff" stroke="#fbcfe8" strokeWidth="3" />
          </g>
        )}

        {container === 'copa' && (
          <g id="GlassCoupeLayer">
            {/* Foot */}
            <ellipse cx="140" cy="342" rx="52" ry="12" fill="url(#crystalGlass)" stroke="#93c5fd" strokeWidth="2" />
            <ellipse cx="140" cy="342" rx="42" ry="7" fill="#ffffff" opacity="0.5" />

            {/* Stem */}
            <path d="M133 270 L133 338 L147 338 L147 270 Z" fill="url(#crystalGlass)" stroke="#93c5fd" strokeWidth="1.5" />
            <line x1="140" y1="272" x2="140" y2="336" stroke="#ffffff" strokeWidth="2" opacity="0.8" />

            {/* Glass Bowl */}
            <path
              d="M65 200 C65 280 215 280 215 200 Z"
              fill="url(#crystalGlass)"
              stroke="#93c5fd"
              strokeWidth="2.5"
            />
            {/* Specular curved glints on crystal */}
            <path d="M82 215 C78 248 102 265 120 265" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
            <path d="M198 215 C202 248 178 265 160 265" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <ellipse cx="140" cy="200" rx="75" ry="14" fill="none" stroke="#bae6fd" strokeWidth="2.5" />
          </g>
        )}

        {container === 'waffle' && (
          <g id="BelgianWaffleLayer">
            {/* Ceramic Pastry Plate with Golden Trim */}
            <ellipse cx="140" cy="318" rx="114" ry="26" fill="#fdf2f8" stroke="#fbcfe8" strokeWidth="2.5" />
            <ellipse cx="140" cy="318" rx="106" ry="22" fill="#ffffff" stroke="#f472b6" strokeWidth="1.2" opacity="0.9" />
            <ellipse cx="140" cy="317" rx="90" ry="17" fill="none" stroke="#fbcfe8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />

            {/* Belgian Waffle 3D Base Thickness */}
            <rect x="52" y="278" width="176" height="24" rx="10" fill="#78350f" />
            <rect x="52" y="274" width="176" height="22" rx="10" fill="#92400e" />

            {/* Top Waffle Grid Crust Surface */}
            <rect x="52" y="258" width="176" height="34" rx="10" fill="url(#waffleConeRealistic)" stroke="#78350f" strokeWidth="2" />

            {/* Deep Square Waffle Grid Pockets */}
            <g opacity="0.88">
              {[0, 1, 2, 3, 4, 5].map((col) => (
                <React.Fragment key={col}>
                  {/* Row 1 */}
                  <rect
                    x={64 + col * 26}
                    y="263"
                    width="18"
                    height="11"
                    rx="2.5"
                    fill="#5c2606"
                    stroke="#78350f"
                    strokeWidth="1.5"
                  />
                  <rect
                    x={65 + col * 26}
                    y="264"
                    width="16"
                    height="3.5"
                    rx="1"
                    fill="#3d1a04"
                    opacity="0.85"
                  />
                  {/* Row 2 */}
                  <rect
                    x={64 + col * 26}
                    y="276"
                    width="18"
                    height="11"
                    rx="2.5"
                    fill="#5c2606"
                    stroke="#78350f"
                    strokeWidth="1.5"
                  />
                  <rect
                    x={65 + col * 26}
                    y="277"
                    width="16"
                    height="3.5"
                    rx="1"
                    fill="#3d1a04"
                    opacity="0.85"
                  />
                </React.Fragment>
              ))}
            </g>

            {/* Golden Honey/Syrup Gloss Lines */}
            <path
              d="M72 268 Q110 260 140 268 Q180 274 208 266"
              stroke="#fef08a"
              strokeWidth="2.5"
              fill="none"
              opacity="0.75"
            />
            <circle cx="100" cy="272" r="2" fill="#fef08a" opacity="0.8" />
            <circle cx="180" cy="270" r="1.8" fill="#fef08a" opacity="0.8" />

            {/* Melting Artisanal Butter Pat */}
            <g transform="translate(194, 262) rotate(12)">
              <rect x="-10" y="-7" width="20" height="14" rx="3" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
              <rect x="-8" y="-5" width="16" height="5" rx="1.5" fill="#fef08a" opacity="0.85" />
              <path d="M-6 7 Q-4 13 0 11 Q4 13 6 7 Z" fill="#facc15" opacity="0.9" />
            </g>
          </g>
        )}

        {/* 3. REALISTIC ICE CREAM SCOOPS */}
        {prepared.scoops.map((scoop, index) => {
          const flavor = INITIAL_FLAVORS.find((f) => f.id === scoop.flavor) || INITIAL_FLAVORS[0];

          let cy = 190 - index * 58;
          let cx = 140;

          if (container === 'copa' && prepared.scoops.length === 3) {
            if (index === 0) { cx = 110; cy = 180; }
            else if (index === 1) { cx = 170; cy = 180; }
            else { cx = 140; cy = 132; }
          } else if (container === 'waffle') {
            if (prepared.scoops.length === 1) {
              cx = 140;
              cy = 215;
            } else if (prepared.scoops.length === 2) {
              if (index === 0) { cx = 106; cy = 218; }
              else { cx = 174; cy = 218; }
            } else if (prepared.scoops.length >= 3) {
              if (index === 0) { cx = 96; cy = 222; }
              else if (index === 1) { cx = 184; cy = 222; }
              else { cx = 140; cy = 168; }
            }
          }

          const r = 48;

          return (
            <g key={scoop.id} className="animate-bounce-in origin-bottom">
              {/* Bottom Scoop Ruffle Skirt (Authentic scooped texture) */}
              <path
                d={`M${cx - r - 4} ${cy + 28} 
                    Q${cx - r + 12} ${cy + 42} ${cx - r + 24} ${cy + 30} 
                    Q${cx - r + 38} ${cy + 44} ${cx} ${cy + 32} 
                    Q${cx + r - 38} ${cy + 44} ${cx + r - 24} ${cy + 30} 
                    Q${cx + r - 12} ${cy + 42} ${cx + r + 4} ${cy + 28} 
                    L${cx + r} ${cy + 15} L${cx - r} ${cy + 15} Z`}
                fill={flavor.secondaryColor}
              />

              {/* Main Spherical Scoop with 3D Radial Lighting */}
              <circle cx={cx} cy={cy} r={r} fill={`url(#scoopGrad_${flavor.id})`} />

              {/* Texture bumps / natural artisanal crevices */}
              <ellipse cx={cx - 18} cy={cy + 8} rx="12" ry="5" fill={flavor.secondaryColor} opacity="0.4" />
              <ellipse cx={cx + 20} cy={cy + 12} rx="10" ry="4" fill={flavor.secondaryColor} opacity="0.35" />

              {/* Strawberry seeds / fruit speckles for Fresa and Mango */}
              {flavor.id === 'fresa' && (
                <g opacity="0.7">
                  <circle cx={cx - 14} cy={cy - 12} r="1.5" fill="#fef08a" />
                  <circle cx={cx + 12} cy={cy - 8} r="1.5" fill="#fef08a" />
                  <circle cx={cx - 5} cy={cy + 14} r="1.5" fill="#fef08a" />
                  <circle cx={cx + 18} cy={cy + 2} r="1.5" fill="#fef08a" />
                </g>
              )}

              {/* Chocolate chunks for Chocolate, Brownie and Menta */}
              {(flavor.id === 'chocolate' || flavor.id === 'brownie' || flavor.id === 'menta') && (
                <g fill="#270e02" opacity="0.8">
                  <rect x={cx - 20} y={cy - 10} width="6" height="5" rx="1.5" transform={`rotate(15 ${cx - 20} ${cy - 10})`} />
                  <rect x={cx + 15} y={cy - 6} width="7" height="6" rx="2" transform={`rotate(-25 ${cx + 15} ${cy - 6})`} />
                  <rect x={cx - 4} y={cy + 12} width="5" height="4" rx="1" transform={`rotate(40 ${cx - 4} ${cy + 12})`} />
                </g>
              )}

              {/* Specular Velvet Highlight */}
              <ellipse
                cx={cx - 16}
                cy={cy - 18}
                rx="18"
                ry="10"
                fill="#ffffff"
                opacity="0.45"
                transform={`rotate(-28 ${cx - 16} ${cy - 18})`}
              />
              <circle cx={cx - 6} cy={cy - 24} r="4.5" fill="#ffffff" opacity="0.75" />
            </g>
          );
        })}

        {/* 4. VISCOUS FLOWING SAUCES */}
        {prepared.sauce && prepared.scoops.length > 0 && (
          <g id="RealisticSauceLayer">
            {(() => {
              const topY =
                container === 'copa' && prepared.scoops.length === 3
                  ? 132
                  : container === 'waffle'
                  ? prepared.scoops.length === 1
                    ? 215
                    : prepared.scoops.length === 2
                    ? 218
                    : 168
                  : 190 - (prepared.scoops.length - 1) * 58;
              let sFill = 'url(#chocSyrup)';
              let sHighlight = '#78350f';

              if (prepared.sauce === 'arequipe') {
                sFill = 'url(#arequipeSyrup)';
                sHighlight = '#fde68a';
              } else if (prepared.sauce === 'fresa') {
                sFill = 'url(#fresaSyrup)';
                sHighlight = '#fda4af';
              }

              return (
                <>
                  {/* Viscous flowing drip cap */}
                  <path
                    d={`M${140 - 44} ${topY - 8} 
                        C${140 - 40} ${topY + 28} ${140 - 24} ${topY + 44} ${140 - 20} ${topY + 18} 
                        C${140 - 14} ${topY + 48} ${140} ${topY + 54} ${140 + 12} ${topY + 22} 
                        C${140 + 22} ${topY + 42} ${140 + 36} ${topY + 36} ${140 + 44} ${topY - 8} Z`}
                    fill={sFill}
                  />
                  {/* Glossy liquid refraction highlight */}
                  <path
                    d={`M${140 - 24} ${topY - 16} Q${140} ${topY - 24} ${140 + 24} ${topY - 16}`}
                    stroke={sHighlight}
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.9"
                  />
                  <ellipse cx="140" cy={topY - 12} rx="26" ry="8" fill="#ffffff" opacity="0.3" />
                  <ellipse cx="140 - 10" cy={topY + 34} rx="3" ry="6" fill="#ffffff" opacity="0.4" />
                </>
              );
            })()}
          </g>
        )}

        {/* 5. TOPPINGS (High-fidelity Realistic Render) */}
        {prepared.toppings.map((topId) => {
          const topY =
            container === 'copa' && prepared.scoops.length === 3
              ? 132
              : container === 'waffle'
              ? prepared.scoops.length === 1
                ? 215
                : prepared.scoops.length === 2
                ? 218
                : 168
              : 190 - (prepared.scoops.length - 1) * 58;

          if (topId === 'chispas') {
            return (
              <g key={topId} id="RealisticSprinkles">
                {[
                  { x: 124, y: topY - 26, c: '#06b6d4', r: 25 },
                  { x: 146, y: topY - 30, c: '#facc15', r: -38 },
                  { x: 162, y: topY - 18, c: '#ec4899', r: 15 },
                  { x: 114, y: topY - 8, c: '#10b981', r: 65 },
                  { x: 136, y: topY - 4, c: '#a855f7', r: -15 },
                  { x: 156, y: topY + 6, c: '#f97316', r: 42 },
                  { x: 118, y: topY + 14, c: '#ec4899', r: -30 },
                  { x: 144, y: topY + 20, c: '#06b6d4', r: 12 },
                  { x: 104, y: topY - 18, c: '#facc15', r: 52 },
                  { x: 168, y: topY - 6, c: '#a855f7', r: -58 },
                  { x: 132, y: topY - 36, c: '#10b981', r: 22 },
                  { x: 152, y: topY - 24, c: '#f43f5e', r: -22 },
                ].map((s, idx) => (
                  <g key={idx}>
                    {/* Tiny shadow */}
                    <rect
                      x={s.x + 1}
                      y={s.y + 1}
                      width="10"
                      height="4.5"
                      rx="2.2"
                      fill="#000000"
                      opacity="0.3"
                      transform={`rotate(${s.r} ${s.x} ${s.y})`}
                    />
                    {/* Cylinder sprinkle */}
                    <rect
                      x={s.x}
                      y={s.y}
                      width="10"
                      height="4.5"
                      rx="2.2"
                      fill={s.c}
                      stroke="#ffffff"
                      strokeWidth="0.8"
                      transform={`rotate(${s.r} ${s.x} ${s.y})`}
                    />
                  </g>
                ))}
              </g>
            );
          }

          if (topId === 'crema_batida') {
            return (
              <g key={topId} id="RealisticWhippedCream" transform={`translate(140, ${topY - 36})`}>
                {/* 3D Fluted Swirl with Shading */}
                <path
                  d="M-36 14 C-44 4 -32 -10 -16 -12 C-10 -30 10 -30 16 -12 C32 -10 44 4 36 14 C26 22 -26 22 -36 14 Z"
                  fill="#ffffff"
                  stroke="#e2e8f0"
                  strokeWidth="1.5"
                />
                {/* Spiral Peak */}
                <path d="M0 -14 Q-6 -34 6 -40 Q7 -32 2 -20" stroke="#cbd5e1" strokeWidth="4" fill="#ffffff" />
                {/* Cream folds and highlights */}
                <path d="M-22 8 Q-6 -12 0 -26" stroke="#e2e8f0" strokeWidth="2.5" fill="none" />
                <path d="M22 8 Q6 -12 0 -26" stroke="#e2e8f0" strokeWidth="2.5" fill="none" />
                <ellipse cx="-12" cy="-6" rx="8" ry="4" fill="#ffffff" opacity="0.8" />
              </g>
            );
          }

          if (topId === 'cereza') {
            const cherryY = prepared.toppings.includes('crema_batida') ? topY - 74 : topY - 46;
            return (
              <g key={topId} id="RealisticCherry" transform={`translate(140, ${cherryY})`}>
                {/* Curved Natural Green Stem with Tiny Leaf */}
                <path d="M0 0 Q20 -35 34 -44" stroke="#15803d" strokeWidth="3" strokeLinecap="round" fill="none" />
                <ellipse cx="30" cy="-40" rx="8" ry="4" fill="#22c55e" stroke="#16a34a" strokeWidth="1" transform="rotate(-30 30 -40)" />

                {/* Shimmering Ruby Red Cherry */}
                <circle cx="0" cy="0" r="16" fill="url(#cherrySpecular)" />
                {/* Glassy curved specular shine */}
                <circle cx="-5" cy="-5" r="5" fill="#ffffff" opacity="0.9" />
                <circle cx="2" cy="-9" r="2.2" fill="#ffffff" opacity="0.85" />
                <ellipse cx="-2" cy="7" rx="6" ry="2" fill="#ffffff" opacity="0.25" />
              </g>
            );
          }

          if (topId === 'galleta') {
            return (
              <g key={topId} id="RealisticCookie" transform={`translate(182, ${topY - 14}) rotate(25)`}>
                {/* Double chocolate cookie sandwich */}
                <ellipse cx="0" cy="0" rx="20" ry="20" fill="#270e02" stroke="#451a03" strokeWidth="2" />
                {/* Cream filling layer in middle */}
                <ellipse cx="0" cy="0" rx="15" ry="15" fill="#fef08a" opacity="0.4" />
                {/* Cookie crumbs/texture */}
                <circle cx="-6" cy="-4" r="2" fill="#150600" />
                <circle cx="5" cy="5" r="2" fill="#150600" />
                <circle cx="-3" cy="7" r="1.5" fill="#150600" />
              </g>
            );
          }

          if (topId === 'waffle_crisp') {
            return (
              <g key={topId} id="RealisticWaffleCrisp" transform={`translate(95, ${topY - 14}) rotate(-25)`}>
                <rect x="-8" y="-36" width="16" height="48" rx="4" fill="#f59e0b" stroke="#92400e" strokeWidth="2" />
                <line x1="-8" y1="-24" x2="8" y2="-18" stroke="#78350f" strokeWidth="2.5" />
                <line x1="-8" y1="-12" x2="8" y2="-6" stroke="#78350f" strokeWidth="2.5" />
                <line x1="-8" y1="0" x2="8" y2="6" stroke="#78350f" strokeWidth="2.5" />
              </g>
            );
          }

          if (topId === 'fresa_fresca') {
            return (
              <g key={topId} id="RealisticStrawberrySlice" transform={`translate(98, ${topY - 10}) rotate(-15)`}>
                <path d="M0 -22 C14 -22 18 4 0 16 C-18 4 -14 -22 0 -22 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
                <path d="M0 -15 C8 -15 10 0 0 10 C-10 0 -8 -15 0 -15 Z" fill="#fca5a5" />
                <circle cx="-4" cy="-6" r="1.2" fill="#fef08a" />
                <circle cx="4" cy="-6" r="1.2" fill="#fef08a" />
                <circle cx="0" cy="2" r="1.2" fill="#fef08a" />
              </g>
            );
          }

          return null;
        })}
      </svg>
    </div>
  );
};
