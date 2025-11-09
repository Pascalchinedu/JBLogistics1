import React from 'react';

interface CurvyDividerProps {
  color?: string;
  position?: 'top' | 'bottom';
  className?: string;
  variant?: 'default' | 'brown' | 'blue';
}

const CurvyDivider: React.FC<CurvyDividerProps> = ({ 
  color = 'white', 
  position = 'bottom',
  className = '',
  variant = 'default'
}) => {
  let dividerColor = color;
  
  if (variant === 'brown') {
    dividerColor = '#92400e';
  } else if (variant === 'blue') {
    dividerColor = '#1e3a8a';
  }

  // Create smooth Glovo-style wave SVG
  const GlovoWaveSVG = () => (
    <svg
      className="w-full h-16 md:h-20"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={position === 'top' 
          ? "M0,0 C300,80 600,20 900,60 C1050,80 1150,40 1200,60 L1200,0 Z"
          : "M0,60 C150,20 300,80 600,40 C900,0 1050,80 1200,60 L1200,120 L0,120 Z"
        }
        fill={dividerColor}
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }}
      />
    </svg>
  );

  return (
    <div className={`relative ${className}`} style={{ marginTop: '-1px', marginBottom: '-1px' }}>
      <GlovoWaveSVG />
    </div>
  );
};

export default CurvyDivider;