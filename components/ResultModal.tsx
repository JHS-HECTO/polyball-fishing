'use client';

import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import { useEffect, useMemo } from 'react';
import type { FishGrade, FishSpecies } from 'lib/types';
import { gradeConfig } from 'lib/fish';
import { vibrate } from 'lib/haptics';
import messages from 'data/messages.json';
import styles from './ResultModal.module.scss';

// motion.div as ComponentType<any> avoids the React 19 + framer-motion 11.5 type regression
const MotionDiv = motion.div as ComponentType<any>;

type Outcome = 'caught' | 'escaped' | 'broken';

type Props = {
  outcome: Outcome;
  grade: FishGrade;
  species?: FishSpecies;
  onClose: () => void;
};

type Messages = {
  caught: Record<FishGrade, string[]>;
  escaped: string[];
  broken: string[];
};

function pickMessage(outcome: Outcome, grade: FishGrade): string {
  const m = messages as Messages;
  if (outcome === 'caught') {
    const list = m.caught[grade];
    const idx = Math.floor(Math.random() * list.length);
    return list[idx] ?? '';
  }
  const list = m[outcome];
  const idx = Math.floor(Math.random() * list.length);
  return list[idx] ?? '';
}

export function ResultModal({ outcome, grade, species, onClose }: Props) {
  const cfg = gradeConfig(grade);
  const points = outcome === 'caught' ? cfg.score : 0;
  const msg = useMemo(() => pickMessage(outcome, grade), [outcome, grade]);

  useEffect(() => {
    if (outcome === 'caught' && grade === 'golden') vibrate('goldenCatch');
  }, [outcome, grade]);

  return (
    <MotionDiv
      className={styles.result}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <MotionDiv
        className={styles.result__card}
        data-outcome={outcome}
        initial={{ y: 40, scale: 0.9 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      >
        <div className={styles.result__emoji}>
          {outcome === 'caught' ? (grade === 'golden' ? '🪙' : '🎣') : '💧'}
        </div>
        <h3 className={styles.result__title}>{msg}</h3>
        {outcome === 'caught' && species && (
          <p className={styles.result__species}>{species.name}</p>
        )}
        {outcome === 'caught' && (
          <p className={styles.result__points}>+{points.toLocaleString('ko-KR')}점</p>
        )}
        <button className={styles.result__cta} onClick={onClose}>
          확인
        </button>
      </MotionDiv>
    </MotionDiv>
  );
}
