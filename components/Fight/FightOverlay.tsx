'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FishGrade } from 'lib/types';
import { gradeConfig } from 'lib/fish';
import { updateTension, decideRoundOutcome, type InputDirection } from 'lib/tension';
import { vibrate } from 'lib/haptics';
import { Joystick, type JoystickValue } from './Joystick';
import { TensionMeter } from './TensionMeter';
import { FishSilhouette } from './FishSilhouette';
import styles from './FightOverlay.module.scss';

type FightResult = 'caught' | 'escaped' | 'broken';

type Props = {
  grade: FishGrade;
  onComplete: (result: FightResult) => void;
};

const DIR_CHANGE_RANGE_MS: Record<FishGrade, [number, number]> = {
  trash:  [900, 1400],
  normal: [700, 1300],
  rare:   [550, 1100],
  big:    [400, 950],
  golden: [320, 800],
};

const ROUND_DURATION_RANGE_SEC: Record<FishGrade, [number, number]> = {
  trash:  [2.8, 3.2],
  normal: [2.8, 3.8],
  rare:   [2.6, 4.0],
  big:    [2.5, 4.4],
  golden: [2.4, 4.8],
};

const TUG_EVENTS_PER_ROUND: Record<FishGrade, number> = {
  trash:  0,
  normal: 1,
  rare:   1,
  big:    2,
  golden: 2,
};
const TUG_DURATION_MS = 650;
const TUG_TENSION_RATE_MULT = 2.6;

const HEARTBEAT_THRESHOLD = 75;
const SHAKE_THRESHOLD = 80;
const VIGNETTE_THRESHOLD = 65;

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
function pickFishDirection(rng = Math.random): -1 | 1 {
  return rng() < 0.5 ? -1 : 1;
}

