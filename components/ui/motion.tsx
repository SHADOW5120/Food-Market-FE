'use client';

import type { Variants, Transition } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export const sectionStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const subtleFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export const gentleSlideUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const entranceTransition: Transition = {
  type: 'spring',
  stiffness: 240,
  damping: 26,
};

export const btnMotion = {
  whileHover: { y: -2, scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: { type: 'spring', stiffness: 260, damping: 24 },
};

export const cardHover = {
  whileHover: {
    y: -6,
    scale: 1.01,
    boxShadow: '0 28px 90px rgba(15, 23, 42, 0.14)',
  },
  whileTap: { scale: 0.995 },
};

// Custom hook to prevent animation duplication
export function useAnimationGuard() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerAnimation = () => {
    if (!hasAnimated) {
      setHasAnimated(true);
      // Reset after a delay to allow re-animation if needed
      timeoutRef.current = setTimeout(() => setHasAnimated(false), 1000);
    }
    return !hasAnimated;
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { hasAnimated, triggerAnimation };
}
