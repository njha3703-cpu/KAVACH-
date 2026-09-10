import React from 'react';

interface KavachLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  showWordmark?: boolean;
}

/**
 * Official KAVACH Mine Subsidence Monitoring & Early Warning System Emblem
 * 
 * Crisp, high-contrast vector emblem:
 * - Dual-contour golden protective shield rim
 * - Radiant sun over geological coal & rock strata
 * - Mining helmet with safety headlamp beam
 * - Upward protective cradling hands of vigilance & safety
 */
export const KavachLogo: React.FC<KavachLogoProps> = ({ 
  className = "w-10 h-10", 
  size,
  showText = false,
  showWordmark = false
}) => {
  const isTextVisible = showText || showWordmark;
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div className={`inline-flex items-center space-x-3 select-none ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-md"
        style={style || { width: '100%', height: '100%' }}
      >
        <defs>
          {/* Metallic Gold Ring Gradient */}
          <linearGradient id="kavachGoldRim" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Deep Institutional Navy Background */}
          <radialGradient id="kavachShieldBg" cx="50%" cy="45%" r="55%" fx="50%" fy="30%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="60%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Radiant Sun Gradient */}
          <linearGradient id="kavachSun" x1="50" y1="20" x2="50" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="60%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>

          {/* Mountain Coal Rock Strata Gradient */}
          <linearGradient id="kavachStrata" x1="50" y1="35" x2="50" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Headlamp Beam Glow */}
          <linearGradient id="kavachBeam" x1="60" y1="46" x2="90" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
          </linearGradient>

          {/* Protective Hands Ivory/Slate Gradient */}
          <linearGradient id="kavachHands" x1="50" y1="65" x2="50" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
        </defs>

        {/* 1. Outer Circular Base & Metallic Gold Shield Rim */}
        <circle cx="50" cy="50" r="48" fill="url(#kavachShieldBg)" stroke="url(#kavachGoldRim)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" stroke="#38BDF8" strokeWidth="0.75" strokeOpacity="0.6" strokeDasharray="3 2" />

        {/* 2. Rising Golden Sun / Early Warning Horizon */}
        <circle cx="50" cy="38" r="18" fill="url(#kavachSun)" />
        {/* Subtle Sun Rays */}
        <g stroke="#FDE047" strokeWidth="1" strokeLinecap="round" opacity="0.85">
          <line x1="50" y1="16" x2="50" y2="12" />
          <line x1="34" y1="22" x2="31" y2="19" />
          <line x1="66" y1="22" x2="69" y2="19" />
          <line x1="26" y1="38" x2="22" y2="38" />
          <line x1="74" y1="38" x2="78" y2="38" />
        </g>

        {/* 3. Geological Coal Strata & Mine Bedrock Mountain Geometry */}
        {/* Back mountain ridge */}
        <polygon points="20,62 38,32 56,62" fill="url(#kavachStrata)" stroke="#475569" strokeWidth="0.5" />
        <polygon points="44,62 62,34 80,62" fill="url(#kavachStrata)" stroke="#475569" strokeWidth="0.5" />
        {/* Foreground central mountain peak */}
        <polygon points="32,65 50,26 68,65" fill="#0B132B" stroke="#64748B" strokeWidth="0.75" />
        {/* Strata fracture facets */}
        <polygon points="50,26 50,65 42,48" fill="#475569" opacity="0.8" />
        <polygon points="50,26 58,45 50,65" fill="#1E293B" opacity="0.9" />

        {/* 4. Headlamp Directional Safety Beam illuminating strata */}
        <polygon points="60,45 86,36 88,52 62,48" fill="url(#kavachBeam)" />

        {/* 5. Miner Profile with Safety Helmet (Facing Right) */}
        <g id="miner-figure">
          {/* Head silhouette */}
          <path
            d="M44 54 C44 49 48 45 53 45 C58 45 61 48 61 54 C61 59 58 63 53 63 C48 63 44 59 44 54 Z"
            fill="#090E17"
          />
          {/* Vivid Safety Hard Hat / Helmet */}
          <path
            d="M39 48 C39 39 45 35 53 35 C61 35 66 40 66 48 L39 48 Z"
            fill="#F59E0B"
            stroke="#D97706"
            strokeWidth="0.75"
          />
          {/* Helmet Ridge / Crown Reinforcement */}
          <path
            d="M50 35 C52 35 54 35 56 35 L55 42 L51 42 Z"
            fill="#FDE047"
          />
          {/* Helmet Brim */}
          <path
            d="M37 48 C41 47 54 46 68 46 C69 47 67 50 65 50 C54 50 41 50 37 48 Z"
            fill="#FBBF24"
          />
          {/* Miner Headlamp Unit */}
          <ellipse cx="63" cy="46" rx="3.5" ry="3.5" fill="#1E293B" stroke="#FDE047" strokeWidth="0.6" />
          <ellipse cx="63" cy="46" rx="2.2" ry="2.2" fill="#FFFFFF" />
          <circle cx="63.5" cy="45.5" r="1.2" fill="#38BDF8" />
          {/* Neck and Shoulder Collar */}
          <path
            d="M46 62 L42 69 C45 71 52 72 58 71 L56 62 Z"
            fill="#1E293B"
          />
        </g>

        {/* 6. Two Symmetrical Protective Cradling Hands (Sheltering & Security) */}
        {/* Left protective hand */}
        <path
          d="M18 64 
             C20 74 27 82 36 87 
             C42 90 48 91 49 91
             C49 88 47 84 44 82
             C39 79 34 74 33 67
             C32 63 29 64 29 67
             C29 73 34 80 40 83
             C36 81 29 74 28 66
             C28 63 25 63 25 66
             C25 71 30 79 36 83
             C31 80 23 71 22 64
             C22 61 18 61 18 64 Z"
          fill="url(#kavachHands)"
          stroke="#0284C7"
          strokeWidth="0.5"
        />

        {/* Right protective hand */}
        <path
          d="M82 64 
             C80 74 73 82 64 87 
             C58 90 52 91 51 91
             C51 88 53 84 56 82
             C61 79 66 74 67 67
             C68 63 71 64 71 67
             C71 73 66 80 60 83
             C64 81 71 74 72 66
             C72 63 75 63 75 66
             C75 71 70 79 64 83
             C69 80 77 71 78 64
             C78 61 82 61 82 64 Z"
          fill="url(#kavachHands)"
          stroke="#0284C7"
          strokeWidth="0.5"
        />

        {/* Cradling Palm Junction & Security Keystones */}
        <ellipse cx="50" cy="89" rx="6" ry="3" fill="#D97706" />
        <circle cx="50" cy="89" r="1.5" fill="#FDE047" />
      </svg>

      {isTextVisible && (
        <div className="flex flex-col text-left">
          <div className="flex items-center space-x-1.5">
            <span className="font-display font-black text-lg tracking-wider text-white leading-none">
              KAVACH
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              SAFETY
            </span>
          </div>
          <span className="text-[9.5px] text-cyan-400/90 font-mono-tech tracking-wider mt-0.5 uppercase font-medium">
            Mine Subsidence Monitoring
          </span>
        </div>
      )}
    </div>
  );
};
