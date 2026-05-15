'use client';

import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import styles from './Splash.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as ComponentType<any>;

type Props = {
  visible: boolean;
};

// Quick water-splash effect at the bobber landing position. Renders the
// pre-baked splash sprite + an expanding ring ripple under it.
export function Splash({ visible }: Props) {
  if (!visible) return null;
  return (
    <div className={styles.splash}>
      <MotionDiv
        className={styles.splash__ring}
        initial={{ scale: 0.2, opacity: 0.9 }}
        animate={{ scale: 2.4, opacity: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
      <MotionDiv
        className={styles.splash__ring}
        initial={{ scale: 0.2, opacity: 0.7 }}
        animate={{ scale: 1.8, opacity: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut', delay: 0.08 }}
      />
      <MotionDiv
        className={styles.splash__img}
        initial={{ scale: 0.4, opacity: 0, y: 0 }}
        animate={{ scale: [0.6, 1, 0.85], opacity: [1, 1, 0], y: [-8, -22, -4] }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/17-splash.png" alt="" draggable={false} />
      </MotionDiv>
    </div>
  );
}
