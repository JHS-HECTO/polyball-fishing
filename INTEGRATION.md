# 🛠 개발팀 통합 가이드 (응모권 낚시하기 → 폴리볼)

폴리볼 측에서 작업해야 할 부분 일괄 정리. 야구빠따 키우기와 동일한 통합 패턴 + 본 게임 고유 변경점 반영.

---

## 🚨 0. 유저 식별 — 대전제

게임은 **유저를 식별하지 않습니다**. 모든 유저별 정책(일일 응모권 cap, 적립)은 **폴리볼이 식별 + 검증**.

| 항목 | 게임 | 폴리볼 |
|---|---|---|
| 누가 플레이 중 | ❌ | ✅ 세션으로 식별 |
| 오늘 응모권 몇 장 받았는지 | ⚠️ localStorage 표시용 | ✅ 서버 DB 권위 |
| 광고 시청 가능 여부 | ❌ | ✅ 광고 SDK 호출 |
| 응모권 적립 대상 | ❌ | ✅ 현재 로그인 user에 적립 |
| 닉네임/팀 정보 | ❌ (postMessage로 받음) | ✅ 게임 진입시 inject |

### 폴리볼이 반드시 해야 할 것

**1) 일일 응모권 cap = 3장 (서버 권위)**
- `FISH:CLAIM_TICKET` 받기 전 `tickets_today` 카운터 검증
- ≥3 이면 `FISH:TICKET_REJECTED` 응답
- 자정 기준 자동 리셋

**2) 광고 호출 (rewarded 만)**
- `FISH:PLAY_AD_REWARDED` 받으면 보상형 광고 SDK 호출
- 완료 → `FISH:AD_REWARDED_COMPLETED { reason }`
- 실패/스킵 → `FISH:AD_REWARDED_FAILED { reason }`
- **인터스티셜은 사용하지 않음** (게임 진행 방해 X). 자동 광고 호출 없음.

**3) 게임 진입시 플레이어 정보 inject**
- 게임이 `FISH:READY` 송신 → 폴리볼이 `FISH:SET_PLAYER` 응답 (닉/팀 + 현재 누적 점수)
- 게임은 받은 정보를 HUD에 표시
- 없어도 게임은 동작 (HUD에 "익명"으로 표시)

**4) PIPA 동의 처리**
- 폴리볼 앱 진입 시점에 한 번만. 게임 내부엔 동의 화면 없음.
- 미동의 유저는 게임 진입 차단.

---

## 📡 1. 메시지 프로토콜 (FISH:*)

게임은 iframe으로 임베드. `window.parent.postMessage({...}, '*')` 로 통신.

### 1-1. 게임 준비 완료

**게임 → 부모:**
```js
{ type: 'FISH:READY' }
```

**부모 → 게임 (선택):**
```js
{
  type: 'FISH:SET_PLAYER',
  player: { nickname: '낚시왕초보', team: 'doosan' },
  total_score: 12500   // 선택, HUD 초기값
}
```

### 1-2. 응모권 클레임 — 게이지 채워서 받기 (`source: 'progress'`)

**1번째 (무료):**

게임 → 부모:
```js
{ type: 'FISH:CLAIM_TICKET', source: 'progress', adWatched: false }
```

부모 → 게임:
```js
{ type: 'FISH:TICKET_GRANTED', count: 1, source: 'progress' }
// 또는
{ type: 'FISH:TICKET_REJECTED', reason: 'daily_cap_reached' | 'error' }
```

**2~3번째 (광고 시청 후):**

게임 → 부모 (1차: 광고 요청):
```js
{ type: 'FISH:PLAY_AD_REWARDED', reason: 'progress' }
```

부모 → 게임 (광고 SDK 호출 후):
```js
{ type: 'FISH:AD_REWARDED_COMPLETED', reason: 'progress' }
// 또는
{ type: 'FISH:AD_REWARDED_FAILED', reason: 'progress', cause: 'user_skipped' | 'no_inventory' | 'error' }
```

게임은 `AD_REWARDED_COMPLETED` 받으면 자동으로 클레임 송신:
```js
{ type: 'FISH:CLAIM_TICKET', source: 'progress', adWatched: true }
```

서버 응답:
```js
{ type: 'FISH:TICKET_GRANTED', count: 1, source: 'progress' }
```

### 1-3. 응모권 클레임 — 황금물고기 잡음 (`source: 'golden'`)

황금물고기 잡힘 → 게임 측 모달 `"광고 보고 응모권 받기"` 노출. 사용자가 동의시:

게임 → 부모:
```js
{ type: 'FISH:PLAY_AD_REWARDED', reason: 'golden' }
```

부모 → 게임:
```js
{ type: 'FISH:AD_REWARDED_COMPLETED', reason: 'golden' }
```

게임 자동 송신:
```js
{ type: 'FISH:CLAIM_TICKET', source: 'golden', adWatched: true }
```

부모 → 게임:
```js
{ type: 'FISH:TICKET_GRANTED', count: 1, source: 'golden' }
```

**황금 클레임의 특수성:**
- 황금물고기는 등장 자체가 희귀 (0.5%) — 자연스러운 제한
- 단, 일일 cap 3장은 동일하게 적용 (progress + golden 합산)
- 사용자가 "다음에 받기" 선택 시 광고/클레임 둘 다 발생 X

### 1-4. 점수 갱신 (선택)

**게임 → 부모:**
```js
{ type: 'FISH:SCORE_UPDATE', total_score: 12345 }
```

매 캐스팅 잡힘 후 호출. 폴리볼이 백엔드 DB upsert. 게임은 응답 불요.

