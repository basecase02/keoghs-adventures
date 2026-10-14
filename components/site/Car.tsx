/**
 * Side-on expedition 4WD for the loader: boxy wagon, loaded roof rack
 * (jerry cans, swag, recovery boards), Canning sand flag, snorkel, bull bar,
 * rear spare and all-terrain tyres. Wheels, flag and dust are animated in CSS.
 */
function Wheel({ cx }: { cx: number }) {
  return (
    <g>
      <circle cx={cx} cy="84" r="15" fill="#0B0907" />
      <circle cx={cx} cy="84" r="13.5" fill="none" stroke="#2E2620" strokeWidth="3" strokeDasharray="3 2.2" />
      <g className="spin" style={{ transformOrigin: `${cx}px 84px` }}>
        <circle cx={cx} cy="84" r="7.5" fill="#6E655C" />
        <circle cx={cx} cy="84" r="2.6" fill="#1C1712" />
        {[0, 72, 144, 216, 288].map((a) => (
          <circle key={a} cx={cx + 5 * Math.cos((a * Math.PI) / 180)} cy={84 + 5 * Math.sin((a * Math.PI) / 180)} r="1.1" fill="#1C1712" />
        ))}
      </g>
    </g>
  );
}

export default function Car() {
  return (
    <svg viewBox="0 0 250 104" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="beam" x1="0" x2="1">
          <stop offset="0" stopColor="#FFD08A" stopOpacity=".55" />
          <stop offset="1" stopColor="#FFD08A" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* dust kicked up behind */}
      <g className="dust">
        <circle cx="30" cy="92" r="6" fill="rgba(229,174,85,.32)" />
        <circle cx="16" cy="88" r="8" fill="rgba(229,174,85,.22)" />
        <circle cx="4" cy="84" r="9" fill="rgba(229,174,85,.12)" />
      </g>

      {/* headlight beam */}
      <polygon points="203,64 250,52 250,82" fill="url(#beam)" />

      {/* sand flag */}
      <line x1="48" y1="30" x2="48" y2="2" stroke="#E5AE55" strokeWidth="1.4" />
      <path className="flag" d="M48 3 L66 7 L48 13 Z" fill="#F26A1B" />

      {/* roof rack + load */}
      <rect x="50" y="27" width="104" height="3" rx="1" fill="#28201A" />
      <rect x="54" y="15" width="9" height="12" rx="1.5" fill="#5E7A3C" />
      <rect x="65" y="15" width="9" height="12" rx="1.5" fill="#B8431B" />
      <rect x="78" y="17" width="30" height="10" rx="5" fill="#3B3029" />
      <line x1="86" y1="17" x2="86" y2="27" stroke="#5A4A3E" strokeWidth="1.5" />
      <line x1="100" y1="17" x2="100" y2="27" stroke="#5A4A3E" strokeWidth="1.5" />
      <rect x="112" y="20" width="40" height="3.2" rx="1" fill="#F26A1B" />
      <rect x="114" y="23.4" width="40" height="3.2" rx="1" fill="#E85A0C" />
      <rect x="50" y="30" width="96" height="3" rx="1.5" fill="#4E453B" />

      {/* rear spare on the back door */}
      <circle cx="30" cy="60" r="11" fill="#0B0907" />
      <circle cx="30" cy="60" r="5" fill="#6E655C" />

      {/* body */}
      <path d="M34 82 L34 42 Q34 34 42 34 L144 34 L160 54 L194 56 Q201 57 201 64 L201 82 Z" fill="#F4EDE2" />
      <rect x="34" y="62" width="167" height="4" fill="#F26A1B" />
      <rect x="34" y="74" width="167" height="8" fill="#2A221C" />

      {/* windows */}
      <rect x="42" y="39" width="36" height="14" rx="2" fill="#1C1712" />
      <rect x="82" y="39" width="30" height="14" rx="2" fill="#1C1712" />
      <path d="M116 39 L141 39 L153 53 L116 53 Z" fill="#1C1712" />
      <path d="M118 41 L128 41 L122 51 L118 51 Z" fill="rgba(255,255,255,.12)" />

      {/* door lines + handles */}
      <line x1="80" y1="38" x2="80" y2="74" stroke="#D9CDBB" strokeWidth="1" />
      <line x1="114" y1="38" x2="114" y2="74" stroke="#D9CDBB" strokeWidth="1" />
      <rect x="100" y="56" width="7" height="2" rx="1" fill="#877C70" />
      <rect x="134" y="56" width="7" height="2" rx="1" fill="#877C70" />

      {/* snorkel */}
      <path d="M156 70 L156 44 L151 33" stroke="#1C1712" strokeWidth="3.2" strokeLinecap="round" />
      <rect x="146" y="30" width="8" height="4" rx="1.5" fill="#1C1712" />

      {/* bull bar, spotlight, headlight, taillight */}
      <path d="M199 58 L208 58 L208 84 L199 84" stroke="#1C1712" strokeWidth="3" fill="none" />
      <line x1="199" y1="68" x2="208" y2="68" stroke="#1C1712" strokeWidth="2" />
      <circle cx="206" cy="53" r="3.6" fill="#FFD08A" />
      <rect x="194" y="61" width="6" height="4" rx="1" fill="#FFE2B0" />
      <rect x="34" y="66" width="3" height="6" fill="#D04A3F" />

      {/* wheel arches + wheels */}
      <path d="M44 82 A21 21 0 0 1 86 82" fill="#100D0A" />
      <path d="M148 82 A21 21 0 0 1 190 82" fill="#100D0A" />
      <Wheel cx={65} />
      <Wheel cx={169} />
    </svg>
  );
}
