import React from 'react';

interface GradientAccentProps {
  className?: string;
}

const GradientAccent: React.FC<GradientAccentProps> = ({ className = '' }) => {
  return (
    <div className={['absolute inset-0 pointer-events-none', className].join(' ')}>
      <div className="absolute top-16 left-12 w-72 h-72 rounded-full bg-brand-green-300/60 mix-blend-multiply blur-3xl animate-float" />
      <div className="absolute top-32 right-16 w-80 h-80 rounded-full bg-emerald-200/60 mix-blend-multiply blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute -bottom-10 left-1/2 w-72 h-72 rounded-full bg-teal-200/60 mix-blend-multiply blur-3xl animate-float" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default GradientAccent;

