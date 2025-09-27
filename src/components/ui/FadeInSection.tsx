import React from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '../../utils';

type FadeDirection = 'up' | 'down' | 'left' | 'right';

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: FadeDirection;
}

const DIRECTION_MAP: Record<FadeDirection, string> = {
  up: 'translate-y-6',
  down: '-translate-y-6',
  left: 'translate-x-6',
  right: '-translate-x-6',
};

const FadeInSection: React.FC<FadeInSectionProps> = ({
  children,
  className,
  delay = 0,
  direction = 'up',
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transform transition duration-700 ease-out will-change-transform',
        inView ? 'translate-x-0 translate-y-0 opacity-100' : `${DIRECTION_MAP[direction]} opacity-0`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default FadeInSection;