export function FightOverlay({ grade, onComplete }: Props) {
  const cfg = gradeConfig(grade);
  const [roundIdx, setRoundIdx] = useState(0);
  const [tension, setTension] = useState(0);
  const [fishDir, setFishDir] = useState<-1 | 1>(() => pickFishDirection());
  const [flashHit, setFlashHit] = useState(false);
  const [tugging, setTugging] = useState(false);
  const [timeProgress, setTimeProgress] = useState(0);

  // Mutable refs — RAF tick reads these without re-creating the effect.
  const tensionRef = useRef(0);
  const roundIdxRef = useRef(0);
  const fishDirRef = useRef<-1 | 1>(fishDir);
  const joystick = useRef<JoystickValue>({ x: 0, y: 0 });
  const lastInputClassRef = useRef<InputDirection>('none');
  const roundStartRef = useRef<number>(performance.now());
  const roundDurationRef = useRef<number>(rand(...ROUND_DURATION_RANGE_SEC[grade]));
  const finishedRef = useRef(false);
  const tugUntilRef = useRef<number>(0);
  const tugTimesRef = useRef<number[]>([]);
  const heartbeatLastRef = useRef<number>(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const scheduleTugsForRound = useCallback((roundDurSec: number) => {
    const count = TUG_EVENTS_PER_ROUND[grade];
    const times: number[] = [];
    for (let i = 0; i < count; i++) {
      times.push(rand(roundDurSec * 0.25, roundDurSec * 0.75) * 1000);
    }
    tugTimesRef.current = times.sort((a, b) => a - b);
  }, [grade]);

  useEffect(() => {
    scheduleTugsForRound(roundDurationRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fish direction change loop
  useEffect(() => {
    const [minMs, maxMs] = DIR_CHANGE_RANGE_MS[grade];
    let cancelled = false;
    const loop = () => {
      if (cancelled || finishedRef.current) return;
      const delay = rand(minMs, maxMs);
      setTimeout(() => {
        if (cancelled || finishedRef.current) return;
        const next = pickFishDirection();
        fishDirRef.current = next;
        setFishDir(next);
        loop();
      }, delay);
    };
    loop();
    return () => { cancelled = true; };
  }, [grade]);

  const handleJoystick = useCallback((v: JoystickValue) => {
    joystick.current = v;
  }, []);

  // Game loop — depends only on stable refs. Side effects (onComplete, vibrate)
  // are called OUTSIDE of state-setter callbacks to avoid React 19's
  // "update during render" error.
  useEffect(() => {
    let rafId = 0;
    let prev = performance.now();

    const tick = (now: number) => {
      if (finishedRef.current) return;
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;

      // Fire pending tug events
      const elapsedMs = now - roundStartRef.current;
      while (tugTimesRef.current.length > 0 && elapsedMs >= tugTimesRef.current[0]!) {
        tugTimesRef.current.shift();
        tugUntilRef.current = now + TUG_DURATION_MS;
        setTugging(true);
        vibrate('badHit');
        setTimeout(() => setTugging(false), TUG_DURATION_MS);
      }
      const tugActive = now < tugUntilRef.current;

      const jx = joystick.current.x;
      const dir = fishDirRef.current;
      let cls: InputDirection = 'none';
      if (Math.abs(jx) > 0.25) {
        cls = Math.sign(jx) !== dir ? 'correct' : 'wrong';
      }
      if (cls !== lastInputClassRef.current) {
        if (cls === 'correct') {
          setFlashHit(true);
          setTimeout(() => setFlashHit(false), 120);
          vibrate('goodHit');
        } else if (cls === 'wrong') {
          vibrate('badHit');
        }
        lastInputClassRef.current = cls;
      }

      const upRate = cfg.tensionUpPerSec * (tugActive ? TUG_TENSION_RATE_MULT : 1);
      const downRate = cfg.tensionDownPerSec * (tugActive ? 0.6 : 1);

      const nextTension = updateTension(tensionRef.current, cls, dt, { up: upRate, down: downRate });
      tensionRef.current = nextTension;
      setTension(nextTension);

      if (nextTension >= HEARTBEAT_THRESHOLD && now - heartbeatLastRef.current > 600) {
        heartbeatLastRef.current = now;
        vibrate('bite');
      }

      const elapsed = (now - roundStartRef.current) / 1000;
      setTimeProgress(Math.min(1, elapsed / roundDurationRef.current));

      // Broken (line snapped)
      if (nextTension >= 100) {
        finishedRef.current = true;
        vibrate('lineBreak');
        onCompleteRef.current('broken');
        return;
      }

      // Round end
      if (elapsed >= roundDurationRef.current) {
        const outcome = decideRoundOutcome(nextTension, cfg.escapeChanceHighTension);
        if (outcome === 'escaped') {
          finishedRef.current = true;
          vibrate('lineBreak');
          onCompleteRef.current('escaped');
          return;
        }
        if (outcome === 'broken') {
          finishedRef.current = true;
          vibrate('lineBreak');
          onCompleteRef.current('broken');
          return;
        }
        const nextRound = roundIdxRef.current + 1;
        if (nextRound >= cfg.rounds) {
          finishedRef.current = true;
          vibrate(grade === 'golden' ? 'goldenCatch' : 'fishCaught');
          onCompleteRef.current('caught');
          return;
        }
        roundIdxRef.current = nextRound;
        setRoundIdx(nextRound);
        roundDurationRef.current = rand(...ROUND_DURATION_RANGE_SEC[grade]);
        scheduleTugsForRound(roundDurationRef.current);
        roundStartRef.current = now;
        tensionRef.current = 0;
        setTension(0);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [cfg.tensionUpPerSec, cfg.tensionDownPerSec, cfg.rounds, cfg.escapeChanceHighTension, grade, scheduleTugsForRound]);

  const tensionLevel: 'safe' | 'warn' | 'danger' | 'critical' =
    tension >= 90 ? 'critical' :
    tension >= SHAKE_THRESHOLD ? 'danger' :
    tension >= VIGNETTE_THRESHOLD ? 'warn' :
    'safe';

  const containerClasses = [
    styles.fight,
    tensionLevel === 'danger' || tensionLevel === 'critical' ? styles['fight--shake'] : '',
    tugging ? styles['fight--tug'] : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} data-tension-level={tensionLevel}>
      <div className={styles.fight__vignette} aria-hidden />

      <div className={styles.fight__top}>
        <div className={styles.fight__round}>
          ROUND {roundIdx + 1} / {cfg.rounds}
        </div>
        <FishSilhouette grade={grade} direction={fishDir} flashOnHit={flashHit} />
      </div>

      <div className={styles.fight__middle}>
        <TensionMeter value={tension} />
        <div className={styles.fight__roundTimer} aria-label="라운드 남은 시간">
          <div
            className={styles.fight__roundTimerFill}
            style={{ width: `${Math.max(0, 100 - timeProgress * 100)}%` }}
          />
        </div>
        {tension >= 90 && <div className={styles.fight__dangerLabel}>위험!</div>}
      </div>

      <div className={styles.fight__bottom}>
        <Joystick onChange={handleJoystick} />
        <p className={styles.fight__hint}>
          {tugging ? '버텨!' : tensionLevel === 'critical' ? '계속!' : '반대 방향으로 끌어주세요'}
        </p>
      </div>
    </div>
  );
}
