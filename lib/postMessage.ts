import type { FishGrade, Player } from './types';

export type FishOutgoing =
  | { type: 'FISH:READY' }                                          // game finished loading
  | { type: 'FISH:PLAY_AD' }
  | { type: 'FISH:TICKET_REWARD'; count: number; fish: FishGrade }
  | { type: 'FISH:SCORE_UPDATE'; total_score: number };

export type FishParentMessage =
  | { type: 'FISH:SET_PLAYER'; player: Player; total_score?: number } // parent injects player info
  | { type: 'FISH:AD_COMPLETED' }
  | { type: 'FISH:AD_FAILED'; reason?: 'no_inventory' | 'user_skipped' | 'error' }
  | { type: 'FISH:TICKET_GRANTED'; count: number }
  | { type: 'FISH:TICKET_REJECTED'; reason?: 'daily_cap_reached' | 'error' };

function post(msg: FishOutgoing): void {
  if (typeof window === 'undefined') return;
  window.parent.postMessage(msg, '*');
}

export function sendPlayAd(): void {
  post({ type: 'FISH:PLAY_AD' });
}

export function sendTicketReward(payload: { count: number; fish: FishGrade }): void {
  post({ type: 'FISH:TICKET_REWARD', count: payload.count, fish: payload.fish });
}

export function sendScoreUpdate(total_score: number): void {
  post({ type: 'FISH:SCORE_UPDATE', total_score });
}

export function sendReady(): void {
  post({ type: 'FISH:READY' });
}

export function onMessage(handler: (msg: FishParentMessage) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const listener = (ev: MessageEvent) => {
    const data = ev.data as { type?: string } | null;
    if (!data || typeof data.type !== 'string') return;
    if (!data.type.startsWith('FISH:')) return;
    handler(data as FishParentMessage);
  };
  window.addEventListener('message', listener);
  return () => window.removeEventListener('message', listener);
}
