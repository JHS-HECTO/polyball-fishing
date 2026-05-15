import styles from './Lake.module.scss';

// Background scene. The 01-title-bg.png provides the full reservoir scenery
// (sky / hills / water / shore). Children (angler, bobber, fish) overlay on top.
export function Lake({ children }: { children?: React.ReactNode }) {
  return (
    <div className={styles.lake}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/01-title-bg.png" alt="" className={styles.lake__bg} draggable={false} />
      {children}
    </div>
  );
}
