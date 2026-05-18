'use client';

import clsx from 'clsx';
import styles from './CastButton.module.scss';

type Props = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
};

export function CastButton({ onClick, disabled = false, label = '캐스팅!' }: Props) {
  return (
    <button
      className={clsx(styles.cast, { [styles['cast--disabled'] as string]: disabled })}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.cast__text}>{label}</span>
      <span className={styles.cast__sheen} aria-hidden />
    </button>
  );
}
