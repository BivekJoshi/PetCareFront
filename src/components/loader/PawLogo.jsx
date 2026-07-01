// Inlined version of LogoIcon.svg so individual paw toes can be CSS-animated.
// (An SVG loaded via <img> is opaque — its inner paths can't be targeted.)
const PawLogo = ({ className = "", size = 50 }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width={size}
    height={size}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="pc-tealf" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#16A9A5" />
        <stop offset="1" stopColor="#0B6E6C" />
      </linearGradient>
      <linearGradient id="pc-orangef" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFB05C" />
        <stop offset="1" stopColor="#F5811F" />
      </linearGradient>
      <linearGradient id="pc-sheenf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
        <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.05" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="pc-vigf" cx="0.5" cy="0.32" r="0.85">
        <stop offset="0.55" stopColor="#000000" stopOpacity="0" />
        <stop offset="1" stopColor="#084F4E" stopOpacity="0.45" />
      </radialGradient>
    </defs>

    <rect width="64" height="64" rx="16.32" fill="url(#pc-tealf)" />
    <rect width="64" height="64" rx="16.32" fill="url(#pc-vigf)" />
    <rect width="64" height="64" rx="16.32" fill="url(#pc-sheenf)" />
    <rect
      x="1"
      y="1"
      width="62"
      height="62"
      rx="15.32"
      fill="none"
      stroke="#ffffff"
      strokeOpacity="0.10"
      strokeWidth="1.4"
    />

    <g transform="translate(10.88,10.88) scale(0.4224)">
      {/* main pad */}
      <path
        className="pc-paw__pad"
        d="M50 52.5 C40.5 52.5 32.5 58.7 32.5 68 C32.5 74.8 36.2 80 41.4 82.7 C45 84.6 47 86.5 50 86.5 C53 86.5 55 84.6 58.6 82.7 C63.8 80 67.5 74.8 67.5 68 C67.5 58.7 59.5 52.5 50 52.5 Z"
        fill="#FFFFFF"
      />
      {/* toes — tap in sequence (class on the ellipse so the group's rotate survives) */}
      <g transform="rotate(-20 22 47)">
        <ellipse className="pc-paw__toe pc-paw__toe--1" cx="22" cy="47" rx="8.6" ry="11.4" fill="#FFFFFF" />
      </g>
      <g transform="rotate(-7 40 32.5)">
        <ellipse className="pc-paw__toe pc-paw__toe--2" cx="40" cy="32.5" rx="8.9" ry="12.4" fill="#FFFFFF" />
      </g>
      <g transform="rotate(7 60 32.5)">
        <ellipse className="pc-paw__toe pc-paw__toe--3" cx="60" cy="32.5" rx="8.9" ry="12.4" fill="#FFFFFF" />
      </g>
      <g transform="rotate(20 78 47)">
        <ellipse className="pc-paw__toe pc-paw__toe--4" cx="78" cy="47" rx="8.6" ry="11.4" fill="#FFFFFF" />
      </g>
    </g>
  </svg>
);

export default PawLogo;
