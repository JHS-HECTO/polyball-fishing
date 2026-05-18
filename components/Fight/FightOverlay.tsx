'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FishGrade, FishSpecies } from 'lib/types';
import { gradeConfig } from 'lib/fish';
import { updateTension, type InputDirection } from 'lib/tension';
import { vibrate, startRumble, stopRumble } from 'lib/haptics';
import { Joystick, type JoystickValue } from './Joystick';
import { TensionMeter } from './TensionMeter';
import { FishSilhouette } from './FishSilhouette';
import styles from './FightOverlay.module.scss';

type FightResult = 'caught' | 'escaped' | 'broken';

type Props = {
  grade: FishGrade;
  species?: FishSpecies;
  onComplete: (result: FightResult) => void;
};

// Continuous fight — no rounds. Player wins when catchProgress reaches 100,
// fish wins when tension reaches 100. Fish direction changes randomly and
// occasional "tug" events spike tension.
const DIR_CHANGE_RANGE_MS: Record<FishGrade, [number, number]> = {
  trash:  [900, 1400],
  normal: [700, 1300],
  rare:   [550, 1100],
  big:    [400, 950],
  golden: [320, 800],
};

// Tug events — fish makes a sudden hard pull. More for bigger fish.
const TUG_RANGE_MS: Record<FishGrade, [number, number]> = {
  trash:  [9999, 9999],   // effectively none
  normal: [3500, 6000],
  rare:   [2500, 5000],
  big:    [2000, 4000],
  golden: [1500, 3500],
};
const TUG_DURATION_MS = 700;
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
function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function FightOverlay({ grade, species, onComplete }: Props) {
  const cfg = gradeConfig(grade);
  const [tension, setTension] = useState(0);
  const [catchProgress, setCatchProgress] = useState(0);
  const [fishDir, setFishDir] = useState<-1 | 1>(() => pickFishDirection());
  const [flashHit, setFlashHit] = useState(false);
  const [tugging, setTugging] = useState(false);
  const [pulling, setPulling] = useState(false);

  // Refs — RAF tick reads these without re-creating the effect.
  const tensionRef = useRef(0);
  const catchProgressRef = useRef(0);
  const fishDirRef = useRef<-1 | 1>(fishDir);
  const joystick = useRef<JoystickValue>({ x: 0, y: 0 });
  const lastInputClassRef = useRef<InputDirection>('none');
  const finishedRef = useRef(false);
  const tugUntilRef = useRef<number>(0);
  const heartbeatLastRef = useRef<number>(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Fish direction loop
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

  // Tug event loop
  useEffect(() => {
    const [minMs, maxMs] = TUG_RANGE_MS[grade];
    let cancelled = false;
    const loop = () => {
      if (cancelled || finishedRef.current) return;
      const delay = rand(minMs, maxMs);
      setTimeout(() => {
        if (cancelled || finishedRef.current) return;
        tugUntilRef.current = performance.now() + TUG_DURATION_MS;
        setTugging(true);
        vibrate('badHit');
        setTimeout(() => setTugging(false), TUG_DURATION_MS);
        loop();
      }, delay);
    };
    loop();
    return () => { cancelled = true; };
  }, [grade]);

  const handleJoystick = useCallback((v: JoystickValue) => {
    joystick.current = v;
  }, []);

  // Game loop
  useEffect(() => {
    let rafId = 0;
    let prev = performance.now();

    const tick = (now: number) => {
      if (finishedRef.current) return;
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;

      const tugActive = now < tugUntilRef.current;

      // Simple pull mechanic — any joystick deflection counts as pulling.
      // Deadzone is intentionally tiny so a small tug already registers.
      const jMag = Math.hypot(joystick.current.x, joystick.current.y);
      const pullingNow = jMag > 0.05;
      const cls: InputDirection = pullingNow ? 'correct' : 'none';
      if (cls !== lastInputClassRef.current) {
        if (cls === 'correct') {
          setFlashHit(true);
          setTimeout(() => setFlashHit(false), 120);
          setPulling(true);
          startRumble();
        } else {
          setPulling(false);
          stopRumble();
        }
        lastInputClassRef.current = cls;
      }

      // Tension update — pulling drains tension, idle/tug fills it.
      const upRate = cfg.tensionUpPerSec * (tugActive ? TUG_TENSION_RATE_MULT : 1);
      const downRate = cfg.tensionDownPerSec * (tugActive ? 0.5 : 1);
      const nextTension = updateTension(tensionRef.current, cls, dt, { up: upRate, down: downRate });
      tensionRef.current = nextTension;
      setTension(nextTension);

      // Catch progress — fills while pulling. Drains slowly when idle. During
      // tugs progress is choked to ~30% of normal (fish thrashes back).
      let nextCatch = catchProgressRef.current;
      if (pullingNow) {
        const fillMult = tugActive ? 0.3 : 1;
        nextCatch += cfg.staminaUpPerSec * dt * fillMult;
      } else {
        nextCatch -= cfg.staminaDownPerSec * dt;
      }
      nextCatch = clamp(nextCatch, 0, 100);
      catchProgressRef.current = nextCatch;
      setCatchProgress(nextCatch);

      // Heartbeat haptic when tension high
      if (nextTension >= HEARTBEAT_THRESHOLD && now - heartbeatLastRef.current > 600) {
        heartbeatLastRef.current = now;
        vibrate('bite');
      }

      // Win conditions — hold for ~400ms so the player sees the final 100%
      // state flush to DOM before the parent unmounts this overlay.
      if (nextCatch >= 100) {
        finishedRef.current = true;
        stopRumble();
        vibrate(grade === 'golden' ? 'goldenCatch' : 'fishCaught');
        setTimeout(() => onCompleteRef.current('caught'), 400);
        return;
      }
      if (nextTension >= 100) {
        finishedRef.current = true;
        stopRumble();
        vibrate('lineBreak');
        setTimeout(() => onCompleteRef.current('broken'), 400);
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      stopRumble();
    };
  }, [cfg.tensionUpPerSec, cfg.tensionDownPerSec, cfg.staminaUpPerSec, cfg.staminaDownPerSec, grade]);

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
        <div className={styles.fight__catchLabel}>잡기 진행도</div>
        <div className={styles.fight__catchBar}>
          <div
            className={styles.fight__catchFill}
            style={{ width: `${catchProgress}%` }}
          />
        </div>
        {species !== undefined
          ? <FishSilhouette grade={grade} species={species} direction={fishDir} flashOnHit={flashHit} />
          : <FishSilhouette grade={grade} direction={fishDir} flashOnHit={flashHit} />
        }
      </div>

      <div className={styles.fight__middle}>
        <TensionMeter value={tension} />
        {tension >= 90 && <div className={styles.fight__dangerLabel}>위험!</div>}
      </div>

      <div className={styles.fight__bottom}>
        <Joystick onChange={handleJoystick} />
        <p className={styles.fight__hint} data-pulling={pulling ? 'yes' : 'no'}>
          {pulling ? '🔥 당기는 중!' : tugging ? '버텨!' : '조이스틱 끌어!'}
        </p>
      </div>
    </div>
  );
}
