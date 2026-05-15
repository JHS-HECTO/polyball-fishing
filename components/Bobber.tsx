'use client';

import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import styles from './Bobber.module.scss';

const MotionDiv = motion.div as ComponentType<any>;

type Props = {
  state: 'hidden' | 'floating' | 'bite' | 'sunken';
};

export function Bobber({ state }: Props) {
  if (state === 'hidden') return null;
  const animateProps =
    state === 'bite'
      ? { y: [0, -6, 6, 0], opacity: 1 }
      : state === 'sunken'
        ? { y: 40, opacity: 0 }
        : { y: 0, opacity: 1 };
  return (
    <MotionDiv
      className={styles.bobber}
      animate={animateProps}
      transition={{ duration: state === 'bite' ? 0.4 : 0.6, repeat: state === 'bite' ? Infinity : 0 }}
    />
  );
}
