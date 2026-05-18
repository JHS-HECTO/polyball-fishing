# 🎣 응모권 낚시하기 (Polyball Fishing)

폴리볼 실험실 미니게임. 캐스팅 → 챔질 → 파이팅 → 응모권 획득.

라이브 데모: **https://polyball-fishing.vercel.app**

---

## 🛠 기술 스택

| 영역 | 기술 |
|---|---|
| 프레임워크 | Next.js 16.1.6 (App Router) + React 19.2.3 |
| 언어 | TypeScript strict (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) |
| 스타일 | SCSS Modules (Tailwind 미사용) |
| 상태 | zustand (persist) |
| 애니메이션 | framer-motion + CSS keyframes + GSAP (설치만, 추후 확장용) |
| 테스트 | vitest + @testing-library/react |
| 배포 | Vercel (master 푸시 자동 배포) |
| 패키지 관리 | pnpm |

---

## 🚀 빠른 시작

```bash
pnpm install
pnpm dev       # http://localhost:3000
pnpm test      # 단위 테스트
pnpm build     # 프로덕션 빌드
```

자정 자동 리셋 검증: 로컬에서 `localStorage` 의 `fishing.gameState.v1.ticketsDate` 수정 후 새로고침.

---

## 🎮 게임 정책

- **일일 캐스팅 횟수**: 무제한
- **응모권 일일 cap**: 3장
  - 1번째: 게이지 채우면 무료
  - 2~3번째: 게이지 채우고 광고 시청 후
  - 4장 이상: 자동 불가 (cap 도달시 "황금 물고기를 노려보세요" 안내)
- **황금물고기 잡힘**: 광고 시청시 추가 응모권 1장 (cap 3장 안에서)
- **자정 리셋**: 카운터 + 게이지 자동 0으로 (`useDailyResetSync` 훅)

### 점수 시스템

| 등급 | 출현 | 점수 |
|---|---|---|
| 잡어 | 50% | 10 |
| 일반 | 30% | 30 |
| 희귀 | 15% | 100 |
| 대물 | 4.5% | 500 |
| 황금 | 0.5% | 2000 |

게이지 목표: **2000점** (≈ 100~135 캐스팅, ~20분 액티브 플레이)

### 파이팅 메커닉

- 챔질 윈도우 1700ms (입질 후 탭)
- 가상 조이스틱 좌우 드래그 — **물고기 반대 방향** 으로 끌어야 진행도 차오름
- 텐션 미터 100% 도달시 줄 끊김 (실패)
- Tug 이벤트: 등급별 주기로 발생, 진행도 ↓ + 텐션 ↑

---

## 📁 프로젝트 구조

```
polyball-fishing/
├── app/
│   ├── page.tsx              # 시작화면 (타이틀 + 응모권 게이지 + CTA)
│   ├── play/page.tsx         # 메인 게임 페이지
│   ├── qa/page.tsx           # QA 갤러리 (모든 컴포넌트 상태)
│   ├── layout.tsx            # 루트 레이아웃 (appFrame)
│   └── globals.scss          # 글로벌 토큰
├── components/
│   ├── Lake.tsx              # 호수 배경 (구름/햇빛/그림자 물고기 등)
│   ├── Angler.tsx            # 낚시꾼 캐릭터 (뒷모습)
│   ├── Bobber.tsx            # 찌 (캐스팅 arc + 부유 + 입질)
│   ├── FishingLine.tsx       # 낚시줄 SVG (rod tip ↔ bobber 트래킹)
│   ├── Splash.tsx            # 캐스팅 splash 효과
│   ├── CatchSequence.tsx     # 잡힘 시 fish 점프 연출
│   ├── CastButton.tsx        # 캐스팅/챔질 버튼 (황금 게임 스타일)
│   ├── TicketProgress.tsx    # 응모권 게이지 + 카운터 + 클레임 버튼
│   ├── TicketClaimedModal.tsx # 응모권 지급 완료 팝업
│   ├── ResultModal.tsx       # 결과 모달 (잡힘/도망/끊김)
│   ├── GoldenRewardModal.tsx # 황금 광고 권유 + 지급 완료
│   ├── LakeFishShadows.tsx   # 호수 안 물고기 그림자 swim
│   └── Fight/
│       ├── FightOverlay.tsx  # 파이팅 화면 메인 (RAF 게임 루프)
│       ├── Joystick.tsx      # 드래그 조이스틱 (pointer + touch)
│       ├── TensionMeter.tsx  # 긴장도 미터
│       └── FishSilhouette.tsx # 물고기 그림자 (등급별 크기)
├── lib/
│   ├── types.ts              # FishGrade, FishSpecies 등
│   ├── fish.ts               # rollGrade, pickSpecies, gradeConfig
│   ├── tension.ts            # 텐션 계산 함수
│   ├── dailyCounter.ts       # 로컬 카운터 (캐스팅/잡힘 수)
│   ├── gameState.ts          # zustand store (player, score, tickets, progress)
│   ├── routes.ts             # ROUTES 상수
│   ├── teams.ts              # KBO 10팀
│   ├── postMessage.ts        # FISH:* 프로토콜
│   ├── devMockParent.ts      # 스탠드얼론 mock parent (개발/QA용)
│   ├── useDailyResetSync.ts  # 자정 리셋 훅
│   └── haptics.ts            # 진동 패턴
├── data/
│   ├── fish.json             # 등급별 파라미터 (확률, 점수, stamina, tension)
│   └── messages.json         # 결과 멘트
├── public/images/
│   ├── 01-title-bg.png       # 타이틀 풀스크린 배경
│   ├── 01-play-bg.png        # 게임 배경
│   ├── 02-angler.png         # 캐릭터 뒷모습
│   ├── 03~14-*.png           # 물고기 5등급 12종 + 황금
│   ├── 15-ticket.png         # 응모권
│   ├── 16-bobber.png         # 찌
│   ├── 17-splash.png         # 물 splash
│   ├── 18-sparkle.png        # 황금 반짝임
│   └── 22-fight-bg.png       # 파이팅 화면 배경
├── scripts/
│   └── remove-bg.py          # 이미지 누끼 (rembg)
├── tests/                    # vitest
├── INTEGRATION.md            # ★ 폴리볼 통합 명세
├── Gemini_프롬프트_FISH_전체.md  # 이미지 생성 프롬프트
├── package.json
└── tsconfig.json
```