### 1-5. 전체 메시지 타입 표

| 방향 | 메시지 | 의미 |
|---|---|---|
| → 부모 | `FISH:READY` | 게임 마운트 완료 |
| → 부모 | `FISH:CLAIM_TICKET` | 응모권 발급 요청 (`source`, `adWatched`) |
| → 부모 | `FISH:PLAY_AD_REWARDED` | 보상형 광고 요청 (`reason`) |
| → 부모 | `FISH:SCORE_UPDATE` | 누적 점수 갱신 |
| ← 부모 | `FISH:SET_PLAYER` | 플레이어 정보 주입 |
| ← 부모 | `FISH:AD_REWARDED_COMPLETED` | 광고 시청 완료 |
| ← 부모 | `FISH:AD_REWARDED_FAILED` | 광고 시청 실패 |
| ← 부모 | `FISH:TICKET_GRANTED` | 응모권 적립 완료 |
| ← 부모 | `FISH:TICKET_REJECTED` | 응모권 적립 거부 (cap 초과 등) |

> 게임은 `FISH:CLAIM_TICKET` 또는 `FISH:PLAY_AD_REWARDED` 송신 후 1.5초 응답 없으면 UI 잠금 해제 (사용자 다시 시도 가능).

---

## 🗂 2. 서버 DB 권장 스키마

```sql
CREATE TABLE fishing_tickets_daily (
  user_id      BIGINT,
  date         DATE,
  tickets_today INT NOT NULL DEFAULT 0,  -- 0~3
  golden_caught INT NOT NULL DEFAULT 0,  -- 통계용
  progress_claimed INT NOT NULL DEFAULT 0,  -- 통계용
  PRIMARY KEY (user_id, date)
);

CREATE TABLE fishing_scores (
  user_id     BIGINT PRIMARY KEY,
  total_score BIGINT NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
```

자정 리셋은 `date` 키로 자연스럽게 처리. 별도 cron 불필요.

---

## 🎯 3. cap 처리 로직 (의사 코드)

```ts
function handleClaimTicket(userId, source, adWatched) {
  const today = today();
  const daily = db.get(`fishing_tickets_daily`, userId, today);
  const ticketsToday = daily?.tickets_today ?? 0;

  if (ticketsToday >= 3) {
    return { type: 'FISH:TICKET_REJECTED', reason: 'daily_cap_reached' };
  }

  // 2번째/3번째 progress 클레임은 광고 시청 필수
  if (source === 'progress' && ticketsToday >= 1 && !adWatched) {
    return { type: 'FISH:TICKET_REJECTED', reason: 'ad_required' };
  }

  // 황금 클레임도 광고 시청 필수
  if (source === 'golden' && !adWatched) {
    return { type: 'FISH:TICKET_REJECTED', reason: 'ad_required' };
  }

  // 응모권 적립
  db.incr(`fishing_tickets_daily`, userId, today, { tickets_today: 1, [source === 'golden' ? 'golden_caught' : 'progress_claimed']: 1 });
  grantTicket(userId, 1);

  return { type: 'FISH:TICKET_GRANTED', count: 1, source };
}
```

---

## ⚙️ 4. 통합 체크리스트

게임 측은 완료. 폴리볼 측 작업 항목:

- [ ] 게임 iframe 임베드 (실험실 메뉴)
- [ ] `FISH:READY` 핸들러 → `FISH:SET_PLAYER` 자동 응답 (현재 로그인 유저 닉/팀/누적점수)
- [ ] `FISH:PLAY_AD_REWARDED` 핸들러 + 광고 SDK 호출 → `FISH:AD_REWARDED_COMPLETED` / `FAILED` 응답
- [ ] `FISH:CLAIM_TICKET` 핸들러 + cap(3장/일) 검증 + DB 적립 → `FISH:TICKET_GRANTED` / `REJECTED` 응답
- [ ] `FISH:SCORE_UPDATE` 핸들러 + 점수 누적 (선택)
- [ ] PIPA 동의 게이트 (폴리볼 앱 진입 단계)
- [ ] 만 14세 미만 처리 (정책팀 협의)

---

## 🧪 5. 표준 테스트 시나리오

1. **무료 클레임**: 게이지 채움 → "응모권 받기" 탭 → 광고 X → 즉시 1장 적립
2. **광고 후 클레임**: 1장 적립된 상태에서 게이지 채움 → "광고 보고 응모권 받기" 탭 → 광고 시청 → 1장 추가 적립
3. **cap 초과 시도**: 3장 적립 후 게이지 100% → 버튼 "황금 물고기를 노려보세요" (비활성)
4. **황금 잡힘**: 황금물고기 잡힘 → 모달 "광고 보고 응모권 받기" → 광고 → 응모권 1장 지급
5. **cap 초과 황금**: 이미 3장 받은 상태에서 황금 잡힘 → 모달 노출 → 광고 후 `TICKET_REJECTED` → 게임 측 모달은 점수만 부여, 응모권 없음 표시
6. **자정 리셋**: 자정 지나면 카운터 + 게이지 자동 0으로 리셋

---

## 📦 6. 게임 환경

- Next.js 16.1.6 (Turbopack)
- React 19.2.3
- TypeScript strict
- pnpm 빌드 (`pnpm install` → `pnpm build` → `pnpm start`)
- Vercel 자동 배포 (현재 https://polyball-fishing.vercel.app)
- iframe 임베드 가능 (CORS/X-Frame-Options 따로 설정 불요 — 정적 Next 빌드)

문의: 게임 측 코드 GitHub https://github.com/JHS-HECTO/polyball-fishing
