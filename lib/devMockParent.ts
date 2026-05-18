// When the game runs standalone (no polyball iframe wrapper), there's no
// parent to respond to FISH:PLAY_AD / CLAIM_TICKET / TICKET_REWARD messages.
// This mock listens to messages the game posts to `window.parent` and simulates
// the parent flow so the UI flow can be QA'd on Vercel without integration.
//
// Activates automatically when `window.parent === window` (standalone) and the
// page has been mounted. Production polyball iframe will have a real parent so
// the mock is inert.

let installed = false;

type FishMsg = {
  type: string;
  count?: number;
  reason?: string;
  source?: string;
  adWatched?: boolean;
  fish?: string;
  player?: unknown;
  total_score?: number;
};

function post(msg: FishMsg, delayMs: number): void {
  setTimeout(() => {
    window.dispatchEvent(new MessageEvent('message', { data: msg }));
  }, delayMs);
}

export function installDevMockParent(): void {
  if (typeof window === 'undefined') return;
  if (installed) return;
  // Real polyball wrapper: parent !== window.
  if (window.parent !== window) return;
  installed = true;

  const originalPost = window.parent.postMessage.bind(window.parent);
  // Patch postMessage so we can intercept outgoing FISH:* without producing
  // an infinite loop (otherwise our own dispatchEvent below would be picked
  // up by listeners we want to call but ALSO by us as a new postMessage).
  window.parent.postMessage = ((data: unknown, targetOrigin?: string, transfer?: Transferable[]) => {
    originalPost(data as never, targetOrigin as never, transfer as never);
    handleOutgoing(data);
  }) as typeof window.parent.postMessage;

  // eslint-disable-next-line no-console
  console.info('[dev-mock] standalone parent mock installed');
}

function handleOutgoing(raw: unknown): void {
  const msg = raw as FishMsg | null;
  if (!msg || typeof msg.type !== 'string') return;
  if (!msg.type.startsWith('FISH:')) return;

  switch (msg.type) {
    case 'FISH:READY':
      // Optionally inject a default player so the HUD shows something.
      post({
        type: 'FISH:SET_PLAYER',
        player: { nickname: '테스터', team: 'kia' },
        total_score: 0,
      }, 100);
      break;

    case 'FISH:PLAY_AD':
      // Interstitial — pretend ad ran successfully.
      post({ type: 'FISH:AD_COMPLETED' }, 1500);
      break;

    case 'FISH:PLAY_AD_REWARDED':
      // Rewarded — simulate the user fully watching the ad.
      post({ type: 'FISH:AD_REWARDED_COMPLETED', reason: msg.reason }, 1500);
      break;

    case 'FISH:CLAIM_TICKET':
      post({ type: 'FISH:TICKET_GRANTED', count: 1, source: msg.source }, 300);
      break;

    case 'FISH:TICKET_REWARD':
      // Legacy auto-reward flow (still emitted for golden when ad gating off)
      post({ type: 'FISH:TICKET_GRANTED', count: msg.count ?? 1 }, 300);
      break;

    default:
      // SCORE_UPDATE etc. — no response needed.
      break;
  }
}
