'use client';

import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import styles from './TicketProgress.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as ComponentType<any>;

type Props = {
  progress: number;          // 0..1 (current / target)
  ticketsClaimed: number;    // tickets claimed today
  ticketsMax: number;        // daily cap
  /** Called when the player taps the claim button while progress is full. */
  onClaim: () => void;
  /** When true, the next claim will require watching an ad. */
  needsAd: boolean;
  /** When true, no more tickets are available today. */
  exhausted: boolean;
  /** Compact rendering — used inside the play HUD. */
  compact?: boolean;
};

export function TicketProgress({
  progress,
  ticketsClaimed,
  ticketsMax,
  onClaim,
  needsAd,
  exhausted,
  compact = false,
}: Props) {
  const pct = Math.max(0, Math.min(1, progress));
  const full = pct >= 1;
  const canClaim = full && !exhausted;

  return (
    <div className={styles.wrap} data-compact={compact ? 'yes' : 'no'}>
      <div className={styles.head}>
        <span className={styles.headLabel}>오늘의 응모권</span>
        <span className={styles.headCount}>
          <strong>{ticketsClaimed}</strong> / {ticketsMax}
        </span>
      </div>

      <div className={styles.bar}>
        <MotionDiv
          className={styles.barFill}
          data-full={full ? 'yes' : 'no'}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
        <span className={styles.barText}>
          {exhausted
            ? '오늘 받을 응모권 다 받음 — 황금물고기 노려라!'
            : full
              ? '게이지 가득 — 응모권 받기!'
              : `${Math.round(pct * 100)}%`}
        </span>
      </div>

      <button
        type="button"
        className={styles.claim}
        data-state={
          exhausted ? 'exhausted' : !canClaim ? 'locked' : needsAd ? 'ad' : 'free'
        }
        onClick={canClaim ? onClaim : undefined}
        disabled={!canClaim}
      >
        {exhausted
          ? '오늘 보상 마감'
          : !canClaim
            ? '게이지를 채우세요'
            : needsAd
              ? '🎬 광고 보고 응모권 받기'
              : '🎫 응모권 받기'}
      </button>
    </div>
  );
}
