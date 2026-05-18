'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Lake } from 'components/Lake';
import { Angler } from 'components/Angler';
import { Bobber } from 'components/Bobber';
import { Splash } from 'components/Splash';
import { FishingLine } from 'components/FishingLine';
import { CatchSequence } from 'components/CatchSequence';
import { CastButton } from 'components/CastButton';
import { FightOverlay } from 'components/Fight/FightOverlay';
import { ResultModal } from 'components/ResultModal';
import { GoldenRewardModal } from 'components/GoldenRewardModal';
import { useGameStore } from 'lib/gameState';
import { rollGrade, pickSpecies, gradeConfig } from 'lib/fish';
import {
  incrementCast,
  incrementFish,
  readDaily,
  todayString,
} from 'lib/dailyCounter';
import { vibrate } from 'lib/haptics';
import {
  sendPlayAdRewarded,
  sendReady,
  sendClaimTicket,
  sendScoreUpdate,
  onMessage,
  type FishParentMessage,
} from 'lib/postMessage';
import { PROGRESS_TARGET, TICKETS_PER_DAY } from 'lib/gameState';
import { useDailyResetSync } from 'lib/useDailyResetSync';
import { installDevMockParent } from 'lib/devMockParent';
import { TicketProgress } from 'components/TicketProgress';
import { TicketClaimedModal } from 'components/TicketClaimedModal';
import type { FishGrade, FishSpecies } from 'lib/types';
import styles from './page.module.scss';

type Phase = 'idle' | 'casting' | 'waiting' | 'bite' | 'fight' | 'catchAnim' | 'result' | 'reward' | 'missed';

const CAST_ANIMATION_MS = 800;
// Hook-set ("챔질") timing window. Player must tap during this window after
// the bobber dips. Too late → fish escapes.
const CHAMJIL_WINDOW_MS = 1700;
// TEMP debug flag — when true, every cast rolls only big/golden grades so we
// can rapidly QA high-tier fights. Flip back to false before launch.
const FORCE_HIGH_GRADE = false;

function rollHighGrade(): FishGrade {
  // QA: golden every cast
  return 'golden';
}

