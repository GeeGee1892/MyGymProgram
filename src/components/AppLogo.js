import React from 'react';
import Svg, { Path, Rect, G, Defs, LinearGradient, Stop, Polygon } from 'react-native-svg';

// Professional app logo - bold, geometric, memorable
// Design philosophy: Clean upward momentum + strength
export const AppLogo = ({ size = 120 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Defs>
        <LinearGradient id="mainGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#10b981" />
          <Stop offset="100%" stopColor="#059669" />
        </LinearGradient>
      </Defs>
      
      {/* Bold upward arrow - geometric and clean */}
      <Path
        d="M60 20L95 52L82 52L82 75L38 75L38 52L25 52Z"
        fill="url(#mainGrad)"
      />
      
      {/* Barbell - integrated seamlessly */}
      <G transform="translate(42, 82)">
        {/* Left weight */}
        <Rect x="0" y="0" width="8" height="18" rx="2" fill="#fff" />
        <Rect x="8" y="4" width="4" height="10" rx="1" fill="#fff" opacity="0.85" />
        
        {/* Bar - thick and prominent */}
        <Rect x="12" y="7" width="12" height="4" rx="1" fill="#fff" />
        
        {/* Right weight */}
        <Rect x="24" y="4" width="4" height="10" rx="1" fill="#fff" opacity="0.85" />
        <Rect x="28" y="0" width="8" height="18" rx="2" fill="#fff" />
      </G>
    </Svg>
  );
};

// App Icon for stores - 512×512 production quality
export const AppIcon = ({ size = 512 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
      <Defs>
        <LinearGradient id="iconGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#10b981" />
          <Stop offset="100%" stopColor="#059669" />
        </LinearGradient>
      </Defs>
      
      {/* Pure black background */}
      <Rect width="512" height="512" fill="#000000" />
      
      {/* Bold upward arrow - centered and large */}
      <Path
        d="M256 85L400 220L348 220L348 320L164 320L164 220L112 220Z"
        fill="url(#iconGrad)"
      />
      
      {/* Bold barbell */}
      <G transform="translate(180, 350)">
        {/* Left weight plate */}
        <Rect x="0" y="0" width="32" height="72" rx="8" fill="#ffffff" />
        <Rect x="32" y="16" width="16" height="40" rx="4" fill="#ffffff" opacity="0.9" />
        
        {/* Bar - thick and centered */}
        <Rect x="48" y="28" width="56" height="16" rx="4" fill="#ffffff" />
        
        {/* Right weight plate */}
        <Rect x="104" y="16" width="16" height="40" rx="4" fill="#ffffff" opacity="0.9" />
        <Rect x="120" y="0" width="32" height="72" rx="8" fill="#ffffff" />
      </G>
    </Svg>
  );
};

export default { AppLogo, AppIcon };
