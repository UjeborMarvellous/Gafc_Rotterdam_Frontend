import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

export const useLazyLoading = (threshold: number = 0.1) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (inView && !isLoaded) {
      setIsLoaded(true);
    }
  }, [inView, isLoaded]);

  return { ref, isLoaded, inView };
};

export const useImageLazyLoading = (src: string, threshold: number = 0.1) => {
  const { ref, isLoaded } = useLazyLoading(threshold);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isLoaded && src && !imageSrc) {
      setIsLoading(true);
      setHasError(false);
      
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoading(false);
      };
      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };
      img.src = src;
    }
  }, [isLoaded, src, imageSrc]);

  return {
    ref,
    imageSrc,
    isLoading,
    hasError,
    isLoaded,
  };
};
