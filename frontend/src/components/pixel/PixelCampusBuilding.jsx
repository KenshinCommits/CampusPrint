import React from 'react';

/**
 * Isometric 16-bit University Campus Building Illustration
 * Palette: Golden Twilight (#000814, #001D3D, #003566, #7DD3FC, #FFC300, #FFD60A, #E05A47, #C2410C, #22C55E, #15803D)
 * ViewBox: 0 0 160 140
 */
export function PixelCampusBuilding({ width = 160, height = 140, className = '', style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 140"
      width={width}
      height={height}
      className={`pixelated ${className}`}
      shapeRendering="crispEdges"
      style={{ display: 'block', ...style }}
    >
      {/* Sky backdrop */}
      <rect width="160" height="140" fill="#001428" />

      {/* Distant stars / night sparkles */}
      <rect x="22" y="16" width="2" height="2" fill="#BAE6FD" opacity="0.8" />
      <rect x="140" y="24" width="2" height="2" fill="#FFD60A" opacity="0.9" />
      <rect x="80" y="8" width="2" height="2" fill="#FFFFFF" opacity="0.7" />
      <rect x="12" y="38" width="2" height="2" fill="#7DD3FC" opacity="0.6" />
      <rect x="148" y="12" width="3" height="1" fill="#FFD60A" />
      <rect x="149" y="11" width="1" height="3" fill="#FFD60A" />

      {/* Ground Foundation / Pavement */}
      <rect x="0" y="122" width="160" height="18" fill="#000814" />
      <rect x="0" y="120" width="160" height="2" fill="#003566" />
      <rect x="10" y="125" width="140" height="2" fill="#001D3D" />

      {/* --- FLANKING WINGS (Left and Right Stepped Wings) --- */}

      {/* LEFT WING */}
      {/* Wing Base Shadow & Outline */}
      <rect x="16" y="66" width="46" height="54" fill="#000814" />
      {/* Wing Left Face (Darker shading) */}
      <rect x="18" y="68" width="14" height="52" fill="#001D3D" />
      {/* Wing Front Face */}
      <rect x="32" y="68" width="28" height="52" fill="#003566" />
      {/* Wing Cornice / Roof Trim */}
      <rect x="15" y="64" width="48" height="4" fill="#000814" />
      <rect x="16" y="64" width="46" height="2" fill="#FFC300" />
      {/* Wing Stepped Parapet */}
      <rect x="20" y="60" width="10" height="4" fill="#001D3D" />
      <rect x="36" y="60" width="10" height="4" fill="#003566" />
      <rect x="20" y="59" width="10" height="1" fill="#000814" />
      <rect x="36" y="59" width="10" height="1" fill="#000814" />

      {/* Left Wing Lit Windows Grid */}
      {/* Floor 3 */}
      <rect x="22" y="72" width="6" height="8" fill="#7DD3FC" />
      <rect x="36" y="72" width="6" height="8" fill="#FFD60A" />
      <rect x="48" y="72" width="6" height="8" fill="#7DD3FC" />
      {/* Floor 2 */}
      <rect x="22" y="86" width="6" height="8" fill="#FFD60A" />
      <rect x="36" y="86" width="6" height="8" fill="#BAE6FD" />
      <rect x="48" y="86" width="6" height="8" fill="#FFC300" />
      {/* Floor 1 */}
      <rect x="22" y="100" width="6" height="8" fill="#7DD3FC" />
      <rect x="36" y="100" width="6" height="8" fill="#FFD60A" />
      <rect x="48" y="100" width="6" height="8" fill="#7DD3FC" />

      {/* Window mullions (1px black dividers) */}
      <rect x="25" y="72" width="1" height="8" fill="#000814" />
      <rect x="39" y="72" width="1" height="8" fill="#000814" />
      <rect x="51" y="72" width="1" height="8" fill="#000814" />
      <rect x="25" y="86" width="1" height="8" fill="#000814" />
      <rect x="39" y="86" width="1" height="8" fill="#000814" />
      <rect x="51" y="86" width="1" height="8" fill="#000814" />
      <rect x="25" y="100" width="1" height="8" fill="#000814" />
      <rect x="39" y="100" width="1" height="8" fill="#000814" />
      <rect x="51" y="100" width="1" height="8" fill="#000814" />

      {/* RIGHT WING */}
      {/* Wing Base Shadow & Outline */}
      <rect x="98" y="66" width="46" height="54" fill="#000814" />
      {/* Wing Front Face */}
      <rect x="100" y="68" width="28" height="52" fill="#003566" />
      {/* Wing Right Face (Darker shading) */}
      <rect x="128" y="68" width="14" height="52" fill="#001D3D" />
      {/* Wing Cornice / Roof Trim */}
      <rect x="97" y="64" width="48" height="4" fill="#000814" />
      <rect x="98" y="64" width="46" height="2" fill="#FFC300" />
      {/* Wing Stepped Parapet */}
      <rect x="114" y="60" width="10" height="4" fill="#003566" />
      <rect x="130" y="60" width="10" height="4" fill="#001D3D" />
      <rect x="114" y="59" width="10" height="1" fill="#000814" />
      <rect x="130" y="59" width="10" height="1" fill="#000814" />

      {/* Right Wing Lit Windows Grid */}
      {/* Floor 3 */}
      <rect x="106" y="72" width="6" height="8" fill="#FFD60A" />
      <rect x="118" y="72" width="6" height="8" fill="#7DD3FC" />
      <rect x="132" y="72" width="6" height="8" fill="#BAE6FD" />
      {/* Floor 2 */}
      <rect x="106" y="86" width="6" height="8" fill="#7DD3FC" />
      <rect x="118" y="86" width="6" height="8" fill="#FFC300" />
      <rect x="132" y="86" width="6" height="8" fill="#FFD60A" />
      {/* Floor 1 */}
      <rect x="106" y="100" width="6" height="8" fill="#FFD60A" />
      <rect x="118" y="100" width="6" height="8" fill="#7DD3FC" />
      <rect x="132" y="100" width="6" height="8" fill="#BAE6FD" />

      {/* Window mullions (1px black dividers) */}
      <rect x="109" y="72" width="1" height="8" fill="#000814" />
      <rect x="121" y="72" width="1" height="8" fill="#000814" />
      <rect x="135" y="72" width="1" height="8" fill="#000814" />
      <rect x="109" y="86" width="1" height="8" fill="#000814" />
      <rect x="121" y="86" width="1" height="8" fill="#000814" />
      <rect x="135" y="86" width="1" height="8" fill="#000814" />
      <rect x="109" y="100" width="1" height="8" fill="#000814" />
      <rect x="121" y="100" width="1" height="8" fill="#000814" />
      <rect x="135" y="100" width="1" height="8" fill="#000814" />

      {/* --- CENTRAL TOWER (Dark Navy / Terracotta Brick) --- */}
      {/* Tower Outline */}
      <rect x="56" y="32" width="48" height="88" fill="#000814" />
      {/* Tower Body Face (Brick red / Dark Navy architectural blend) */}
      <rect x="58" y="34" width="44" height="86" fill="#C2410C" />
      {/* Front Face Left Shading */}
      <rect x="58" y="34" width="10" height="86" fill="#A0330A" />
      {/* Front Face Center Highlight */}
      <rect x="68" y="34" width="24" height="86" fill="#E05A47" />

      {/* Brick texture accent pixels */}
      <rect x="60" y="44" width="4" height="2" fill="#7C2D12" />
      <rect x="74" y="48" width="5" height="2" fill="#F87171" opacity="0.6" />
      <rect x="92" y="42" width="4" height="2" fill="#7C2D12" />
      <rect x="62" y="62" width="5" height="2" fill="#7C2D12" />
      <rect x="88" y="66" width="5" height="2" fill="#7C2D12" />
      <rect x="72" y="82" width="6" height="2" fill="#F87171" opacity="0.6" />

      {/* TOWER POINTED ROOF (Stepped Isometric Roof) */}
      {/* Roof Outline */}
      <polygon points="80,10 52,34 108,34" fill="#000814" />
      {/* Roof Left Slope (Dark Navy Shading) */}
      <polygon points="80,12 54,34 80,34" fill="#001D3D" />
      {/* Roof Right Slope (Lighter Slate Blue / Terracotta) */}
      <polygon points="80,12 80,34 106,34" fill="#003566" />
      {/* Gold Roof Finial Spire */}
      <rect x="79" y="4" width="2" height="8" fill="#FFC300" />
      <rect x="78" y="3" width="4" height="2" fill="#FFD60A" />

      {/* Belfry Louvers */}
      <rect x="74" y="36" width="12" height="12" fill="#000814" />
      <rect x="76" y="38" width="8" height="2" fill="#FFC300" />
      <rect x="76" y="42" width="8" height="2" fill="#FFC300" />
      <rect x="76" y="46" width="8" height="2" fill="#FFC300" />

      {/* ROUND CLOCK FACE NEAR PEAK */}
      {/* Clock Outer Rim */}
      <rect x="72" y="52" width="16" height="16" rx="4" fill="#000814" />
      <rect x="73" y="53" width="14" height="14" fill="#FFC300" />
      <rect x="74" y="54" width="12" height="12" fill="#FFFFFF" />
      {/* Clock Center & Hands (pointing to 2:40 PM / 10:10) */}
      <rect x="79" y="59" width="2" height="2" fill="#000814" />
      <rect x="80" y="56" width="1" height="4" fill="#000814" />
      <rect x="80" y="60" width="4" height="1" fill="#000814" />
      {/* Hour markers */}
      <rect x="79" y="54" width="2" height="1" fill="#001D3D" />
      <rect x="79" y="65" width="2" height="1" fill="#001D3D" />
      <rect x="74" y="59" width="1" height="2" fill="#001D3D" />
      <rect x="85" y="59" width="1" height="2" fill="#001D3D" />

      {/* Decorative Golden Belt Course */}
      <rect x="56" y="72" width="48" height="3" fill="#000814" />
      <rect x="56" y="73" width="48" height="2" fill="#FFD60A" />

      {/* Tower Windows (Floor 2) */}
      <rect x="64" y="78" width="10" height="14" fill="#000814" />
      <rect x="66" y="80" width="6" height="10" fill="#FFD60A" />
      <rect x="86" y="78" width="10" height="14" fill="#000814" />
      <rect x="88" y="80" width="6" height="10" fill="#7DD3FC" />

      {/* GRAND ARCHED ENTRANCE PORTAL */}
      {/* Stone Arch Surround */}
      <rect x="68" y="96" width="24" height="24" fill="#000814" />
      <rect x="70" y="98" width="20" height="22" fill="#FFC300" />
      {/* Inner Portal Arch */}
      <path d="M 72 104 Q 80 98 88 104 L 88 120 L 72 120 Z" fill="#000814" />
      {/* Warm Golden Interior Light */}
      <path d="M 74 105 Q 80 101 86 105 L 86 120 L 74 120 Z" fill="#FFD60A" />
      {/* Double Wooden Doors */}
      <rect x="75" y="108" width="4" height="12" fill="#7C2D12" />
      <rect x="81" y="108" width="4" height="12" fill="#7C2D12" />
      {/* Door handles */}
      <rect x="78" y="114" width="1" height="2" fill="#FFC300" />
      <rect x="81" y="114" width="1" height="2" fill="#FFC300" />

      {/* Front Entrance Steps */}
      <rect x="64" y="120" width="32" height="2" fill="#FFFFFF" />
      <rect x="62" y="122" width="36" height="2" fill="#E2E8F0" />
      <rect x="60" y="124" width="40" height="2" fill="#CBD5E1" />

      {/* --- GROUND FOLIAGE (3-4 Round & Stepped Pixel Bushes and Trees) --- */}

      {/* Tree Left (Evergreen Pine / Stepped Oak) */}
      {/* Trunk */}
      <rect x="10" y="108" width="4" height="14" fill="#7C2D12" />
      {/* Foliage Steps */}
      <rect x="2" y="102" width="20" height="7" fill="#166534" />
      <rect x="4" y="94" width="16" height="8" fill="#15803D" />
      <rect x="7" y="86" width="10" height="8" fill="#22C55E" />
      <rect x="9" y="82" width="6" height="4" fill="#4ADE80" />
      {/* Tree Shading & Highlights */}
      <rect x="6" y="96" width="4" height="3" fill="#86EFAC" />
      <rect x="14" y="103" width="6" height="4" fill="#14532D" />

      {/* Left Bush flanking Entrance */}
      <rect x="48" y="112" width="14" height="10" fill="#000814" />
      <rect x="50" y="111" width="10" height="9" fill="#166534" />
      <rect x="52" y="110" width="6" height="8" fill="#22C55E" />
      <rect x="53" y="112" width="3" height="2" fill="#86EFAC" />

      {/* Right Bush flanking Entrance */}
      <rect x="98" y="112" width="14" height="10" fill="#000814" />
      <rect x="100" y="111" width="10" height="9" fill="#166534" />
      <rect x="102" y="110" width="6" height="8" fill="#22C55E" />
      <rect x="104" y="112" width="3" height="2" fill="#86EFAC" />

      {/* Tree Right */}
      {/* Trunk */}
      <rect x="146" y="106" width="4" height="16" fill="#7C2D12" />
      {/* Foliage Steps */}
      <rect x="138" y="100" width="20" height="8" fill="#166534" />
      <rect x="140" y="92" width="16" height="8" fill="#15803D" />
      <rect x="143" y="84" width="10" height="8" fill="#22C55E" />
      <rect x="145" y="80" width="6" height="4" fill="#4ADE80" />
      {/* Highlight */}
      <rect x="142" y="94" width="4" height="3" fill="#86EFAC" />
      <rect x="150" y="102" width="6" height="4" fill="#14532D" />

      {/* Floating 8-bit sparkles near the tower peak */}
      <g fill="#FFD60A">
        <rect x="46" y="24" width="5" height="1" />
        <rect x="48" y="22" width="1" height="5" />

        <rect x="112" y="18" width="5" height="1" />
        <rect x="114" y="16" width="1" height="5" />
      </g>
    </svg>
  );
}
