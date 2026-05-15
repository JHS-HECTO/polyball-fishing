'use client';

import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import type { FishGrade, FishSpecies } from 'lib/types';
import styles from './FishSilhouette.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as ComponentType<any>;

type Props = {
  grade: FishGrade;
  species?: FishSpecies;
  direction: -1 | 0 | 1;
  flashOnHit?: boolean;
};

const SIZE_BY_GRADE: Record<FishGrade, number> = {
  trash: 12,
  normal: 16,
  rare: 19,
  big: 24,
  golden: 28,
};

export function FishSilhouette({ grade, species, direction, flashOnHit = false }: Props) {
  const size = SIZE_BY_GRADE[grade];
  const targetX = direction === 0 ? 0 : direction * 10;

  return (
    <MotionDiv
      className={styles.fish}
      data-grade={grade}
      style={{ width: `${size}rem`, height: `${size}rem` }}
      animate={{
        x: `${targetX}rem`,
        scale: flashOnHit ? [1, 0.92, 1.06, 1] : 1,
      }}
      transition={{
        x: { duration: 1.0, ease: 'easeInOut' },
        scale: { duration: 0.25 },
      }}
    >
      {species && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={species.image}
          alt={species.name}
          className={styles.fish__img}
          // Fish images drawn facing right; flip when fish moves left.
          style={{ transform: direction === -1 ? 'scaleX(-1)' : 'scaleX(1)' }}
          draggable={false}
        />
      )}
    </MotionDiv>
  );
}
