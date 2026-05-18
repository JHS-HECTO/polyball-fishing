'use client';

import { useEffect } from 'react';
import { useGameStore } from './gameState';
import { todayString } from './dailyCounter';

// Polls every minute, on focus, and on tab-visibility change. When the local
// date string changes (i.e. crossed midnight), runs syncDailyState which
// resets ticketsClaimedToday and progressScore for the new day.
export function useDailyResetSync(): void {
  useEffect(() => {
    const check = () => {
      const today = todayString();
      const state = useGameStore.getState();
      if (state.ticketsDate !== today) {
        state.syncDailyState(today);
      }
    };

    // Initial sync
    check();

    // Poll every minute — cheap, catches midnight crossings reliably even if
    // the user keeps the tab open all day.
    const id = setInterval(check, 60_000);

    // Recheck on visibility change and focus (phone unlock, tab switch).
    const onVisibility = () => {
      if (document.visibilityState === 'visible') check();
    };
    window.addEventListener('focus', check);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(id);
      window.removeEventListener('focus', check);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
}
