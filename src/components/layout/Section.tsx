import React from 'react';
import { cn } from '../../utils';

type SectionVariant = 'default' | 'subtle' | 'light' | 'contrast';
type SectionPadding = 'sm' | 'md' | 'lg';
type SectionContainerMode = 'standard' | 'full';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  variant?: SectionVariant;
  padding?: SectionPadding;
  containerClassName?: string;
  containerMode?: SectionContainerMode;
}

const paddingMap: Record<SectionPadding, string> = {
  sm: 'py-12 md:py-14',
  md: 'py-16 md:py-20',
  lg: 'py-20 md:py-0',
};

const variantMap: Record<SectionVariant, string> = {
  default: 'bg-[#e5e5e5] text-slate-900',
  subtle: 'bg-[#f3f3f3] text-slate-900',
  light: 'bg-white text-slate-900',
  contrast: 'bg-slate-900 text-white',
};

const overlayMap: Record<SectionVariant, string> = {
  default: 'bg-[radial-gradient(circle,_rgba(0,0,0,0.08)_0%,_transparent_55%)]',
  subtle: 'bg-[radial-gradient(circle,_rgba(0,0,0,0.06)_0%,_transparent_60%)]',
  light: 'bg-[radial-gradient(circle,_rgba(15,23,42,0.05)_0%,_transparent_60%)]',
  contrast: 'bg-[radial-gradient(circle,_rgba(148,163,184,0.25)_0%,_transparent_55%)]',
};

export const Section: React.FC<SectionProps> = ({
  id,
  variant = 'default',
  padding = 'lg',
  className,
  containerClassName,
  containerMode = 'standard',
  children,
  ...props
}) => {
  const containerBase = containerMode === 'full'
    ? 'w-full px-0'
    : 'mx-auto max-w-[80%] px-4 sm:px-6 lg:px-8';

  return (
    <section
      id={id}
      className={cn('relative', paddingMap[padding], variantMap[variant], className + ' -mt-10')}
      {...props}
    >
      <div className={cn('pointer-events-none absolute inset-0 opacity-1', overlayMap[variant])} aria-hidden />
      <div className={cn('relative z-10', containerBase, containerClassName)}>
        {children}
      </div>
    </section>
  );
};

type SectionHeaderAlign = 'left' | 'center';
type SectionHeaderTone = 'light' | 'dark';

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  align?: SectionHeaderAlign;
  tone?: SectionHeaderTone;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'dark',
  className,
  children,
  ...props
}) => {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left';
  const isLight = tone === 'light';

  const eyebrowClasses = isLight
    ? 'border-slate-300 bg-slate-200 text-slate-700'
    : 'border-slate-300/50 bg-white/70 text-slate-700';

  const titleClasses = 'text-slate-900';
  const descriptionClasses = 'text-slate-700';

  return (
    <div
      className={cn('max-w-3xl space-y-4', alignment, className)}
      {...props}
    >
      {eyebrow && (
        <span className={cn('inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-medium uppercase tracking-[0.3em]', eyebrowClasses)}>
          {eyebrow}
        </span>
      )}
      <div className="space-y-4">
        <h2 className={cn('text-3xl font-semibold md:text-4xl', titleClasses)}>
          {title}
        </h2>
        {description && (
          <p className={cn('text-base md:text-lg', descriptionClasses)}>
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
};

// Updated: exported helpers unify spacing and typography across public pages
export const SectionContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('mt-12 grid gap-8', className)}
      {...props}
    >
      {children}
    </div>
  );
};
