'use client';

import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import styles from './TicketProgress.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as ComponentType<any>;

type Props = {
  current: number;           // current points in the bar
  target: number;            // target points to fill the bar
  ticketsClaimed: number;    // tickets claimed today
  ticketsMax: number;        // daily cap
  onClaim: () => void;
  needsAd: boolean;
  exhausted: boolean;
  compact?: boolean;
};

function formatPts(n: number): string {
  return Math.floor(n).toLocaleString('ko-KR');
}

export function TicketProgress({
  current,
  target,
  ticketsClaimed,
  ticketsMax,
  onClaim,
  needsAd,
  exhausted,
  compact = false,
}: Props) {
  const clampedCurrent = Math.max(0, Math.min(target, current));
  const pct = target > 0 ? clampedCurrent / target : 0;
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
            ? '오늘 보상 다 받음 — 황금물고기 노려라!'
            : `${formatPts(clampedCurrent)} / ${formatPts(target)}`}
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
          : canClaim && needsAd
            ? '광고 보고 응모권 받기'
            : '응모권 받기'}
      </button>
    </div>
  );
}
