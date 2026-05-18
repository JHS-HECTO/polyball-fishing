'use client';

import { forwardRef } from 'react';
import styles from './TensionMeter.module.scss';

type Props = {
  value: number;
  state?: 'safe' | 'warning' | 'danger';
};

// `value` drives the displayed state class (safe/warning/danger). The fill
// width is updated externally via the forwarded ref on every RAF tick so the
// bar tracks gameplay 1:1 without React re-renders.
export const TensionMeter = forwardRef<HTMLDivElement, Props>(function TensionMeter(
  { value, state },
  ref,
) {
  const clamped = Math.max(0, Math.min(100, value));
  const finalState: 'safe' | 'warning' | 'danger' =
    state ?? (clamped >= 80 ? 'danger' : clamped >= 50 ? 'warning' : 'safe');

  return (
    <div className={styles.tension}>
      <div className={styles.tension__label}>긴장도</div>
      <div className={styles.tension__bar}>
        <div
          ref={ref}
          data-testid="tension-fill"
          data-state={finalState}
          className={styles.tension__fill}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
});
