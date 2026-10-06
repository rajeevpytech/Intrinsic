const DOTS = [0, 1.1, 2.2];

const BcHeroMotion = () => (
  <div className="relative w-full max-w-[760px] bc-hero-motion" data-testid="bdr-hero-visual">
    <img src="/images/bc-hero.png" alt="Controlled restoration from your production environment to a protected recovery environment" className="w-full h-auto block" width="1600" height="763" data-testid="bdr-hero-image" />
    <svg viewBox="0 0 1600 763" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      <defs>
        <radialGradient id="bcDot"><stop offset="0" stopColor="#ffd28a" /><stop offset="0.5" stopColor="#f2a91c" /><stop offset="1" stopColor="#f2a91c" stopOpacity="0" /></radialGradient>
        <radialGradient id="bcHalo"><stop offset="0" stopColor="#7fb2ff" stopOpacity="0.16" /><stop offset="1" stopColor="#7fb2ff" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse className="bc-cloud-halo" cx="1355" cy="180" rx="230" ry="150" fill="url(#bcHalo)" />
      <line x1="480" y1="421" x2="955" y2="421" stroke="#f2a91c" strokeWidth="3" strokeLinecap="round" className="bc-beam" />
      {DOTS.map((b) => (
        <circle key={b} r="11" fill="url(#bcDot)" className="bc-packet">
          <animateMotion dur="3.3s" begin={`${b}s`} repeatCount="indefinite" path="M480 421 L955 421" keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
        </circle>
      ))}
      {[560, 689, 809].map((x, i) => (
        <circle key={x} cx={x} cy="421" r="9" fill="none" stroke="#f2a91c" strokeWidth="2" className="bc-ring" style={{ "--i": i }} />
      ))}
      <circle cx="962" cy="421" r="16" fill="#f2a91c" className="bc-arrow-glow" />
    </svg>
  </div>
);

export default BcHeroMotion;
