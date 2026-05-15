import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  sendPlayAd,
  sendTicketReward,
  sendScoreUpdate,
  onMessage,
  type FishParentMessage,
} from 'lib/postMessage';

describe('outgoing messages', () => {
  beforeEach(() => {
    vi.spyOn(window.parent, 'postMessage').mockImplementation(() => {});
  });

  it('sendPlayAd posts FISH:PLAY_AD', () => {
    sendPlayAd();
    expect(window.parent.postMessage).toHaveBeenCalledWith({ type: 'FISH:PLAY_AD' }, '*');
  });

  it('sendTicketReward posts FISH:TICKET_REWARD with count and fish', () => {
    sendTicketReward({ count: 1, fish: 'golden' });
    expect(window.parent.postMessage).toHaveBeenCalledWith(
      { type: 'FISH:TICKET_REWARD', count: 1, fish: 'golden' },
      '*',
    );
  });

  it('sendScoreUpdate posts FISH:SCORE_UPDATE', () => {
    sendScoreUpdate(1234);
    expect(window.parent.postMessage).toHaveBeenCalledWith(
      { type: 'FISH:SCORE_UPDATE', total_score: 1234 },
      '*',
    );
  });
});

describe('incoming messages', () => {
  it('invokes handler on AD_COMPLETED', () => {
    const handler = vi.fn();
    const cleanup = onMessage(handler);
    window.dispatchEvent(
      new MessageEvent('message', { data: { type: 'FISH:AD_COMPLETED' } }),
    );
    expect(handler).toHaveBeenCalledWith({ type: 'FISH:AD_COMPLETED' } as FishParentMessage);
    cleanup();
  });

  it('ignores non-FISH messages', () => {
    const handler = vi.fn();
    const cleanup = onMessage(handler);
    window.dispatchEvent(
      new MessageEvent('message', { data: { type: 'BBADA:AD_COMPLETED' } }),
    );
    expect(handler).not.toHaveBeenCalled();
    cleanup();
  });

  it('cleanup removes listener', () => {
    const handler = vi.fn();
    const cleanup = onMessage(handler);
    cleanup();
    window.dispatchEvent(
      new MessageEvent('message', { data: { type: 'FISH:AD_COMPLETED' } }),
    );
    expect(handler).not.toHaveBeenCalled();
  });
});
