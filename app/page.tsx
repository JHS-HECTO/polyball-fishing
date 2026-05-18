'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import { ROUTES } from 'lib/routes';
import {
  useGameStore,
  PROGRESS_TARGET,
  TICKETS_PER_DAY,
} from 'lib/gameState';
import { todayString } from 'lib/dailyCounter';
import {
  onMessage,
  sendClaimTicket,
  sendPlayAdRewarded,
  sendReady,
  type FishParentMessage,
} from 'lib/postMessage';
import { TicketProgress } from 'components/TicketProgress';
import styles from './page.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as ComponentType<any>;

const CLAIM_TIMEOUT_MS = 1500;

export default function TitlePage() {
  const progressScore = useGameStore((s) => s.progressScore);
  const ticketsClaimedToday = useGameStore((s) => s.ticketsClaimedToday);
  const registerTicketClaimed = useGameStore((s) => s.registerTicketClaimed);
  const syncDailyState = useGameStore((s) => s.syncDailyState);
  const registerPlayer = useGameStore((s) => s.registerPlayer);

  const [mounted, setMounted] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const claimTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingAdRef = useRef(false); // true while we wait for the ad to finish

  useEffect(() => {
    setMounted(true);
    syncDailyState(todayString());
    sendReady();
  }, [syncDailyState]);

  useEffect(() => {
    const cleanup = onMessage((msg: FishParentMessage) => {
      if (msg.type === 'FISH:SET_PLAYER') {
        registerPlayer(msg.player);
        if (typeof msg.total_score === 'number') {
          useGameStore.getState().setTotalScore(msg.total_score);
        }
      }
      if (msg.type === 'FISH:AD_REWARDED_COMPLETED') {
        if (msg.reason === 'progress') {
          // Ad watched → request the ticket grant from the parent.
          sendClaimTicket('progress', true);
        }
      }
      if (msg.type === 'FISH:AD_REWARDED_FAILED') {
        // Player skipped or no inventory — no ticket, reset the claiming UI.
        pendingAdRef.current = false;
        setClaiming(false);
      }
      if (msg.type === 'FISH:TICKET_GRANTED') {
        if (claimTimer.current) clearTimeout(claimTimer.current);
        registerTicketClaimed();
        setClaiming(false);
        pendingAdRef.current = false;
      }
      if (msg.type === 'FISH:TICKET_REJECTED') {
        if (claimTimer.current) clearTimeout(claimTimer.current);
        setClaiming(false);
        pendingAdRef.current = false;
      }
    });
    return cleanup;
  }, [registerPlayer, registerTicketClaimed]);

  const onClaim = () => {
    if (claiming) return;
    if (ticketsClaimedToday >= TICKETS_PER_DAY) return;
    setClaiming(true);
    if (ticketsClaimedToday === 0) {
      // First ticket of the day — free claim.
      sendClaimTicket('progress', false);
      // 1.5s fallback so UI doesn't lock forever if parent never responds.
      claimTimer.current = setTimeout(() => setClaiming(false), CLAIM_TIMEOUT_MS);
    } else {
      // 2nd/3rd — must watch a rewarded ad first.
      pendingAdRef.current = true;
      sendPlayAdRewarded('progress');
    }
  };

  const exhausted = ticketsClaimedToday >= TICKETS_PER_DAY;
  const needsAd = ticketsClaimedToday >= 1;
  const currentPts = mounted ? progressScore : 0;

  return (
    <main className={styles.title}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/01-title-bg.png" alt="" className={styles.title__bg} draggable={false} />
      <div className={styles.title__atmosphere} aria-hidden />

      {/* Hero stage — golden fish gently floating */}
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

        <TicketProgress
          current={currentPts}
          target={PROGRESS_TARGET}
          ticketsClaimed={ticketsClaimedToday}
          ticketsMax={TICKETS_PER_DAY}
          needsAd={needsAd}
          exhausted={exhausted}
          onClaim={onClaim}
        />

        <div className={styles.title__ctaSpacer} aria-hidden />

        <Link href={ROUTES.PLAY} className={styles.title__cta}>
          <span className={styles.title__ctaIcon}>🎣</span>
          <span className={styles.title__ctaText}>시작하기</span>
          <span className={styles.title__ctaArrow}>→</span>
          <span className={styles.title__ctaSheen} aria-hidden />
        </Link>
      </div>
    </main>
  );
}
