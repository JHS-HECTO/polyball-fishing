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
      <div className={styles.title__atmosphere} aria-hidden />

      {/* Top reward badge — communicates the prize up front */}
      <div className={styles.title__rewardBadge}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/15-ticket.png" alt="" className={styles.title__rewardBadgeIcon} draggable={false} />
        <div className={styles.title__rewardBadgeText}>
          <span className={styles.title__rewardBadgeLabel}>오늘의 보상</span>
          <span className={styles.title__rewardBadgeValue}>응모권 최대 3장</span>
        </div>
      </div>

      {/* Hero stage — golden fish gently floating, no sparkles */}
      <div className={styles.title__stage}>
        <div className={styles.title__stageGlow} aria-hidden />
        <MotionDiv
          className={styles.title__hero}
          animate={{
            y: [0, -10, 0, 10, 0],
            x: [0, 6, 0, -6, 0],
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
        </MotionDiv>
      </div>

      {/* Bottom action zone */}
      <div className={styles.title__bottomFade} aria-hidden />
      <div className={styles.title__content}>
        <h1 className={styles.title__heading}>
          <span className={styles.title__headingTop}>응모권</span>
          <span className={styles.title__headingBig}>낚시하기</span>
        </h1>
        <p className={styles.title__subtitle}>
          황금물고기를 잡으면 <b>응모권 1장</b>
        </p>

        <Link href={ROUTES.PLAY} className={styles.title__cta}>
          <span className={styles.title__ctaIcon}>🎣</span>
          <span className={styles.title__ctaText}>시작하기</span>
          <span className={styles.title__ctaArrow}>→</span>
          <span className={styles.title__ctaSheen} aria-hidden />
        </Link>

        <p className={styles.title__hint}>탭하여 낚시 시작</p>
      </div>
    </main>
  );
}
