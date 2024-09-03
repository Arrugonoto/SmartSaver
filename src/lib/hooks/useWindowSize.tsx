'use client';
import { useState, useEffect } from 'react';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({ width: undefined, height: undefined });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowSize({
          width: window?.innerWidth,
          height: window?.innerHeight,
        });
      };

      if (window) {
        window?.addEventListener('resize', handleResize);
      }

      return () => {
        window?.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return { width: windowSize.width, height: windowSize.height };
};
