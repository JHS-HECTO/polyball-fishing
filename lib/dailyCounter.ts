const KEY = 'fishing.dailyCounter.v1';

export type DailyCounter = {
  date: string;
  casts: number;
  fishCaught: number;
};

function load(): DailyCounter | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DailyCounter;
  } catch {
    return null;
  }
}

function save(d: DailyCounter): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(d));
}

export function readDaily(today: string): DailyCounter {
  const stored = load();
  if (stored && stored.date === today) return stored;
  const fresh: DailyCounter = { date: today, casts: 0, fishCaught: 0 };
  save(fresh);
  return fresh;
}

export function incrementCast(today: string): DailyCounter {
  const d = readDaily(today);
  const next: DailyCounter = { ...d, casts: d.casts + 1 };
  save(next);
  return next;
}

export function incrementFish(today: string): DailyCounter {
  const d = readDaily(today);
  const next: DailyCounter = { ...d, fishCaught: d.fishCaught + 1 };
  save(next);
  return next;
}

export function resetIfNewDay(today: string): DailyCounter {
  return readDaily(today);
}

export function todayString(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