export default function PlayPage() {
  const player = useGameStore((s) => s.player);
  const totalScore = useGameStore((s) => s.totalScore);
  const addScore = useGameStore((s) => s.addScore);
  const setTotalScore = useGameStore((s) => s.setTotalScore);

  const registerPlayer = useGameStore((s) => s.registerPlayer);
  const bumpProgress = useGameStore((s) => s.bumpProgress);
  const registerTicketClaimed = useGameStore((s) => s.registerTicketClaimed);
  const progressScore = useGameStore((s) => s.progressScore);
  const ticketsClaimedToday = useGameStore((s) => s.ticketsClaimedToday);

  const [phase, setPhase] = useState<Phase>('idle');
  const [grade, setGrade] = useState<FishGrade>('trash');
  const [species, setSpecies] = useState<FishSpecies | undefined>(undefined);
  const [lastOutcome, setLastOutcome] = useState<'caught' | 'escaped' | 'broken'>('caught');
  const [showSplash, setShowSplash] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [showGrantedToast, setShowGrantedToast] = useState(false);
  const lastClaimSourceRef = useRef<'progress' | 'golden' | null>(null);
  const chamjilTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);

  useDailyResetSync();

  useEffect(() => {
    setMounted(true);
    installDevMockParent();
    sendReady();
  }, []);

  useEffect(() => {
    const cleanup = onMessage((msg: FishParentMessage) => {
      if (msg.type === 'FISH:SET_PLAYER') {
        registerPlayer(msg.player);
        if (typeof msg.total_score === 'number') {
          useGameStore.getState().setTotalScore(msg.total_score);
        }
      }
      if (msg.type === 'FISH:AD_COMPLETED' || msg.type === 'FISH:AD_FAILED') {
        setPhase('idle');
      }
      if (msg.type === 'FISH:AD_REWARDED_COMPLETED') {
        // Ad watched → request actual ticket grant.
        sendClaimTicket(msg.reason, true);
      }
      if (msg.type === 'FISH:AD_REWARDED_FAILED') {
        setClaiming(false);
      }
      if (msg.type === 'FISH:TICKET_GRANTED') {
        registerTicketClaimed();
        setClaiming(false);
        if (lastClaimSourceRef.current === 'golden') {
          setClaimSuccess(true);
          setShowReward(true);
        } else {
          // Progress-bar claim → show the standalone "granted" celebration.
          setShowGrantedToast(true);
        }
      }
      if (msg.type === 'FISH:TICKET_REJECTED') {
        setClaiming(false);
      }
    });
    return cleanup;
  }, [registerPlayer, registerTicketClaimed]);

  // Progress claim handler — first claim free, subsequent claims need an ad.
  const onClaim = () => {
    if (claiming) return;
    if (ticketsClaimedToday >= TICKETS_PER_DAY) return;
    setClaiming(true);
    lastClaimSourceRef.current = 'progress';
    if (ticketsClaimedToday === 0) {
      sendClaimTicket('progress', false);
      setTimeout(() => setClaiming(false), 1500);
    } else {
      sendPlayAdRewarded('progress');
    }
  };

  // Golden-fish ad-gated claim (triggered from GoldenRewardModal).
  const onClaimGolden = () => {
    if (claiming) return;
    setClaiming(true);
    lastClaimSourceRef.current = 'golden';
    sendPlayAdRewarded('golden');
  };

  const startCast = () => {
    if (phase !== 'idle') return;
    setPhase('casting');
    vibrate('bite');
    setTimeout(() => {
      setPhase('waiting');
      setShowSplash(true);
      setTimeout(() => setShowSplash(false), 700);
      const biteAfter = 1000 + Math.random() * 9000; // 1~10s bite window
      setTimeout(() => {
        setPhase('bite');
        vibrate('bite');
        // Hook-set window — player must tap (chamjil button) during this
        // window or the fish gets away.
        chamjilTimer.current = setTimeout(() => {
          setPhase('missed');
          vibrate('lineBreak');
          setTimeout(() => setPhase('idle'), 1200);
        }, CHAMJIL_WINDOW_MS);
      }, biteAfter);
    }, CAST_ANIMATION_MS);
  };

  // Player taps chamjil within the window → successful hook-set → fight.
  const onChamjil = () => {
    if (phase !== 'bite') return;
    if (chamjilTimer.current) clearTimeout(chamjilTimer.current);
    chamjilTimer.current = null;
    vibrate('goodHit');
    const g = FORCE_HIGH_GRADE ? rollHighGrade() : rollGrade();
    const s = pickSpecies(g);
    setGrade(g);
    setSpecies(s);
    setPhase('fight');
  };

  const onFightComplete = (result: 'caught' | 'escaped' | 'broken') => {
    setLastOutcome(result);

    incrementCast(todayString());

    if (result === 'caught') {
      const cfg = gradeConfig(grade);
      addScore(cfg.score);
      bumpProgress(cfg.score);
      incrementFish(todayString());

      sendScoreUpdate(useGameStore.getState().totalScore);

      // Golden ticket is now gated by a separate rewarded-ad popup that the
      // user triggers from the GoldenRewardModal — we don't auto-grant.
      setPhase('catchAnim');
      return;
    }

    setPhase('result');
  };

  const onCatchAnimDone = () => {
    // All grades land on the result modal first. Golden then transitions to
    // the ad-prompt modal once the player closes the result card.
    setPhase('result');
  };

  const closeResult = () => {
    if (grade === 'golden' && lastOutcome === 'caught') {
      // Chain into golden reward flow — ad-prompt modal.
      setClaimSuccess(false);
      setShowReward(true);
      setPhase('reward');
      return;
    }
    setPhase('idle');
  };

  const closeReward = () => {
    setShowReward(false);
    setClaimSuccess(false);
    setPhase('idle');
  };

  const declineGolden = () => {
    // User chose not to watch ad — close without claiming.
    closeReward();
  };
  const showBobber: 'hidden' | 'arc' | 'floating' | 'bite' | 'sunken' =
    phase === 'idle' ? 'hidden'
    : phase === 'casting' ? 'arc'
    : phase === 'waiting' ? 'floating'
    : phase === 'bite' ? 'bite'
    : phase === 'fight' || phase === 'catchAnim' || phase === 'result' || phase === 'reward' ? 'sunken'
    : 'hidden';
  const showLine = phase === 'casting' || phase === 'waiting' || phase === 'bite';

  if (!mounted) return null;

  // suppress unused-locals if tsconfig is strict
  void totalScore;
  void setTotalScore;

  const ticketsExhausted = ticketsClaimedToday >= TICKETS_PER_DAY;
  const ticketsNeedAd = ticketsClaimedToday >= 1;

  return (
    <main className={styles.play}>
      <Lake>
        <Angler castedRod={phase !== 'idle'} />
        <FishingLine visible={showLine} />
        <Bobber state={showBobber} />
        <Splash visible={showSplash} />
        {phase === 'catchAnim' && species !== undefined && (
          <CatchSequence grade={grade} species={species} onComplete={onCatchAnimDone} />
        )}
      </Lake>

      <div className={styles.play__hudWrap}>
        <TicketProgress
          compact
          current={progressScore}
          target={PROGRESS_TARGET}
          ticketsClaimed={ticketsClaimedToday}
          ticketsMax={TICKETS_PER_DAY}
          needsAd={ticketsNeedAd}
          exhausted={ticketsExhausted}
          onClaim={onClaim}
        />
      </div>

      <div className={styles.play__castWrap}>
        {phase === 'bite' ? (
          <CastButton onClick={onChamjil} label="🎣 당기기!" />
        ) : (
          <CastButton
            onClick={startCast}
            disabled={phase !== 'idle'}
            label={
              phase === 'idle' ? '던지기!' :
              phase === 'casting' ? '던지는 중…' :
              phase === 'waiting' ? '기다리는 중…' :
              phase === 'missed' ? '놓쳤다!' :
              '진행 중'
            }
          />
        )}
      </div>

      {phase === 'fight' && (
        species !== undefined
          ? <FightOverlay grade={grade} species={species} onComplete={onFightComplete} />
          : <FightOverlay grade={grade} onComplete={onFightComplete} />
      )}

      <AnimatePresence>
        {phase === 'result' && (
          species !== undefined ? (
            <ResultModal
              outcome={lastOutcome}
              grade={grade}
              species={species}
              onClose={closeResult}
            />
          ) : (
            <ResultModal
              outcome={lastOutcome}
              grade={grade}
              onClose={closeResult}
            />
          )
        )}
        {showReward && (
          claimSuccess ? (
            <GoldenRewardModal mode="granted" count={1} onClose={closeReward} />
          ) : (
            <GoldenRewardModal
              mode="ad-prompt"
              onWatchAd={onClaimGolden}
              onDecline={declineGolden}
            />
          )
        )}
        {showGrantedToast && (
          <TicketClaimedModal count={1} onClose={() => setShowGrantedToast(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}
