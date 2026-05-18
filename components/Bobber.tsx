'use client';

import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import styles from './Bobber.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as ComponentType<any>;

export type BobberState = 'hidden' | 'arc' | 'floating' | 'bite' | 'sunken';

type Props = {
  state: BobberState;
};

// Bobber resting position is roughly mid-lake (top: 47vh in the SCSS).
// `arc` animates from rod-tip area (offset y: -28vh, x: -6rem) down into water.
// `bite` rapidly bobs. `sunken` dives below the water + fades.
const variants = {
  hidden: { opacity: 0, x: 0, y: 0, scale: 0 },
  arc: {
    opacity: [0, 1, 1],
    x: [-72, 0],
    y: [-280, -180, -40, 8, 0],
    scale: [0.6, 1],
    transition: {
      duration: 0.7,
      times: [0, 1],
      ease: 'easeIn' as const,
    },
  },
  floating: {
    opacity: 1,
    x: 0,
    y: [0, -3, 0, 3, 0],
    scale: 1,
    transition: { y: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' as const }, opacity: { duration: 0.15 } },
  },
  bite: {
    opacity: 1,
    x: 0,
    y: [0, -10, 8, -6, 4, 0],
    scale: 1,
    transition: { duration: 0.45, repeat: Infinity, ease: 'easeInOut' as const },
  },
  sunken: {
    opacity: 0,
    x: 0,
    y: 60,
    scale: 0.8,
    transition: { duration: 0.4, ease: 'easeIn' as const },
  },
};

export function Bobber({ state }: Props) {
  if (state === 'hidden') return null;
  return (
    <MotionDiv
      className={styles.bobber}
      data-anchor="bobber"
      variants={variants}
      initial={false}
      animate={state}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/16-bobber.png" alt="" className={styles.bobber__img} draggable={false} />
    </MotionDiv>
  );
}
