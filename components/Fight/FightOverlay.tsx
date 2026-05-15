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

const ROUND_DURATION_SEC = 3.5;

function pickFishDirection(rng = Math.random): -1 | 1 {
  return rng() < 0.5 ? -1 : 1;
}

export function FightOverlay({ grade, onComplete }: Props) {
  const cfg = gradeConfig(grade);
  const [roundIdx, setRoundIdx] = useState(0);
  const [tension, setTension] = useState(0);
  const [fishDir, setFishDir] = useState<-1 | 1>(() => pickFishDirection());
  const [flashHit, setFlashHit] = useState(false);
  const joystick = useRef<JoystickValue>({ x: 0, y: 0 });
  const lastInputClassRef = useRef<InputDirection>('none');
  const roundStartRef = useRef<number>(performance.now());
  const finishedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setFishDir(pickFishDirection()), 1500);
    return () => clearInterval(id);
  }, []);

  const handleJoystick = useCallback((v: JoystickValue) => {
    joystick.current = v;
  }, []);

  useEffect(() => {
    let rafId = 0;
    let prev = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;

      const jx = joystick.current.x;
      let cls: InputDirection = 'none';
      if (Math.abs(jx) > 0.3) {
        cls = Math.sign(jx) !== fishDir ? 'correct' : 'wrong';
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

      setTension((t) => {
        const next = updateTension(t, cls, dt, {
          up: cfg.tensionUpPerSec,
          down: cfg.tensionDownPerSec,
        });

        if (!finishedRef.current && next >= 100) {
          finishedRef.current = true;
          vibrate('lineBreak');
          onComplete('broken');
          return 100;
        }
        return next;
      });

      const elapsed = (now - roundStartRef.current) / 1000;
      if (!finishedRef.current && elapsed >= ROUND_DURATION_SEC) {
        setTension((finalT) => {
          if (finishedRef.current) return finalT;
          const outcome = decideRoundOutcome(finalT, cfg.escapeChanceHighTension);
          if (outcome === 'escaped') {
            finishedRef.current = true;
            vibrate('lineBreak');
            onComplete('escaped');
            return finalT;
          }
          if (outcome === 'broken') {
            finishedRef.current = true;
            vibrate('lineBreak');
            onComplete('broken');
            return finalT;
          }
          const nextRound = roundIdx + 1;
          if (nextRound >= cfg.rounds) {
            finishedRef.current = true;
            vibrate(grade === 'golden' ? 'goldenCatch' : 'fishCaught');
            onComplete('caught');
            return finalT;
          }
          roundStartRef.current = now;
          setRoundIdx(nextRound);
          return 0;
        });
      }

      if (!finishedRef.current) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [cfg.tensionUpPerSec, cfg.tensionDownPerSec, cfg.rounds, cfg.escapeChanceHighTension, fishDir, grade, onComplete, roundIdx]);

  return (
    <div className={styles.fight}>
      <div className={styles.fight__top}>
        <div className={styles.fight__round}>
          ROUND {roundIdx + 1} / {cfg.rounds}
        </div>
        <FishSilhouette grade={grade} direction={fishDir} flashOnHit={flashHit} />
      </div>
      <div className={styles.fight__middle}>
        <TensionMeter value={tension} />
      </div>
      <div className={styles.fight__bottom}>
        <Joystick onChange={handleJoystick} />
        <p className={styles.fight__hint}>물고기 반대 방향으로 끌어주세요</p>
      </div>
    </div>
  );
}
