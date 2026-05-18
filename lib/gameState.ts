import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player } from './types';

// Score the bar must reach before the player can claim a ticket.
export const PROGRESS_TARGET = 1000;
// Max tickets the player can claim per day.
export const TICKETS_PER_DAY = 3;

type GameState = {
  player: Player | null;
  totalScore: number;
  castsSinceAd: number;
  // Progress bar that fills with score deltas until PROGRESS_TARGET; resets on claim.
  progressScore: number;
  // Tickets claimed today (display only — server is authoritative for grant).
  ticketsClaimedToday: number;
  // Last date the ticket counter was active (YYYY-MM-DD). Used to reset at midnight.
  ticketsDate: string;
};

type GameActions = {
  registerPlayer: (p: Player) => void;
  addScore: (delta: number) => void;
  setTotalScore: (n: number) => void;
  bumpCastsSinceAd: () => void;
  resetCastsSinceAd: () => void;
  bumpProgress: (delta: number) => void;
  // Called after server confirms ticket granted — increments counter, resets progress.
  registerTicketClaimed: () => void;
  // Reset daily counter if it's a new day.
  syncDailyState: (today: string) => void;
};

const initial: GameState = {
  player: null,
  totalScore: 0,
  castsSinceAd: 0,
  progressScore: 0,
  ticketsClaimedToday: 0,
  ticketsDate: '',
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set) => ({
      ...initial,
      registerPlayer: (p) => set({ player: p }),
      addScore: (delta) => set((s) => ({ totalScore: s.totalScore + delta })),
      setTotalScore: (n) => set({ totalScore: n }),
      bumpCastsSinceAd: () => set((s) => ({ castsSinceAd: s.castsSinceAd + 1 })),
      resetCastsSinceAd: () => set({ castsSinceAd: 0 }),
      bumpProgress: (delta) =>
        set((s) => ({ progressScore: Math.min(PROGRESS_TARGET, s.progressScore + delta) })),
      registerTicketClaimed: () =>
        set((s) => ({
          ticketsClaimedToday: s.ticketsClaimedToday + 1,
          progressScore: 0,
        })),
      syncDailyState: (today) =>
        set((s) => {
          if (s.ticketsDate === today) return s;
          return { ticketsDate: today, ticketsClaimedToday: 0, progressScore: 0 };
        }),
    }),
    {
      name: 'fishing.gameState.v1',
      partialize: (s) => ({
        player: s.player,
        totalScore: s.totalScore,
        progressScore: s.progressScore,
        ticketsClaimedToday: s.ticketsClaimedToday,
        ticketsDate: s.ticketsDate,
      }),
    },
  ),
);
