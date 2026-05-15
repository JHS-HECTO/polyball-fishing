'use client';

import { motion } from 'framer-motion';
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

export function FishSilhouette({ grade, direction, flashOnHit = false }: Props) {
  const size = SIZE_BY_GRADE[grade];
  const targetX = direction === 0 ? 0 : direction * 12;

  return (
    <motion.div
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
    </motion.div>
  );
}
