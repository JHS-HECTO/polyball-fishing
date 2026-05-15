# 🎨 Gemini 이미지 생성 프롬프트 시트 — 응모권 낚시하기

톤: 동물의숲(Animal Crossing) 스타일. 파스텔, 둥근 chibi, 따뜻함. 배경은 투명(PNG) 권장.

## 공통 negative prompt (모든 이미지 공통)
```
realistic, photographic, dark, gritty, horror, blood, weapon, gun, text, watermark, signature, low quality, blurry, oversaturated, neon
```

## 공통 style suffix (모든 이미지 끝에 붙임)
```
, Animal Crossing style, cozy pastel palette, soft mint and peach, rounded chibi proportions, warm afternoon golden hour lighting, clean illustration, transparent background, PNG
```

---

## 1. 타이틀 배경 (선택)
저장: `public/images/title-bg.png`
```
A peaceful Korean countryside reservoir at golden hour. Pastel sky transitioning from soft peach to mint blue. Distant rolling hills in muted sage green. Calm water with gentle ripples. No people. Wide cinematic 16:9 composition. [+style suffix]
```

## 2. 낚시꾼 캐릭터 (앉아있는 모습)
저장: `public/images/angler.png`
```
A chibi Korean angler sitting on the edge of a wooden dock in side view, holding a small fishing rod, wearing a wide-brimmed straw hat and a soft cream-colored vest. Happy peaceful expression. Front-side three-quarter view. [+style suffix]
```

## 3-5. 잡어 (각각 종 이름만 교체)
저장: `public/images/fish/trash-bunge.png`, `trash-pirami.png`, `trash-songsari.png`
```
A cute chibi [붕어 / 피라미 / 송사리] in side view, simplified rounded shape, soft pastel scales (light gray + hint of green), big friendly eye, slight smile. Small size. [+style suffix]
```

## 6-8. 일반
저장: `public/images/fish/normal-ingeo.png`, `normal-ssogari.png`, `normal-bingeo.png`
```
A cute chibi [잉어 / 쏘가리 / 빙어] in side view, slightly larger and more colorful than trash fish, soft pastel blues and creams, decorative pattern hints, friendly eye. [+style suffix]
```

## 9-11. 희귀
저장: `public/images/fish/rare-megi.png`, `rare-hyangeo.png`, `rare-gamulchi.png`
```
A cute chibi [메기 / 향어 / 가물치] in side view, distinctive features (whiskers for catfish, deep tone for snakehead), pastel deep blue and lavender, slightly larger, still rounded and friendly. [+style suffix]
```

## 12-13. 대물
저장: `public/images/fish/big-ingeo.png`, `big-bass.png`
```
A large chibi [대형 잉어 / 대형 배스], substantially bigger than normal fish, exaggerated proud expression with closed eyes and confident smile, rich pastel deep blue. [+style suffix]
```

## 14. 황금 물고기 (가장 중요한 한 장)
저장: `public/images/fish/golden.png`
```
A magical chibi golden carp glowing with warm golden light, holding a paper raffle ticket gently in its mouth, sparkle particles around it, large eyes, very cute expression of pride. Soft pastel golden-yellow body with subtle iridescent shimmer. The raffle ticket should be clearly visible and labeled "응모권". [+style suffix]
```

## 15. 응모권 일러스트 (단독)
저장: `public/images/ticket.png`
```
A cute paper raffle ticket icon, soft pastel mint and peach color, decorated with small fish silhouettes and the Korean text "응모권" in playful rounded font. Slight tilt for dynamic feel. [+style suffix]
```

## 16. 찌 (Bobber)
저장: `public/images/bobber.png`
```
A simple round fishing bobber, top half soft red-coral, bottom half cream white, with a small antenna on top. Clean cartoon style, slight shading. [+style suffix]
```

## 17. 파티클 — 물방울
저장: `public/images/particles/water-splash.png`
```
A small cluster of water droplet shapes in soft mint and white, scattered, no background, clean cartoon style. For overlay use. [+style suffix]
```

## 18. 파티클 — 황금 반짝임
저장: `public/images/particles/golden-sparkle.png`
```
A burst of small sparkle and star shapes in warm golden-yellow and cream, scattered, no background, clean cartoon style. For overlay use. [+style suffix]
```

---

## 작업 순서 권장
1. 황금 물고기 (14번) — 가장 중요. 컨셉 검증 후 다른 자산 진행.
2. 잡어/일반/희귀/대물 (3~13번) — 통일감 위해 일괄 생성.
3. 캐릭터 (2번)
4. UI 자산 (15, 16, 17, 18번)
5. 타이틀 배경 (1번) — 선택, CSS 그라데이션으로 대체 가능

## 후처리
- 배경 투명화: Gemini가 가끔 흰 배경 남김 → `scripts/remove-bg.py` 등으로 후처리 (야구빠따 패턴 참고)
- 사이즈: 기본 1024×1024 생성 후 사용처에 맞게 리사이즈
