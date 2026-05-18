'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Joystick.module.scss';

export type JoystickValue = { x: number; y: number };

type Props = {
  onChange: (v: JoystickValue) => void;
  radiusPx?: number;
};

// Drag joystick with both pointer-event and touch-event listeners so it
// works across browsers that disagree about which API to fire first.
// onChange always reports x/y in [-1, 1] relative to a fixed pixel radius
// (default 60px). The knob translates visually by x*radius/y*radius.
export function Joystick({ onChange, radiusPx = 60 }: Props) {
  const baseRef = useRef<HTMLDivElement | null>(null);
  const activeIdRef = useRef<number | null>(null);
  const [knob, setKnob] = useState<JoystickValue>({ x: 0, y: 0 });

  const compute = useCallback(
    (clientX: number, clientY: number): JoystickValue => {
      const el = baseRef.current;
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const len = Math.hypot(dx, dy);
      const clamped = Math.min(len, radiusPx);
      const ratio = clamped / radiusPx;
      const nx = len === 0 ? 0 : (dx / len) * ratio;
      const ny = len === 0 ? 0 : (dy / len) * ratio;
      return { x: nx, y: ny };
    },
    [radiusPx],
  );

  const emit = useCallback(
    (v: JoystickValue) => {
      setKnob(v);
      onChange(v);
    },
    [onChange],
  );

  // Attach native touch + pointer listeners directly so we get
  // {passive: false} for preventDefault and so both event families are
  // covered no matter which the browser fires first.
  useEffect(() => {
    const el = baseRef.current;
    if (!el) return;

    const onDown = (clientX: number, clientY: number, id: number, target?: Element) => {
      activeIdRef.current = id;
      try { (target ?? el).setPointerCapture?.(id); } catch { /* not a pointer */ }
      emit(compute(clientX, clientY));
    };
    const onMove = (clientX: number, clientY: number, id: number) => {
      if (activeIdRef.current !== id) return;
      emit(compute(clientX, clientY));
    };
    const onUp = (id: number) => {
      if (activeIdRef.current !== id) return;
      activeIdRef.current = null;
      emit({ x: 0, y: 0 });
    };

    // Pointer events (modern)
    const handlePointerDown = (e: PointerEvent) => {
      e.preventDefault();
      onDown(e.clientX, e.clientY, e.pointerId, e.target as Element | undefined);
    };
    const handlePointerMove = (e: PointerEvent) => {
      e.preventDefault();
      onMove(e.clientX, e.clientY, e.pointerId);
    };
    const handlePointerUp = (e: PointerEvent) => {
      e.preventDefault();
      onUp(e.pointerId);
    };

    // Touch events (fallback for browsers that prioritize touch handlers)
    const TOUCH_ID = -1;
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      if (!t) return;
      onDown(t.clientX, t.clientY, TOUCH_ID);
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      if (!t) return;
      onMove(t.clientX, t.clientY, TOUCH_ID);
    };
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      onUp(TOUCH_ID);
    };

    el.addEventListener('pointerdown', handlePointerDown, { passive: false });
    el.addEventListener('pointermove', handlePointerMove, { passive: false });
    el.addEventListener('pointerup', handlePointerUp, { passive: false });
    el.addEventListener('pointercancel', handlePointerUp, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: false });
    el.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      el.removeEventListener('pointerdown', handlePointerDown);
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerup', handlePointerUp);
      el.removeEventListener('pointercancel', handlePointerUp);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [compute, emit]);

  const knobStyle: React.CSSProperties = {
    transform: `translate(${knob.x * radiusPx}px, ${knob.y * radiusPx}px)`,
  };

  return (
    <div
      ref={baseRef}
      data-testid="joystick-base"
      className={styles.joystick__base}
    >
      <div
        data-testid="joystick-knob"
        className={styles.joystick__knob}
        style={knobStyle}
      />
    </div>
  );
}
