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
  trash:  [1100, 1600],
  normal: [950, 1500],
  rare:   [800, 1300],
  big:    [700, 1100],
  golden: [800, 1300],
};

// Tug events — fish makes a sudden hard pull. More for bigger fish.
const TUG_RANGE_MS: Record<FishGrade, [number, number]> = {
  trash:  [12000, 15000],  // basically none
  normal: [5500, 8000],
  rare:   [3500, 5500],
  big:    [2800, 4500],
  golden: [3000, 5000],
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
  // Direct DOM refs — gauge widths update every RAF tick without going
  // through React's reconciler, eliminating perceived lag.
  const catchFillRef = useRef<HTMLDivElement | null>(null);
  const tensionFillRef = useRef<HTMLDivElement | null>(null);
  // Throttle React state syncs for tension level transitions (vignette, shake)
  const lastTensionSyncRef = useRef<number>(0);

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

      // Direction-matching pull mechanic. Player must drag the joystick in
      // the OPPOSITE direction of the fish to land progress. Same-direction
      // drag actively hurts (tension climbs faster, catch drains).
      const jx = joystick.current.x;
      const dir = fishDirRef.current;
      const jMag = Math.abs(jx);
      let cls: InputDirection = 'none';
      if (jMag > 0.18) {
        cls = Math.sign(jx) !== dir ? 'correct' : 'wrong';
      }
      const pullingNow = cls === 'correct';
      if (cls !== lastInputClassRef.current) {
        if (cls === 'correct') {
          setFlashHit(true);
          setTimeout(() => setFlashHit(false), 120);
          setPulling(true);
          startRumble();
        } else if (cls === 'wrong') {
          setPulling(false);
          stopRumble();
          vibrate('badHit');
        } else {
          setPulling(false);
          stopRumble();
        }
        lastInputClassRef.current = cls;
      }

      // Tension update — correct pull drains, idle climbs, wrong-direction
      // pull penalizes hard. Tug events further boost the climb rate.
      const upRate = cfg.tensionUpPerSec * (tugActive ? TUG_TENSION_RATE_MULT : 1);
      const downRate = cfg.tensionDownPerSec * (tugActive ? 0.5 : 1);
      const wrongPenalty = 1.3;
      let nextTension = tensionRef.current;
      if (cls === 'correct') {
        nextTension = Math.max(0, nextTension - downRate * dt);
      } else if (cls === 'wrong') {
        nextTension = Math.min(100, nextTension + upRate * wrongPenalty * dt);
      } else {
        nextTension = Math.min(100, nextTension + upRate * dt);
      }
      tensionRef.current = nextTension;
      // Direct DOM update bypasses React's batching so the gauge tracks each
      // RAF tick exactly. State syncing (for tension-level transitions) is
      // throttled to ~10fps so vignette/shake/danger-label classes update.
      if (tensionFillRef.current) {
        tensionFillRef.current.style.width = `${nextTension}%`;
        tensionFillRef.current.setAttribute(
          'data-state',
          nextTension >= 80 ? 'danger' : nextTension >= 50 ? 'warning' : 'safe',
        );
      }
      if (now - lastTensionSyncRef.current > 100) {
        lastTensionSyncRef.current = now;
        setTension(nextTension);
      }

      // Catch progress — fills only when pulling OPPOSITE to fish.
      // Wrong direction = penalty drain. Idle = mild drain. Tug throttles fill.
      let nextCatch = catchProgressRef.current;
      if (pullingNow) {
        const fillMult = tugActive ? 0.3 : 1;
        nextCatch += cfg.staminaUpPerSec * dt * fillMult;
      } else if (cls === 'wrong') {
        nextCatch -= cfg.staminaDownPerSec * dt * 1.5;
      } else {
        nextCatch -= cfg.staminaDownPerSec * dt;
      }
      nextCatch = clamp(nextCatch, 0, 100);
      catchProgressRef.current = nextCatch;
      if (catchFillRef.current) {
        catchFillRef.current.style.width = `${nextCatch}%`;
      }

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
      <div className={styles.fight__vortex} aria-hidden />
      <div className={styles.fight__speedLines} aria-hidden />

      {/* Intro stamp — flashes for ~0.6s when fight begins */}
      <div className={styles.fight__intro} aria-hidden>
        <span className={styles.fight__introText}>FIGHT!</span>
      </div>

      <div className={styles.fight__top}>
        <div className={styles.fight__catchLabel}>잡기 진행도</div>
        <div className={styles.fight__catchBar}>
          <div
            ref={catchFillRef}
            className={styles.fight__catchFill}
            style={{ width: '0%' }}
          />
        </div>
        {species !== undefined
          ? <FishSilhouette grade={grade} species={species} direction={fishDir} flashOnHit={flashHit} />
          : <FishSilhouette grade={grade} direction={fishDir} flashOnHit={flashHit} />
        }

        {/* Direction guide — big arrow points the way the player must drag */}
        <div
          className={styles.fight__guide}
          data-dir={fishDir === 1 ? 'left' : 'right'}
          aria-hidden
        >
          <span className={styles.fight__guideArrow}>
            {fishDir === 1 ? '←' : '→'}
          </span>
          <span className={styles.fight__guideLabel}>이쪽으로 끌어!</span>
        </div>
      </div>

      <div className={styles.fight__middle}>
        <TensionMeter ref={tensionFillRef} value={tension} />
        {tension >= 90 && <div className={styles.fight__dangerLabel}>위험!</div>}
      </div>

      <div className={styles.fight__bottom}>
        <Joystick onChange={handleJoystick} />
        <p className={styles.fight__hint} data-pulling={pulling ? 'yes' : 'no'}>
          {pulling ? '🔥 당기는 중!' : tugging ? '버텨!' : '물고기 반대쪽으로!'}
        </p>
      </div>

      {/* Decorative water-bubble particles to fill the otherwise plain frame */}
      <div className={styles.fight__bubbles} aria-hidden>
        <span data-i="1" /><span data-i="2" /><span data-i="3" />
        <span data-i="4" /><span data-i="5" /><span data-i="6" />
      </div>
    </div>
  );
}
