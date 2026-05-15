'use client';

import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import styles from './GoldenRewardModal.module.scss';

const MotionDiv = motion.div as ComponentType<any>;

type Props = {
  count: number;
  onClose: () => void;
};

export function GoldenRewardModal({ count, onClose }: Props) {
  return (
    <MotionDiv
      className={styles.reward}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <MotionDiv
        className={styles.reward__card}
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 18 }}
      >
        <MotionDiv
          className={styles.reward__ticket}
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        >
          🎫
        </MotionDiv>
        <h3 className={styles.reward__title}>응모권 {count}장 획득!</h3>
        <p className={styles.reward__subtitle}>황금물고기가 응모권을 물고 있었어요</p>
        <button className={styles.reward__cta} onClick={onClose}>
          좋아요!
        </button>
      </MotionDiv>
    </MotionDiv>
  );
}
