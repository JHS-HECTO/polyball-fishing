'use client';

import styles from './FishingLine.module.scss';

type Props = {
  visible: boolean;
};

// Subtle line drawn from the rod tip (approximated above the centered angler)
// down to the bobber's rest position. Shown only when the bobber is on the
// water (floating/bite). Uses an SVG line so we can use a dashed stroke and
// soft drop-shadow that match the AC-cozy tone.
//
// Coordinates are in viewport-percent so they track resize. Tuned for the
// centered angler + bobber positioned at top: 47vh / left: 50% (+0.5rem).
export function FishingLine({ visible }: Props) {
  if (!visible) return null;
  return (
    <svg
      className={styles.line}
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      aria-hidden
    >
      {/* Rod tip is roughly above & slightly right of the angler's head.
          Angler centered, height 22rem with bottom 9vh — head sits around y ~73vh.
          Rod extends up-right, tip approx (58vw, 65vh). */}
      <line
        x1="58"
        y1="65"
        x2="50.6"
        y2="47"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="0.3"
        strokeDasharray="0.6 0.6"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
