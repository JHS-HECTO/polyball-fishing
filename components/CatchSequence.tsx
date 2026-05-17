'use client';

import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import { useEffect } from 'react';
import type { FishGrade, FishSpecies } from 'lib/types';
import { vibrate } from 'lib/haptics';
import styles from './CatchSequence.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as ComponentType<any>;

type Props = {
  grade: FishGrade;
  species: FishSpecies;
  onComplete: () => void;
};

const TOTAL_MS = 1700;

// Plays after a successful catch: water splash at the bobber spot, fish leaps
// out of water with a small arc, then signals the play page to swap in the
// result modal.
export function CatchSequence({ grade, species, onComplete }: Props) {
  useEffect(() => {
    vibrate(grade === 'golden' ? 'goldenCatch' : 'fishCaught');
    const t = setTimeout(onComplete, TOTAL_MS);
    return () => clearTimeout(t);
  }, [grade, onComplete]);

  const isGolden = grade === 'golden';

  return (
    <div className={styles.catch}>
      {/* Splash rings expanding outward at the lake surface */}
      <MotionDiv
        className={styles.catch__ring}
        initial={{ scale: 0.2, opacity: 0.9 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
      />
      <MotionDiv
        className={styles.catch__ring}
        initial={{ scale: 0.2, opacity: 0.7 }}
        animate={{ scale: 3.2, opacity: 0 }}
        transition={{ duration: 0.85, ease: 'easeOut', delay: 0.12 }}
      />

      {/* Pre-baked splash sprite */}
      <MotionDiv
        className={styles.catch__splash}
        initial={{ scale: 0.4, opacity: 0, y: 0 }}
        animate={{ scale: [0.6, 1.2, 0.9], opacity: [1, 1, 0], y: [-10, -40, -10] }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/17-splash.png" alt="" draggable={false} />
      </MotionDiv>

      {/* Fish leaps out of water — small arc + rotation, then descends */}
      <MotionDiv
        className={styles.catch__fish}
        data-grade={grade}
        initial={{ y: 80, opacity: 0, scale: 0.6, rotate: -20 }}
        animate={{
          y: [80, -120, -60, -20],
          opacity: [0, 1, 1, 1],
          scale: [0.6, 1, 1, 1],
          rotate: [-20, -8, 12, 28],
        }}
        transition={{ duration: 1.4, ease: 'easeOut', times: [0, 0.35, 0.7, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={species.image} alt={species.name} draggable={false} />
      </MotionDiv>

      {/* Sparkle overlay for golden catches */}
      {isGolden && (
        <MotionDiv
          className={styles.catch__sparkle}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.4, times: [0, 0.4, 0.8, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/18-sparkle.png" alt="" draggable={false} />
        </MotionDiv>
      )}
    </div>
  );
}
