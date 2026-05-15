import styles from './Lake.module.scss';

// Big foreground lake scene for the play screen. Pure CSS, animated water.
// Children (angler, bobber, splash, fish) overlay on top.
export function Lake({ children }: { children?: React.ReactNode }) {
  return (
    <div className={styles.lake}>
      <div className={styles.lake__sky} />
      <div className={styles.lake__sun} />
      <div className={styles.lake__hills} />
      <div className={styles.lake__water}>
        <div className={styles.lake__waterBob}>
          <div className={styles.lake__wave1} />
          <div className={styles.lake__wave2} />
          <div className={styles.lake__shimmer} />
        </div>
      </div>
      <div className={styles.lake__beach} />
      <div className={styles.lake__dock} />
      <div className={styles.lake__ground} />
      {children}
    </div>
  );
}
