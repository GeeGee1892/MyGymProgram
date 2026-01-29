import React from 'react';
import Svg, { Path, Rect, G, Defs, LinearGradient, Stop, Polygon } from 'react-native-svg';

// Ultra-professional app logo - bold, geometric, memorable
export const AppLogo = ({ size = 120 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Defs>
        <LinearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#10b981" />
          <Stop offset="100%" stopColor="#059669" />
        </LinearGradient>
      </Defs>
      
      {/* Bold geometric arrow - ultra-clean */}
      <Polygon
        points="60,20 100,50 85,50 85,80 35,80 35,50 20,50"
        fill="url(#mainGradient)"
      />
      
      {/* Barbell integrated into design - bold and geometric */}
      <G>
        {/* Left weight */}
        <Rect x="30" y="88" width="10" height="20" rx="2" fill="#fff" />
        <Rect x="40" y="92" width="5" height="12" rx="1" fill="#fff" opacity="0.85" />
        
        {/* Bar */}
        <Rect x="45" y="96" width="30" height="4" rx="1" fill="#fff" />
        
        {/* Right weight */}
        <Rect x="75" y="92" width="5" height="12" rx="1" fill="#fff" opacity="0.85" />
        <Rect x="80" y="88" width="10" height="20" rx="2" fill="#fff" />
      </G>
    </Svg>
  );
};

// App icon for stores - 512×512 ultra-crisp
export const AppIcon = ({ size = 512 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
      <Defs>
        <LinearGradient id="iconBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#000000" />
          <Stop offset="100%" stopColor="#000000" />
        </LinearGradient>
        <LinearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#10b981" />
          <Stop offset="100%" stopColor="#059669" />
        </LinearGradient>
      </Defs>
      
      {/* Pure black background */}
      <Rect width="512" height="512" fill="url(#iconBg)" />
      
      {/* Bold arrow - centered and large */}
      <Polygon
        points="256,80 420,200 360,200 360,340 152,340 152,200 92,200"
        fill="url(#iconGradient)"
      />
      
      {/* Bold barbell */}
      <G>
        {/* Left weight plate */}
        <Rect x="130" y="370" width="40" height="80" rx="8" fill="#ffffff" />
        <Rect x="170" y="385" width="20" height="50" rx="4" fill="#ffffff" opacity="0.9" />
        
        {/* Bar - thick and prominent */}
        <Rect x="190" y="405" width="132" height="16" rx="4" fill="#ffffff" />
        
        {/* Right weight plate */}
        <Rect x="322" y="385" width="20" height="50" rx="4" fill="#ffffff" opacity="0.9" />
        <Rect x="342" y="370" width="40" height="80" rx="8" fill="#ffffff" />
      </G>
    </Svg>
  );
};

export default { AppLogo, AppIcon };
