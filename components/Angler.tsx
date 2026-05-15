'use client';

import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import styles from './Angler.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as ComponentType<any>;

type Props = { castedRod: boolean };

// Outer wrapper handles centering via CSS transform.
// Inner motion.div handles the cast lean — framer-motion fully owns its own
// transform property so we keep these two responsibilities on separate nodes.
export function Angler({ castedRod }: Props) {
  return (
    <div className={styles.angler}>
      <MotionDiv
        className={styles.angler__inner}
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
    </div>
  );
}
