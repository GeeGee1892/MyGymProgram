import React from 'react';
import Svg, { Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';

// Main app logo - clean upward trend with barbell
export const AppLogo = ({ size = 120, animated = false }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Defs>
        <LinearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#10b981" stopOpacity="1" />
          <Stop offset="100%" stopColor="#059669" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      
      {/* Background circle */}
      <G opacity="0.1">
        <Path
          d="M60 10C32.386 10 10 32.386 10 60s22.386 50 50 50 50-22.386 50-50S87.614 10 60 10z"
          fill="#10b981"
        />
      </G>
      
      {/* Upward trend line - clean and crisp */}
      <Path
        d="M20 80L40 60L55 50L70 35L95 25"
        stroke="url(#trendGradient)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Arrow tip */}
      <Path
        d="M95 25L88 30L90 22L95 25z"
        fill="#10b981"
      />
      
      {/* Barbell underneath - simplified */}
      <G transform="translate(30, 85)">
        {/* Left weight */}
        <Path
          d="M0 0h8v12H0z"
          fill="#fff"
          opacity="0.9"
        />
        <Path
          d="M8 2h4v8H8z"
          fill="#fff"
          opacity="0.7"
        />
        
        {/* Bar */}
        <Path
          d="M12 5h36v2H12z"
          fill="#fff"
          opacity="0.9"
        />
        
        {/* Right weight */}
        <Path
          d="M48 2h4v8h-4z"
          fill="#fff"
          opacity="0.7"
        />
        <Path
          d="M52 0h8v12h-8z"
          fill="#fff"
          opacity="0.9"
        />
      </G>
      
      {/* Data points on trend line */}
      <G>
        <Path d="M40 60a4 4 0 100-8 4 4 0 000 8z" fill="#10b981" />
        <Path d="M55 50a4 4 0 100-8 4 4 0 000 8z" fill="#10b981" />
        <Path d="M70 35a4 4 0 100-8 4 4 0 000 8z" fill="#10b981" />
        <Path d="M95 25a4 4 0 100-8 4 4 0 000 8z" fill="#10b981" />
      </G>
    </Svg>
  );
};

// Simplified icon version for app icon
export const AppIcon = ({ size = 512 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
      <Defs>
        <LinearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#000000" stopOpacity="1" />
          <Stop offset="100%" stopColor="#0d1117" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="trendGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#10b981" stopOpacity="1" />
          <Stop offset="100%" stopColor="#059669" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      
      {/* Background */}
      <Path
        d="M0 0h512v512H0z"
        fill="url(#bgGradient)"
      />
      
      {/* Trend line - large and centered */}
      <Path
        d="M100 380L180 300L256 240L340 160L430 110"
        stroke="url(#trendGradient2)"
        strokeWidth="24"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Arrow */}
      <Path
        d="M430 110L410 125L420 95L430 110z"
        fill="#10b981"
      />
      
      {/* Barbell */}
      <G transform="translate(120, 400)">
        {/* Left weight */}
        <Path d="M0 0h32v48H0z" fill="#ffffff" opacity="0.95" />
        <Path d="M32 8h16v32H32z" fill="#ffffff" opacity="0.75" />
        
        {/* Bar */}
        <Path d="M48 20h176v8H48z" fill="#ffffff" opacity="0.95" />
        
        {/* Right weight */}
        <Path d="M224 8h16v32h-16z" fill="#ffffff" opacity="0.75" />
        <Path d="M240 0h32v48h-32z" fill="#ffffff" opacity="0.95" />
      </G>
      
      {/* Data points */}
      <Path d="M180 300a16 16 0 100-32 16 16 0 000 32z" fill="#10b981" />
      <Path d="M256 240a16 16 0 100-32 16 16 0 000 32z" fill="#10b981" />
      <Path d="M340 160a16 16 0 100-32 16 16 0 000 32z" fill="#10b981" />
      <Path d="M430 110a16 16 0 100-32 16 16 0 000 32z" fill="#10b981" />
    </Svg>
  );
};

export default { AppLogo, AppIcon };
