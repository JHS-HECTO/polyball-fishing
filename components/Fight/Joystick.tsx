'use client';

import { useCallback, useRef, useState } from 'react';
import styles from './Joystick.module.scss';

export type JoystickValue = { x: number; y: number };

type Props = {
  onChange: (v: JoystickValue) => void;
  radiusPx?: number;
};

export function Joystick({ onChange, radiusPx = 60 }: Props) {
  const baseRef = useRef<HTMLDivElement | null>(null);
  const activeId = useRef<number | null>(null);
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

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    activeId.current = e.pointerId;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    emit(compute(e.clientX, e.clientY));
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (activeId.current !== e.pointerId) return;
    emit(compute(e.clientX, e.clientY));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (activeId.current !== e.pointerId) return;
    activeId.current = null;
    emit({ x: 0, y: 0 });
  };

  const knobStyle: React.CSSProperties = {
    transform: `translate(${knob.x * radiusPx}px, ${knob.y * radiusPx}px)`,
  };

  return (
    <div
      ref={baseRef}
      data-testid="joystick-base"
      className={styles.joystick__base}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        data-testid="joystick-knob"
        className={styles.joystick__knob}
        style={knobStyle}
      />
    </div>
  );
}
