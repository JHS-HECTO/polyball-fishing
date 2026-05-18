import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from 'lib/gameState';

beforeEach(() => {
  useGameStore.setState(useGameStore.getInitialState());
  localStorage.clear();
});

describe('game store', () => {
  it('starts with no player', () => {
    expect(useGameStore.getState().player).toBeNull();
  });

  it('registers player', () => {
    useGameStore.getState().registerPlayer({ nickname: '낚시왕', team: 'kia' });
    const state = useGameStore.getState();
    expect(state.player?.nickname).toBe('낚시왕');
    expect(state.player?.team).toBe('kia');
  });

  it('accumulates total score', () => {
    useGameStore.getState().addScore(100);
    useGameStore.getState().addScore(50);
    expect(useGameStore.getState().totalScore).toBe(150);
  });

  it('bumps progress score', () => {
    useGameStore.getState().bumpProgress(300);
    useGameStore.getState().bumpProgress(500);
    expect(useGameStore.getState().progressScore).toBe(800);
  });

  it('registers a ticket claim and resets progress', () => {
    useGameStore.getState().bumpProgress(1000);
    useGameStore.getState().registerTicketClaimed();
    expect(useGameStore.getState().ticketsClaimedToday).toBe(1);
    expect(useGameStore.getState().progressScore).toBe(0);
  });

  it('resets daily counters when the date changes', () => {
    useGameStore.getState().syncDailyState('2026-05-18');
    useGameStore.getState().registerTicketClaimed();
    useGameStore.getState().syncDailyState('2026-05-19');
    expect(useGameStore.getState().ticketsClaimedToday).toBe(0);
    expect(useGameStore.getState().progressScore).toBe(0);
  });
});