---

## 🔌 폴리볼 통합

상세는 [INTEGRATION.md](./INTEGRATION.md) 참조. 핵심 요약:

- 게임은 iframe 임베드 + `postMessage` 통신
- 메시지 prefix `FISH:*`
- 폴리볼이 처리: 광고 SDK, 응모권 cap 검증, 점수 누적, 플레이어 정보 inject
- 게임 측은 완료. 폴리볼 측 핸들러 5개만 작성하면 통합 끝.

### 스탠드얼론 테스트 (Vercel 배포 단독)

`lib/devMockParent.ts` 가 `window.parent === window` 감지시 자동 활성. 모든 FISH:* 메시지를 자동으로 시뮬레이션 응답. iframe 임베드 환경에서는 비활성화됨.

---

## 🎨 자산 / 이미지 생성

[Gemini_프롬프트_FISH_전체.md](./Gemini_프롬프트_FISH_전체.md) 참고하여 Gemini Imagen 생성. 결과 PNG는 `public/images/` 아래 배치.

배경 제거 (workflow):
```bash
python scripts/remove-bg.py     # rembg로 모든 스프라이트 누끼 (풀스크린 bg 제외)
```

워터마크 패치 (Gemini 우하단 워터마크 mirror inpaint):
```bash
python -c "
from PIL import Image
img = Image.open('public/images/22-fight-bg.png').convert('RGBA')
w, h = img.size
strip = int(h * 0.10)
above = img.crop((0, h - strip*2, w, h - strip))
img.paste(above.transpose(Image.FLIP_TOP_BOTTOM), (0, h - strip))
img.save('public/images/22-fight-bg.png', format='PNG', optimize=True)
"
```

---

## ✅ 인계 체크리스트

게임 측 (완료):
- [x] Next.js 빌드 클린
- [x] vitest 통과 (47+ tests)
- [x] FISH:* 메시지 프로토콜 (CLAIM_TICKET, PLAY_AD_REWARDED 등)
- [x] 자정 자동 리셋
- [x] devMockParent (스탠드얼론용)
- [x] 워터마크 처리된 자산
- [x] Vercel 자동 배포 연결

폴리볼 측:
- [ ] iframe 임베드 (실험실 메뉴)
- [ ] `FISH:READY` → `SET_PLAYER` 응답 (닉/팀/점수)
- [ ] `FISH:PLAY_AD_REWARDED` 핸들러 + 광고 SDK
- [ ] `FISH:CLAIM_TICKET` 핸들러 + cap(3장/일) + DB
- [ ] `FISH:SCORE_UPDATE` 핸들러 (선택)
- [ ] PIPA 동의 (앱 진입 단계)
- [ ] 만 14세 미만 처리 (정책팀)

---

## 📚 참고

- GitHub: https://github.com/JHS-HECTO/polyball-fishing
- 라이브 데모: https://polyball-fishing.vercel.app
- 통합 명세: [INTEGRATION.md](./INTEGRATION.md)
- 이미지 프롬프트: [Gemini_프롬프트_FISH_전체.md](./Gemini_프롬프트_FISH_전체.md)
- 야구빠따 키우기 (선행 패턴 참고): https://github.com/JHS-HECTO/yagu-bbada
