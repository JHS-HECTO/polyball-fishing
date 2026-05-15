'use client';

import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import type { FishGrade } from 'lib/types';
import styles from './FishSilhouette.module.scss';

type Props = {
  grade: FishGrade;
  direction: -1 | 0 | 1;
  flashOnHit?: boolean;
};

const SIZE_BY_GRADE: Record<FishGrade, number> = {
  trash: 6,
  normal: 8,
  rare: 10,
  big: 14,
  golden: 16,
};

// framer-motion 11.5 ships incomplete HTML element typings against React 19's
// updated DetailedHTMLFactory shape — motion.div appears to drop className/
// style/data-*. Re-type the wrapper so it accepts standard div props plus
// framer-motion's animation props.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as ComponentType<any>;

export function FishSilhouette({ grade, direction, flashOnHit = false }: Props) {
  const size = SIZE_BY_GRADE[grade];
  const targetX = direction === 0 ? 0 : direction * 12;

  return (
    <MotionDiv
      className={styles.fish}
      data-grade={grade}
      style={{ width: `${size}rem`, height: `${size * 0.6}rem` }}
      animate={{
        x: `${targetX}rem`,
        scale: flashOnHit ? [1, 0.95, 1.05, 1] : 1,
      }}
      transition={{
        x: { duration: 1.2, ease: 'easeInOut' },
        scale: { duration: 0.25 },
      }}
    >
      <div className={styles.fish__body} />
      <div className={styles.fish__tail} />
    </MotionDiv>
  );
}
