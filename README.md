# 🎣 응모권 낚시하기 (Polyball Fishing)

폴리볼 실험실 두 번째 미니게임. 저수지 낚시 + 황금물고기 응모권 보상.

## 기술 스택
- Next.js 16.1.6 + React 19.2.3 (App Router)
- TypeScript strict (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- SCSS Modules (Tailwind 미사용)
- zustand · framer-motion
- vitest + @testing-library/react
- pnpm

## 빠른 시작

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm test     # 단위 테스트
pnpm build    # 프로덕션 빌드
```

## 게임 정책
- 일일 캐스팅 **무제한**
- **5캐스팅마다** 인터스티셜 광고
- 황금물고기 잡으면 응모권 1장 즉시 지급
- 일일 응모권 cap 3장 (서버 silent)

## 폴리볼 통합
상세는 [INTEGRATION.md](./INTEGRATION.md) 참조. 핵심은 `FISH:*` 메시지 프로토콜.

## 자산 (이미지)
[Gemini_프롬프트_FISH_전체.md](./Gemini_프롬프트_FISH_전체.md) 참고하여 Gemini로 생성. 결과 PNG는 `public/images/` 아래 배치.

## 인계 체크리스트
- [ ] `INTEGRATION.md`의 메시지 프로토콜 부모(폴리볼)에서 구현
- [ ] 서버: 유저별 일일 황금 카운터 (cap 3)
- [ ] 서버: 광고 횟수 검증 및 `PLAY_AD` 응답
- [ ] 서버: 점수 누적 API + 리더보드 API
- [ ] 서버: PIPA 동의 체크
- [ ] 실 자산(이미지) `public/images/`에 배치
- [ ] mock 리더보드(`lib/mockLeaderboard.ts`)를 실제 API 호출로 교체
- [ ] Vercel(또는 사내) 배포 확인
