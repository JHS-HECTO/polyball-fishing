import styles from './LakeFishShadows.module.scss';

// Pure-CSS fish silhouettes drifting around the lake to imply life under the
// surface. Several at different speeds/sizes/depths so it never looks like a
// repeating loop.
export function LakeFishShadows() {
  return (
    <div className={styles.shadows} aria-hidden>
      <div className={styles.shadow} data-fish="1" />
      <div className={styles.shadow} data-fish="2" />
      <div className={styles.shadow} data-fish="3" />
      <div className={styles.shadow} data-fish="4" />
      <div className={styles.shadow} data-fish="5" />
    </div>
  );
}
