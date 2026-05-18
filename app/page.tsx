'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import { ROUTES } from 'lib/routes';
import styles from './page.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as ComponentType<any>;

export default function TitlePage() {
  return (
    <main className={styles.title}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/01-title-bg.png" alt="" className={styles.title__bg} draggable={false} />

      {/* Drifting golden fish with sparkles — visual hook for the raffle ticket promise */}
      <MotionDiv
        className={styles.title__hero}
        animate={{
          y: [0, -10, 0, 10, 0],
          x: [0, 8, 0, -8, 0],
          rotate: [-3, 3, -3],
        }}
        transition={{
          y:      { duration: 4.0, repeat: Infinity, ease: 'easeInOut' },
          x:      { duration: 5.2, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/14-golden.png" alt="" className={styles.title__heroImg} draggable={false} />
        <div className={styles.title__heroGlow} aria-hidden />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/18-sparkle.png" alt="" className={styles.title__heroSparkle} draggable={false} />
      </MotionDiv>

      {/* Floating ticket icon nearby to reinforce the reward concept */}
      <MotionDiv
        className={styles.title__ticket}
        animate={{
          y: [0, -6, 0],
          rotate: [-8, 6, -8],
        }}
        transition={{
          y:      { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 4.4, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/15-ticket.png" alt="" draggable={false} />
      </MotionDiv>

      <div className={styles.title__contentFade} aria-hidden />

      <div className={styles.title__content}>
        <h1 className={styles.title__heading}>응모권 낚시하기</h1>
        <p className={styles.title__subtitle}>황금물고기 잡으면 응모권 1장!</p>

        <div className={styles.title__actions}>
          <Link href={ROUTES.PLAY} className={styles.title__cta}>
            <span className={styles.title__ctaText}>🎣 시작하기</span>
            <span className={styles.title__ctaGlow} aria-hidden />
          </Link>
        </div>
      </div>
    </main>
  );
}
