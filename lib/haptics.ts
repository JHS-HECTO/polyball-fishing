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

// Continuous low-rumble used while the player is actively pulling the line.
// Browsers cap individual vibrate() calls (most phones cut off after a few
// seconds), so we refresh the pattern on a short interval until stopRumble()
// is called. The 60ms-on / 30ms-off pattern feels like a "지이이잉" hum.
let rumbleTimer: ReturnType<typeof setInterval> | null = null;

export function startRumble(): void {
  if (typeof navigator === 'undefined') return;
  if (typeof navigator.vibrate !== 'function') return;
  if (rumbleTimer !== null) return; // already rumbling
  const tick = () => navigator.vibrate([60, 30, 60, 30, 60, 30]);
  tick();
  rumbleTimer = setInterval(tick, 240);
}

export function stopRumble(): void {
  if (rumbleTimer !== null) {
    clearInterval(rumbleTimer);
    rumbleTimer = null;
  }
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    navigator.vibrate(0);
  }
}
