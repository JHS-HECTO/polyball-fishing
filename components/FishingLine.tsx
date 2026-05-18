'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './FishingLine.module.scss';

type Props = {
  visible: boolean;
  /** CSS selector for the rod-tip anchor (typically the angler container). */
  fromSelector?: string;
  /** CSS selector for the bobber anchor. */
  toSelector?: string;
};

// Measures the actual rendered positions of the rod-tip and bobber elements
// each animation frame and stretches an SVG <line> between them so the line
// stays attached even as the bobber animates.
export function FishingLine({
  visible,
  fromSelector = '[data-anchor="rod-tip"]',
  toSelector = '[data-anchor="bobber"]',
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [coords, setCoords] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  useEffect(() => {
    if (!visible) return;
    let rafId = 0;
    const measure = () => {
      const a = document.querySelector(fromSelector);
      const b = document.querySelector(toSelector);
      const svg = svgRef.current;
      if (a && b && svg) {
        const ar = a.getBoundingClientRect();
        const br = b.getBoundingClientRect();
        const host = svg.getBoundingClientRect();
        // Rod tip is roughly at the top of the angler container, slightly
        // right of horizontal center (the rod extends up-right from the hand).
        const x1 = ar.left + ar.width * 0.62 - host.left;
        const y1 = ar.top + ar.height * 0.18 - host.top;
        const x2 = br.left + br.width / 2 - host.left;
        const y2 = br.top + br.height / 2 - host.top;
        setCoords({ x1, y1, x2, y2 });
      }
      rafId = requestAnimationFrame(measure);
    };
    rafId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(rafId);
  }, [visible, fromSelector, toSelector]);

  if (!visible) return null;

  return (
    <svg ref={svgRef} className={styles.line} aria-hidden>
      {coords && (
        <line
          x1={coords.x1}
          y1={coords.y1}
          x2={coords.x2}
          y2={coords.y2}
          stroke="rgba(255, 255, 255, 0.95)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}
