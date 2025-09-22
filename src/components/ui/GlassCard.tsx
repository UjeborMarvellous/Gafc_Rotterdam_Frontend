import React from 'react';

interface GlassCardProps {
  className?: string;
  children: React.ReactNode;
}

const GlassCard: React.FC<GlassCardProps> = ({ className = '', children }) => {
  return (
    <div
      className={
        'rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-glass ' +
        'transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-xl ' +
        className
      }
    >
      {children}
    </div>
  );
};

export default GlassCard;

