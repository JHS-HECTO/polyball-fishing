'use client';

import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import styles from './GoldenRewardModal.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as ComponentType<any>;

type Mode = 'ad-prompt' | 'granted';

type Props = {
  /**
   * 'ad-prompt' — golden caught, ask user to watch an ad to claim the ticket.
   * 'granted'   — ticket has already been granted; show celebration + close.
   */
  mode: Mode;
  count?: number;        // tickets granted (granted mode)
  onWatchAd?: () => void; // ad-prompt mode
  onDecline?: () => void; // ad-prompt mode — skip without ticket
  onClose?: () => void;   // granted mode
};

export function GoldenRewardModal({ mode, count = 1, onWatchAd, onDecline, onClose }: Props) {
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/15-ticket.png" alt="응모권" className={styles.reward__ticketImg} draggable={false} />
        </MotionDiv>

        {mode === 'ad-prompt' ? (
          <>
            <h3 className={styles.reward__title}>황금물고기를 잡았다!</h3>
            <p className={styles.reward__subtitle}>
              광고를 보면 황금물고기가 가져온<br /><b>응모권 1장</b>을 받을 수 있어요
            </p>
            <button className={styles.reward__cta} onClick={onWatchAd}>
              🎬 광고 보고 응모권 받기
            </button>
            <button className={styles.reward__skip} onClick={onDecline}>
              다음에 받기
            </button>
          </>
        ) : (
          <>
            <h3 className={styles.reward__title}>응모권 {count}장 획득!</h3>
            <p className={styles.reward__subtitle}>황금물고기가 응모권을 물고 있었어요</p>
            <button className={styles.reward__cta} onClick={onClose}>
              좋아요!
            </button>
          </>
        )}
      </MotionDiv>
    </MotionDiv>
  );
}
