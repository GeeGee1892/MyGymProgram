import React from 'react';
import Svg, { Path, Rect, G, Defs, LinearGradient, Stop } from 'react-native-svg';

// Minimalist professional logo - bold upward chevron
export const AppLogo = ({ size = 120 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Defs>
        <LinearGradient id="chevronGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#10b981" />
          <Stop offset="100%" stopColor="#059669" />
        </LinearGradient>
      </Defs>
      
      {/* Bold upward chevron - primary element */}
      <Path
        d="M60 25L100 60H85L60 38L35 60H20Z"
        fill="url(#chevronGrad)"
      />
      
      {/* Second chevron for depth */}
      <Path
        d="M60 45L85 67H75L60 54L45 67H35Z"
        fill="#10b981"
        opacity="0.5"
      />
      
      {/* Minimal barbell mark */}
      <G transform="translate(45, 85)">
        {/* Left */}
        <Rect x="0" y="0" width="6" height="14" rx="1.5" fill="#fff" />
        <Rect x="6" y="3" width="3" height="8" rx="0.5" fill="#fff" opacity="0.8" />
        
        {/* Bar */}
        <Rect x="9" y="5" width="12" height="4" rx="1" fill="#fff" />
        
        {/* Right */}
        <Rect x="21" y="3" width="3" height="8" rx="0.5" fill="#fff" opacity="0.8" />
        <Rect x="24" y="0" width="6" height="14" rx="1.5" fill="#fff" />
      </G>
    </Svg>
  );
};

// App Icon - ultra-clean
export const AppIcon = ({ size = 512 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
      <Defs>
        <LinearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#000000" />
          <Stop offset="100%" stopColor="#000000" />
        </LinearGradient>
        <LinearGradient id="chevron" x1="0%" y1="100%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#10b981" />
          <Stop offset="100%" stopColor="#059669" />
        </LinearGradient>
      </Defs>
      
      {/* Background */}
      <Rect width="512" height="512" fill="url(#bg)" />
      
      {/* Bold upward chevron - centered */}
      <Path
        d="M256 100L420 250H360L256 160L152 250H92Z"
        fill="url(#chevron)"
      />
      
      {/* Second chevron */}
      <Path
        d="M256 180L360 270H320L256 215L192 270H152Z"
        fill="#10b981"
        opacity="0.5"
      />
      
      {/* Barbell */}
      <G transform="translate(190, 360)">
        <Rect x="0" y="0" width="24" height="56" rx="6" fill="#ffffff" />
        <Rect x="24" y="12" width="12" height="32" rx="3" fill="#ffffff" opacity="0.85" />
        <Rect x="36" y="20" width="60" height="16" rx="4" fill="#ffffff" />
        <Rect x="96" y="12" width="12" height="32" rx="3" fill="#ffffff" opacity="0.85" />
        <Rect x="108" y="0" width="24" height="56" rx="6" fill="#ffffff" />
      </G>
    </Svg>
  );
};

export default { AppLogo, AppIcon };
