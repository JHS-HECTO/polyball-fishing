'use client';

import styles from './TensionMeter.module.scss';

type Props = { value: number };

function stateOf(value: number): 'safe' | 'warning' | 'danger' {
  if (value >= 80) return 'danger';
  if (value >= 50) return 'warning';
  return 'safe';
}

export function TensionMeter({ value }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  const state = stateOf(clamped);

  return (
    <div className={styles.tension}>
      <div className={styles.tension__label}>긴장도</div>
      <div className={styles.tension__bar}>
        <div
          data-testid="tension-fill"
          data-state={state}
          className={styles.tension__fill}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
