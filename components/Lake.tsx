import styles from './Lake.module.scss';

export function Lake({ children }: { children?: React.ReactNode }) {
  return (
    <div className={styles.lake}>
      <div className={styles.lake__sky} />
      <div className={styles.lake__hills} />
      <div className={styles.lake__water}>
        <div className={styles.lake__wave} />
        <div className={styles.lake__wave} style={{ animationDelay: '0.6s' }} />
      </div>
      {children}
    </div>
  );
}
