import type { Variants } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.35, ease: 'easeInOut' },
  },
};

export const sectionStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.12,
    },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
};

export const gentleSlideUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease },
  },
};

export const subtleFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.42, ease: 'easeOut' },
  },
};

export const accordionVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.32, ease: 'easeOut' },
  },
  exit: { opacity: 0, height: 0, transition: { duration: 0.25, ease: 'easeInOut' } },
};

export const barGrow: Variants = {
  hidden: { height: 0 },
  visible: (custom: number) => ({
    height: `${custom}%`,
    transition: { duration: 0.52, ease },
  }),
};

export const buttonMotion = {
  whileHover: { y: -2, scale: 1.02, transition: { type: 'spring', stiffness: 260, damping: 24 } },
  whileTap: { scale: 0.97, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};

export const btnMotion = buttonMotion;

export const cardHover = {
  whileHover: {
    y: -6,
    scale: 1.01,
    boxShadow: '0 28px 90px rgba(15, 23, 42, 0.14)',
    transition: { type: 'spring', stiffness: 240, damping: 20 },
  },
  whileTap: { scale: 0.995, transition: { type: 'spring', stiffness: 280, damping: 28 } },
};

export const interactiveMotion = {
  whileHover: { scale: 1.003, transition: { type: 'spring', stiffness: 280, damping: 26 } },
  whileFocus: { scale: 1.01, transition: { type: 'spring', stiffness: 300, damping: 26 } },
};
