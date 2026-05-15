type HapticEvent = 'bite' | 'goodHit' | 'badHit' | 'lineBreak' | 'fishCaught' | 'goldenCatch';

const PATTERNS: Record<HapticEvent, number | number[]> = {
  bite: 30,
  goodHit: 12,
  badHit: [20, 30, 20],
  lineBreak: [40, 30, 80],
  fishCaught: [30, 30, 30],
  goldenCatch: [50, 30, 50, 30, 100],
};

export function vibrate(event: HapticEvent): void {
  if (typeof navigator === 'undefined') return;
  if (typeof navigator.vibrate !== 'function') return;
  navigator.vibrate(PATTERNS[event]);
}
