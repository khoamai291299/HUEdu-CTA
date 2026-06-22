import React from 'react';
import Svg, {Circle, Line, Path, G} from 'react-native-svg';

interface StickFigureProps {
  faceColor: string;
  pose?: 'stand' | 'point';
  size?: number;
}

export const StickFigure: React.FC<StickFigureProps> = ({faceColor, pose = 'stand', size = 120}) => {
  const scale = size / 120;
  const h = 160 * scale;

  return (
    <Svg width={size} height={h} viewBox="0 0 120 160">
      {/* Body */}
      <Line x1="60" y1="75" x2="60" y2="120" stroke="#000" strokeWidth="4.5" strokeLinecap="round" />
      
      {/* Arms */}
      {pose === 'stand' ? (
        <G>
          <Line x1="60" y1="85" x2="35" y2="110" stroke="#000" strokeWidth="4.5" strokeLinecap="round" />
          {/* Bent arm similar to the image */}
          <Path d="M 60 85 L 85 110 L 95 95" stroke="#000" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeJoin="round" />
        </G>
      ) : (
        <G>
          <Line x1="60" y1="85" x2="35" y2="110" stroke="#000" strokeWidth="4.5" strokeLinecap="round" />
          {/* Pointing arm */}
          <Line x1="60" y1="85" x2="105" y2="60" stroke="#000" strokeWidth="4.5" strokeLinecap="round" />
        </G>
      )}

      {/* Legs */}
      <Line x1="60" y1="120" x2="40" y2="160" stroke="#000" strokeWidth="4.5" strokeLinecap="round" />
      <Line x1="60" y1="120" x2="80" y2="160" stroke="#000" strokeWidth="4.5" strokeLinecap="round" />

      {/* Head */}
      <Circle cx="60" cy="45" r="32" fill={faceColor} stroke="#000" strokeWidth="3.5" />
      
      {/* Purple Bucket Hat */}
      <G rotation="-12" origin="60, 30">
        <Path d="M 38 18 L 82 18 L 92 35 L 28 35 Z" fill="#E6E6FA" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
        <Path d="M 15 35 Q 60 25 105 35 Q 115 42 105 45 Q 60 35 15 45 Q 5 42 15 35 Z" fill="#D8BFD8" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
      </G>
      
      {/* Eyes */}
      <Circle cx="50" cy="42" r="3.5" fill="#000" />
      <Circle cx="72" cy="42" r="3.5" fill="#000" />
      
      {/* Smile */}
      <Path d="M 52 54 Q 61 62 70 54" stroke="#000" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </Svg>
  );
};
