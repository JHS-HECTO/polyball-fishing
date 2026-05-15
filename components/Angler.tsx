'use client';

import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import styles from './Angler.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as ComponentType<any>;

type Props = { castedRod: boolean };

// Single-image back-view angler. The whole character image rocks slightly
// when casting (subtle body lean) so the rod arc isn't a separate sprite.
export function Angler({ castedRod }: Props) {
  return (
    <MotionDiv
      className={styles.angler}
      animate={{
        rotate: castedRod ? -4 : 0,
        y: castedRod ? -2 : 0,
      }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/02-angler.png"
        alt=""
        className={styles.angler__img}
        draggable={false}
      />
    </MotionDiv>
  );
}
