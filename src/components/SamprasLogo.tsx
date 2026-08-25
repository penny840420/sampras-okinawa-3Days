import React from 'react';

interface SamprasLogoProps {
  className?: string;
}

export const SamprasLogo: React.FC<SamprasLogoProps> = ({
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <span
        style={{
          fontFamily: "'Calistoga', 'Fraunces', 'Cooper Black', serif",
          color: '#70B857',
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
        className="font-black text-base sm:text-lg tracking-tight"
      >
        Sampras
      </span>
    </div>
  );
};
