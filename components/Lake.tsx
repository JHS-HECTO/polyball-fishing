import { LakeFishShadows } from './LakeFishShadows';
import styles from './Lake.module.scss';

// Play-screen scene. Static Gemini-rendered background image + a handful of
// subtle CSS/framer overlays that add motion (shimmer, sun glow, lily-pad
// ripples, fish shadows) without contradicting the painted scene.
export function Lake({ children }: { children?: React.ReactNode }) {
  return (
    <div className={styles.lake}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/01-play-bg.png" alt="" className={styles.lake__bg} draggable={false} />

      {/* Animated overlays — pure CSS so they cost nothing on mobile */}
      <div className={styles.lake__cloud1} aria-hidden />
      <div className={styles.lake__cloud2} aria-hidden />
      <div className={styles.lake__lightBeam} aria-hidden />
      <div className={styles.lake__sunGlow} aria-hidden />
      <div className={styles.lake__shimmer} aria-hidden />
      <LakeFishShadows />
      <div className={styles.lake__ambientRipple} aria-hidden />
      <div className={styles.lake__ambientRipple2} aria-hidden />
      <div className={styles.lake__ambientRipple3} aria-hidden />
      <div className={styles.lake__ambientRipple4} aria-hidden />

      {children}
    </div>
  );
}
