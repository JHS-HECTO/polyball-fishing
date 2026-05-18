import type { FishGrade, Player } from './types';

export type TicketSource = 'progress' | 'golden';

export type FishOutgoing =
  | { type: 'FISH:READY' }
  | { type: 'FISH:PLAY_AD' }                                          // interstitial
  | { type: 'FISH:PLAY_AD_REWARDED'; reason: TicketSource }            // rewarded ad request
  | { type: 'FISH:CLAIM_TICKET'; source: TicketSource; adWatched: boolean }
  // Kept for backward compatibility — legacy flow that auto-rewards on golden catch.
  | { type: 'FISH:TICKET_REWARD'; count: number; fish: FishGrade }
  | { type: 'FISH:SCORE_UPDATE'; total_score: number };

export type FishParentMessage =
  | { type: 'FISH:SET_PLAYER'; player: Player; total_score?: number }
  | { type: 'FISH:AD_COMPLETED' }
  | { type: 'FISH:AD_FAILED'; reason?: 'no_inventory' | 'user_skipped' | 'error' }
  | { type: 'FISH:AD_REWARDED_COMPLETED'; reason: TicketSource }       // ad fully watched
  | { type: 'FISH:AD_REWARDED_FAILED'; reason: TicketSource; cause?: 'user_skipped' | 'no_inventory' | 'error' }
  | { type: 'FISH:TICKET_GRANTED'; count: number; source?: TicketSource }
  | { type: 'FISH:TICKET_REJECTED'; reason?: 'daily_cap_reached' | 'error' };

function post(msg: FishOutgoing): void {
  if (typeof window === 'undefined') return;
  window.parent.postMessage(msg, '*');
}

export function sendPlayAd(): void {
  post({ type: 'FISH:PLAY_AD' });
}

export function sendPlayAdRewarded(reason: TicketSource): void {
  post({ type: 'FISH:PLAY_AD_REWARDED', reason });
}

export function sendClaimTicket(source: TicketSource, adWatched: boolean): void {
  post({ type: 'FISH:CLAIM_TICKET', source, adWatched });
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
