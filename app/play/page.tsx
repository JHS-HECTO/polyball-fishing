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
  sendPlayAd,
  sendReady,
  sendTicketReward,
  sendScoreUpdate,
  onMessage,
  type FishParentMessage,
} from 'lib/postMessage';
import type { FishGrade, FishSpecies } from 'lib/types';
import styles from './page.module.scss';

type Phase = 'idle' | 'casting' | 'waiting' | 'bite' | 'fight' | 'catchAnim' | 'result' | 'reward' | 'ad' | 'missed';

const CAST_ANIMATION_MS = 800;
const TICKET_TIMEOUT_MS = 1500;
const ADS_EVERY = 5;
// Hook-set ("챔질") timing window. Player must tap during this window after
// the bobber dips. Too late → fish escapes.
const CHAMJIL_WINDOW_MS = 1100;

export default function PlayPage() {
  const player = useGameStore((s) => s.player);
  const totalScore = useGameStore((s) => s.totalScore);
  const addScore = useGameStore((s) => s.addScore);
  const setTotalScore = useGameStore((s) => s.setTotalScore);
  const castsSinceAd = useGameStore((s) => s.castsSinceAd);
  const bumpCastsSinceAd = useGameStore((s) => s.bumpCastsSinceAd);
  const resetCastsSinceAd = useGameStore((s) => s.resetCastsSinceAd);

  const registerPlayer = useGameStore((s) => s.registerPlayer);

  const [phase, setPhase] = useState<Phase>('idle');
  const [grade, setGrade] = useState<FishGrade>('trash');
  const [species, setSpecies] = useState<FishSpecies | undefined>(undefined);
  const [lastOutcome, setLastOutcome] = useState<'caught' | 'escaped' | 'broken'>('caught');
  const [showSplash, setShowSplash] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const pendingTicketTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chamjilTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Tell parent we're ready to receive FISH:SET_PLAYER injection.
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
      if (msg.type === 'FISH:TICKET_GRANTED') {
        if (pendingTicketTimer.current) clearTimeout(pendingTicketTimer.current);
        setShowReward(true);
      }
      if (msg.type === 'FISH:TICKET_REJECTED') {
        if (pendingTicketTimer.current) clearTimeout(pendingTicketTimer.current);
      }
    });
    return cleanup;
  }, [registerPlayer]);

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
    const g = rollGrade();
    const s = pickSpecies(g);
    setGrade(g);
    setSpecies(s);
    setPhase('fight');
  };

  const onFightComplete = (result: 'caught' | 'escaped' | 'broken') => {
    setLastOutcome(result);

    incrementCast(todayString());
    bumpCastsSinceAd();

    if (result === 'caught') {
      const cfg = gradeConfig(grade);
      addScore(cfg.score);
      incrementFish(todayString());

      sendScoreUpdate(useGameStore.getState().totalScore);

      if (grade === 'golden') {
        sendTicketReward({ count: 1, fish: 'golden' });
        pendingTicketTimer.current = setTimeout(() => {
          // timeout: treat as rejected (no reward modal)
        }, TICKET_TIMEOUT_MS);
      }

      // Caught: play splash+leap sequence before showing the result modal.
      setPhase('catchAnim');
      return;
    }

    setPhase('result');
  };

  const onCatchAnimDone = () => {
    setPhase('result');
  };

  const closeResult = () => {
    setPhase('idle');
    if (showReward) return;
    if (useGameStore.getState().castsSinceAd >= ADS_EVERY) {
      resetCastsSinceAd();
      setPhase('ad');
      sendPlayAd();
    }
  };

  const closeReward = () => {
    setShowReward(false);
    setPhase('idle');
    if (useGameStore.getState().castsSinceAd >= ADS_EVERY) {
      resetCastsSinceAd();
      setPhase('ad');
      sendPlayAd();
    }
  };

  void castsSinceAd; // counter exists for ad gating but no HUD displays it
  const showBobber: 'hidden' | 'arc' | 'floating' | 'bite' | 'sunken' =
    phase === 'idle' ? 'hidden'
    : phase === 'casting' ? 'arc'
    : phase === 'waiting' ? 'floating'
    : phase === 'bite' ? 'bite'
    : phase === 'fight' || phase === 'catchAnim' || phase === 'result' || phase === 'reward' || phase === 'ad' ? 'sunken'
    : 'hidden';
  const showLine = phase === 'casting' || phase === 'waiting' || phase === 'bite';

  if (!mounted) return null;

  // suppress unused-locals if tsconfig is strict
  void totalScore;
  void setTotalScore;

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

      <div className={styles.play__castWrap}>
        {phase === 'bite' ? (
          <CastButton onClick={onChamjil} label="🎣 챔질!" />
        ) : (
          <CastButton
            onClick={startCast}
            disabled={phase !== 'idle'}
            label={
              phase === 'idle' ? '캐스팅!' :
              phase === 'casting' ? '던지는 중…' :
              phase === 'waiting' ? '기다리는 중…' :
              phase === 'missed' ? '놓쳤다!' :
              phase === 'ad' ? '광고 재생 중…' :
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
          <GoldenRewardModal count={1} onClose={closeReward} />
        )}
      </AnimatePresence>
    </main>
  );
}
