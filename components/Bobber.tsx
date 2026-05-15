'use client';

import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import styles from './Bobber.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as ComponentType<any>;

type Props = {
  state: 'hidden' | 'floating' | 'bite' | 'sunken';
};

export function Bobber({ state }: Props) {
  if (state === 'hidden') return null;
  const animateProps =
    state === 'bite'
      ? { y: [0, -8, 8, 0], opacity: 1 }
      : state === 'sunken'
        ? { y: 48, opacity: 0 }
        : { y: 0, opacity: 1 };
  return (
    <MotionDiv
      className={styles.bobber}
      animate={animateProps}
      transition={{ duration: state === 'bite' ? 0.35 : 0.6, repeat: state === 'bite' ? Infinity : 0 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/16-bobber.png" alt="" className={styles.bobber__img} draggable={false} />
    </MotionDiv>
  );
}
