import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player } from './types';

type GameState = {
  player: Player | null;
  totalScore: number;
  castsSinceAd: number;
};

type GameActions = {
  registerPlayer: (p: Player) => void;
  addScore: (delta: number) => void;
  setTotalScore: (n: number) => void;
  bumpCastsSinceAd: () => void;
  resetCastsSinceAd: () => void;
};

const initial: GameState = {
  player: null,
  totalScore: 0,
  castsSinceAd: 0,
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
    }),
    {
      name: 'fishing.gameState.v1',
      partialize: (s) => ({ player: s.player, totalScore: s.totalScore }),
    },
  ),
);
