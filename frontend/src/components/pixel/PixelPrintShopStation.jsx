import React from 'react';

/**
 * PixelPrintShopStation - Top-Right Print Shop Banner Scene
 * Palette: Golden Twilight (#000814, #001D3D, #003566, #7DD3FC, #FFC300, #FFD60A, #FFFFFF, #22C55E)
 * ViewBox: 0 0 200 130
 */
export function PixelPrintShopStation({ width = '100%', height = 110, className = '', style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 130"
      width={width}
      height={height}
      className={`pixelated ${className}`}
      shapeRendering="crispEdges"
      style={{ display: 'block', ...style }}
    >
      {/* Background Soft Studio Tint */}
      <rect width="200" height="130" fill="#F8FAFC" />

      {/* Desk Base Surface */}
      <rect x="0" y="104" width="200" height="26" fill="#000814" />
      <rect x="0" y="101" width="200" height="3" fill="#003566" />
      <rect x="0" y="105" width="200" height="2" fill="#FFC300" opacity="0.4" />

      {/* Soft Cast Shadow */}
      <ellipse cx="102" cy="106" rx="88" ry="7" fill="#000814" opacity="0.75" />

      {/* --- ANGLED ISOMETRIC NAVY PRINTER (LEFT / CENTER) --- */}
      {/* Top Paper Infeed Tray */}
      <rect x="24" y="24" width="46" height="24" fill="#000814" />
      <rect x="26" y="26" width="42" height="20" fill="#003566" />
      {/* Loaded Blank Paper Stack */}
      <rect x="30" y="18" width="34" height="22" fill="#000814" />
      <rect x="32" y="20" width="30" height="20" fill="#FFFFFF" />
      <polygon points="56,20 62,26 56,26" fill="#E2E8F0" />
      <rect x="34" y="24" width="16" height="2" fill="#BAE6FD" />

      {/* Printer Chassis Outline */}
      <rect x="12" y="44" width="86" height="58" rx="3" fill="#000814" />
      {/* Printer Top Bevel (Isometric Top Face) */}
      <rect x="14" y="46" width="82" height="12" fill="#003566" />
      {/* Golden Top Trim Accent */}
      <rect x="14" y="46" width="82" height="3" fill="#FFC300" />
      <rect x="14" y="48" width="82" height="1" fill="#FFD60A" />

      {/* Printer Front Main Body */}
      <rect x="14" y="58" width="82" height="42" fill="#001D3D" />
      <rect x="14" y="58" width="8" height="42" fill="#001428" />

      {/* SIDE PANEL COOLING VENTS */}
      <g fill="#000814">
        <rect x="18" y="70" width="12" height="2" />
        <rect x="18" y="74" width="12" height="2" />
        <rect x="18" y="78" width="12" height="2" />
        <rect x="18" y="82" width="12" height="2" />
        <rect x="18" y="86" width="12" height="2" />
      </g>
      {/* Vent Highlights */}
      <g fill="#003566">
        <rect x="18" y="72" width="12" height="1" />
        <rect x="18" y="76" width="12" height="1" />
        <rect x="18" y="80" width="12" height="1" />
        <rect x="18" y="84" width="12" height="1" />
      </g>

      {/* Control Panel / Display & GREEN STATUS LIGHT LED */}
      <rect x="42" y="62" width="48" height="18" fill="#000814" />
      <rect x="44" y="64" width="44" height="14" fill="#003566" />
      {/* Screen matrix */}
      <rect x="46" y="66" width="22" height="10" fill="#001D3D" />
      <rect x="48" y="68" width="18" height="2" fill="#7DD3FC" />
      <rect x="48" y="72" width="12" height="2" fill="#38BDF8" />

      {/* GREEN STATUS LIGHT LED (#22C55E) with Glow */}
      <rect x="74" y="66" width="6" height="5" fill="#15803D" />
      <rect x="75" y="67" width="4" height="3" fill="#22C55E" />
      <rect x="76" y="68" width="2" height="1" fill="#86EFAC" />
      {/* Secondary Yellow LED */}
      <rect x="82" y="66" width="4" height="5" fill="#FFD60A" />

      {/* Feeder Slot Ejection Tongue */}
      <rect x="36" y="84" width="58" height="6" fill="#000814" />
      <rect x="38" y="85" width="54" height="4" fill="#001428" />

      {/* Fresh Sheet Feeding into Output Tray */}
      <polygon points="44,86 86,86 112,98 62,98" fill="#FFFFFF" />
      <rect x="54" y="90" width="30" height="2" fill="#000814" />
      <rect x="58" y="93" width="36" height="2" fill="#003566" />

      {/* --- MULTI-TIERED STACKS OF FRESHLY PRINTED WHITE PAPER SHEETS (RIGHT TRAY) --- */}
      {/* Catch Tray Base */}
      <polygon points="96,96 172,96 182,104 90,104" fill="#000814" />
      <polygon points="98,97 170,97 179,103 92,103" fill="#003566" />

      {/* MULTI-TIERED HIGH PAPER PILE */}
      {/* Layer 1 (Bottom Stack) */}
      <rect x="106" y="88" width="64" height="14" fill="#000814" />
      <rect x="108" y="90" width="60" height="10" fill="#E2E8F0" />
      {/* Paper page sheet layers lines */}
      <line x1="108" y1="92" x2="168" y2="92" stroke="#CBD5E1" strokeWidth="1" />
      <line x1="108" y1="94" x2="168" y2="94" stroke="#94A3B8" strokeWidth="1" />
      <line x1="108" y1="96" x2="168" y2="96" stroke="#CBD5E1" strokeWidth="1" />
      <line x1="108" y1="98" x2="168" y2="98" stroke="#94A3B8" strokeWidth="1" />

      {/* Layer 2 (Middle Offset Stack - slight rotated/stepped look) */}
      <polygon points="104,74 168,74 172,88 108,88" fill="#000814" />
      <polygon points="106,76 166,76 170,87 110,87" fill="#F1F5F9" />
      {/* Printed lines visible on mid stack */}
      <rect x="114" y="78" width="28" height="2" fill="#000814" />
      <rect x="114" y="82" width="38" height="2" fill="#003566" />

      {/* Layer 3 (Top Fresh Stack) */}
      <polygon points="108,58 174,58 178,74 112,74" fill="#000814" />
      <polygon points="110,60 172,60 176,72 114,72" fill="#FFFFFF" />
      {/* Top Printed Document Face */}
      <rect x="118" y="62" width="34" height="2" fill="#000814" />
      <rect x="118" y="66" width="46" height="2" fill="#000814" />
      <rect x="118" y="70" width="24" height="2" fill="#003566" />
      {/* Golden Approved / Ready Stamp on top sheet */}
      <rect x="154" y="62" width="12" height="8" rx="1" fill="#FFC300" />
      <rect x="156" y="64" width="8" height="4" fill="#FFD60A" />

      {/* Floating Sparkles in Golden Twilight Yellow */}
      <g fill="#FFD60A">
        <rect x="94" y="28" width="5" height="1" />
        <rect x="96" y="26" width="1" height="5" />

        <rect x="178" y="44" width="5" height="1" />
        <rect x="180" y="42" width="1" height="5" />

        <rect x="18" y="32" width="4" height="1" />
        <rect x="19.5" y="30.5" width="1" height="4" />
      </g>
    </svg>
  );
}
