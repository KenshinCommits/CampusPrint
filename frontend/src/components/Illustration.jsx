// Simple geometric Neo-Brutalist hero illustration: document, printer,
// queue token, and a check mark. No stock art, just shapes + the palette.
export function HeroIllustration() {
  return (
    <svg viewBox="0 0 380 340" width="100%" height="auto" style={{ maxWidth: 420 }} role="img" aria-label="CampusPrint illustration">
      <rect x="6" y="6" width="368" height="328" rx="18" fill="#FFD43B" stroke="#111111" strokeWidth="3" transform="rotate(-2 190 170)" />

      {/* Document */}
      <g transform="translate(36 40) rotate(-4)">
        <rect x="0" y="0" width="120" height="150" rx="8" fill="#FFFFFF" stroke="#111111" strokeWidth="3" />
        <rect x="16" y="22" width="88" height="8" fill="#111111" />
        <rect x="16" y="42" width="88" height="8" fill="#111111" />
        <rect x="16" y="62" width="60" height="8" fill="#111111" />
        <rect x="16" y="92" width="88" height="8" fill="#4D7CFE" />
        <rect x="16" y="112" width="50" height="8" fill="#4D7CFE" />
      </g>

      {/* Printer */}
      <g transform="translate(180 150)">
        <rect x="0" y="20" width="150" height="70" rx="10" fill="#111111" />
        <rect x="16" y="0" width="118" height="34" rx="4" fill="#FFFFFF" stroke="#111111" strokeWidth="3" />
        <rect x="20" y="60" width="110" height="46" rx="4" fill="#FFFFFF" stroke="#111111" strokeWidth="3" />
        <rect x="34" y="72" width="82" height="8" fill="#B8F23D" />
        <circle cx="130" cy="40" r="6" fill="#FF6B5E" />
      </g>

      {/* Queue token */}
      <g transform="translate(52 220)">
        <circle cx="34" cy="34" r="34" fill="#4D7CFE" stroke="#111111" strokeWidth="3" />
        <text x="34" y="42" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="20" fill="#FFFFFF">
          07
        </text>
      </g>

      {/* Check mark badge */}
      <g transform="translate(280 40)">
        <circle cx="30" cy="30" r="30" fill="#B8F23D" stroke="#111111" strokeWidth="3" />
        <path d="M17 31 L26 40 L44 20" stroke="#111111" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
