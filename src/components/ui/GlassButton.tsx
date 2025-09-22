import React from 'react';

type Variant = 'primary' | 'outline';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  className?: string;
}

export const GlassButton: React.FC<GlassButtonProps> = ({ variant = 'primary', className = '', ...props }) => {
  const base = 'inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold transition-all duration-300 focus:outline-none focus:ring-4';
  const styles =
    variant === 'primary'
      ? 'bg-brand-green-600 text-white hover:bg-brand-green-700 focus:ring-brand-green-600/30 shadow-soft'
      : 'bg-white/10 text-slate-900 border border-white/20 backdrop-blur-md hover:bg-white/20 focus:ring-black/5';
  return <button className={[base, styles, className].join(' ')} {...props} />;
};

export default GlassButton;

