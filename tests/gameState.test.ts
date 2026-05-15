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

  it('tracks adsTillNext counter', () => {
    expect(useGameStore.getState().castsSinceAd).toBe(0);
    useGameStore.getState().bumpCastsSinceAd();
    useGameStore.getState().bumpCastsSinceAd();
    expect(useGameStore.getState().castsSinceAd).toBe(2);
  });

  it('resets castsSinceAd', () => {
    useGameStore.getState().bumpCastsSinceAd();
    useGameStore.getState().resetCastsSinceAd();
    expect(useGameStore.getState().castsSinceAd).toBe(0);
  });
});
