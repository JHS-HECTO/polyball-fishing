# 🛠 개발팀 통합 가이드 (응모권 낚시하기 → 폴리볼)

폴리볼 측에서 작업해야 할 부분 일괄 정리. 야구빠따 키우기와 동일한 통합 패턴 + 본 게임 고유 변경점 반영.

---

## 🚨 0. 유저 식별 — 대전제

게임은 **유저를 식별하지 않습니다**. 모든 유저별 정책(일일 황금 cap, 응모권 적립, 리더보드 기록)은 **폴리볼이 식별 + 검증**.

### 게임이 모르는 것 / 폴리볼이 해야 할 것

| 항목 | 게임 | 폴리볼 |
|---|---|---|
| 누가 플레이 중 | ❌ | ✅ 세션으로 식별 |
| 오늘 황금 몇 마리 잡았는지 | ❌ | ✅ 서버 DB `golden_today` 카운터 |
| 광고 노출 가능 여부 | ❌ | ✅ 광고 SDK 호출 |
| 응모권 적립 대상 | ❌ | ✅ 현재 로그인 user에 적립 |
| 리더보드 본인 식별 | ❌ | ✅ `user_id` 매칭 |

### 폴리볼이 반드시 해야 할 것

**1) 일일 황금 cap = 3마리 (서버 권위)**
- `FISH:TICKET_REWARD` 메시지 받기 전에 `golden_today` 카운터 검증
- ≥3 이면 적립 거부 → `FISH:TICKET_REJECTED` 응답
- 자정 기준 자동 리셋

**2) 광고 호출**
- `FISH:PLAY_AD` 받으면 광고 SDK 호출
- 성공 → `FISH:AD_COMPLETED`, 실패 → `FISH:AD_FAILED`
- 5캐스팅마다 자동 발생하는 인터스티셜만 사용 (rewarded 별도 없음)

**3) PIPA 동의 처리**
- 첫 진입시 미동의 유저 차단
- 야구빠따와 동일 패턴

**4) 점수 / 리더보드 API**
- 점수 누적: 캐스팅 결과마다 POST. 게임은 user_id 없음 → 세션에서 부착.
- 리더보드 GET: 본인 row에 `user_id: 'me'` 등 식별 키 채워서 반환

---

## 📡 1. 메시지 프로토콜

게임은 iframe으로 임베드되며 `window.parent.postMessage` 로 부모와 통신.

### 1-1. 인터스티셜 광고 (5캐스팅마다)

**게임 → 부모:**
```js
{ type: 'FISH:PLAY_AD' }
```

**부모 → 게임:**
```js
{ type: 'FISH:AD_COMPLETED' }
// 또는
{ type: 'FISH:AD_FAILED', reason: 'no_inventory' | 'user_skipped' | 'error' }
```

### 1-2. 황금물고기 응모권 지급

**게임 → 부모:**
```js
{ type: 'FISH:TICKET_REWARD', count: 1, fish: 'golden' }
```

**부모 → 게임:**
```js
{ type: 'FISH:TICKET_GRANTED', count: 1 }
// 또는 (일일 cap 초과)
{ type: 'FISH:TICKET_REJECTED', reason: 'daily_cap_reached' }
```

> 게임은 1.5초 타임아웃 후 응답 없으면 `REJECTED`로 간주(응모권 모달 X, 점수만 부여).

### 1-3. 점수 갱신 (선택)

**게임 → 부모:**
```js
{ type: 'FISH:SCORE_UPDATE', total_score: 12345 }
```

부모가 받아 백엔드 POST 호출 + DB upsert.

---

## 📊 2. 리더보드 API

### 2-1. 정렬 규칙

```sql
ORDER BY total_score DESC, created_at DESC
```

### 2-2. 엔드포인트

| 메서드 | 경로 | 용도 |
|---|---|---|
| GET  | `/api/fishing/leaderboard` | 상위 N명 + 본인 row |
| POST | `/api/fishing/score` | 점수 갱신 |

### 2-3. POST body

```json
{ "delta_score": 100, "fish_grade": "rare" }
```

서버: `user_id` 자동 부착, `total_score += delta_score` upsert. 응답에 갱신 후 total_score 반환.

### 2-4. GET 응답

```json
{
  "entries": [
    { "rank": 1, "nickname": "강태공", "team": "kia", "total_score": 28450, "golden_count": 12, "created_at": "2026-05-10T09:30:00Z" }
  ],
  "me": { "rank": 42, "user_id": "me", "nickname": "낚시왕초보", "team": "doosan", "total_score": 350, "golden_count": 0, "created_at": "..." }
}
```

`me`는 현재 로그인 유저 자동 매칭. 게임은 본인 row를 노란/금색 하이라이트.

---

## 🗂 3. 서버 DB 권장 스키마

```sql
CREATE TABLE fishing_scores (
  user_id     BIGINT PRIMARY KEY,
  nickname    VARCHAR(20) NOT NULL,
  team        VARCHAR(20) NOT NULL,
  total_score BIGINT NOT NULL DEFAULT 0,
  golden_count INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE fishing_daily (
  user_id      BIGINT,
  date         DATE,
  golden_today INT NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, date)
);

CREATE INDEX fishing_scores_total ON fishing_scores (total_score DESC, created_at DESC);
```

자정 리셋은 별도 cron 없이 `date` 키로 자연스럽게 처리.

---

## ⚙️ 4. 통합 체크리스트

게임 측은 완료. 폴리볼 측 작업 항목:

- [ ] 게임 iframe 임베드 (실험실 메뉴)
- [ ] `FISH:PLAY_AD` 핸들러 + 광고 SDK 호출
- [ ] `FISH:TICKET_REWARD` 핸들러 + cap 검증 + DB 적립
- [ ] `FISH:SCORE_UPDATE` 핸들러 + 점수 누적 API 호출
- [ ] `/api/fishing/leaderboard` GET (정렬 + me 매칭)
- [ ] `/api/fishing/score` POST (upsert)
- [ ] PIPA 동의 게이트 (첫 진입)
- [ ] 만 14세 미만 처리 (정책팀 협의)
