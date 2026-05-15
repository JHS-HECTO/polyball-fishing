# 🎨 Gemini 이미지 생성 프롬프트 시트 — 응모권 낚시하기

톤: **동물의 숲: 모여봐요(Animal Crossing: New Horizons)** 닌텐도 스위치 게임 스크린샷 풍.

핵심 비주얼 특성 (이거 없으면 동숲 아님):
- **3D 렌더링**, 2D 일러스트 X
- 매트한 플라스틱/점토 재질 (vinyl figure / soft clay)
- 부드럽게 깎인 둥근 low-poly geometry
- 부드러운 환경광 + 미세한 ambient occlusion + soft rim light
- 따뜻한 golden hour 자연광
- 채도 낮은 파스텔 — sage, mint, peach, cream
- 살짝 toy-like / fig figure 느낌
- 작은 점 같은 까만 눈 + 통통한 chibi 비율

각 코드블록 1개 = 한 번 복붙. 종횡비/사이즈 명시.

---

## 1. 타이틀 배경 (풀스크린 세로)
저장: `public/images/title-bg.png` · **9:19.5** (1080×2340) · 풀스크린

```
3D rendered Nintendo Switch game screenshot in the Animal Crossing: New Horizons visual style. Vertical portrait composition, 9:19.5 aspect ratio for smartphone full-screen background. A peaceful Korean countryside reservoir at golden hour, viewed from a wooden dock. Top two-thirds: soft gradient sky from pastel peach near top to mint blue near horizon, a few stylized fluffy 3D clouds with soft ambient occlusion. Middle band: rolling rounded low-poly hills covered in tiny matte grass tufts in sage green, distant treetops as simplified rounded shapes. Bottom one-third: calm pastel teal-blue water surface with stylized rounded ripple patterns and soft cyan reflections, occasional tiny lily pad. Soft warm golden hour sunlight from the upper right, gentle rim light on hills. Matte plastic/clay material on everything, no hard outlines, no text, no characters. Cozy, inviting, slightly toy-like. Full-bleed background image (not transparent). Animal Crossing: New Horizons 3D game art style, soft Pixar-like ambient lighting, low-poly geometry with smoothed rounded edges, vinyl figure quality, soft subsurface scattering. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, blood, weapon, text, watermark, signature, low quality, blurry, oversaturated, neon, sharp shadows, hard outlines, cel-shading lines, landscape orientation.
```

---

## 2. 낚시꾼 캐릭터 (뒷모습 스프라이트)
저장: `public/images/angler.png` · **3:4** (768×1024) · 투명 배경

> 게임 구도: 호수가 위쪽, 캐릭터는 화면 아래쪽 정중앙. 플레이어는 캐릭터의 **뒷모습을 위에서 살짝 내려다보는 각도**로 본다.

```
3D rendered Nintendo Switch in-game character render in the Animal Crossing: New Horizons visual style. Vertical 3:4 portrait sprite, a single character centered with empty transparent space around it. A chibi human angler shown from BEHIND (back view), seated cross-legged facing AWAY from the camera, looking forward toward a distant lake (the lake itself is not drawn here — only the character). We see the back of the head, the round dome of the straw hat from a slightly elevated angle (so the brim disc is visible curving around the head), the back of the torso, and a small fishing rod held in the right hand extending diagonally up-right out of frame. Big round head, small chunky body, short stubby arms — classic Animal Crossing villager proportions. The straw hat is wide-brimmed in warm cream and soft tan. The shirt is soft mint-green short-sleeve. Pants are rolled-up beige. NO face visible (back of head only — short tuft of brown hair just below the hat brim). PBR matte plastic/clay material on skin and clothing, painterly fabric texture, soft ambient occlusion under the hat brim onto the neck/shoulders, gentle warm golden hour rim light from upper-back-right giving a soft glow on the hat top and shoulders. No background, no dock, no water, no ground — character only on transparent background. Animal Crossing: New Horizons 3D game art style, low-poly geometry with smoothed rounded edges, vinyl figure quality, soft Pixar-like atmospheric lighting, soft subsurface scattering, no hard outlines, no cel-shading lines, no glossy highlights. PNG with transparent background. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, blood, weapon, text, watermark, signature, low quality, blurry, oversaturated, neon, sharp shadows, hard outlines, cel-shading lines, glossy plastic, metallic, multiple characters, background scenery, horizontal composition, front view, three-quarter view, profile view, visible face, visible eyes, visible mouth, character looking at camera.
```

### 2-a. (선택) 레이어드 애니메이션용 — 부위별 분리 생성

framer-motion으로 회전/이동 애니메이션 하려면 캐릭터를 부위별로 따로 생성. 같은 톤·디자인 유지 위해 위 #2 프롬프트를 먼저 만들고, 동일 캐릭터의 부위를 잘라내거나 아래 프롬프트로 부위 단독 생성.

저장: `public/images/angler/torso-back.png` · **1:1** (1024×1024) · 투명

```
3D rendered Nintendo Switch in-game prop in the Animal Crossing: New Horizons visual style. Square 1:1 sprite, isolated chunky chibi human upper-body shown from BEHIND (back view only, no head, no arms below the elbow), seated posture, soft mint-green short-sleeve shirt with rolled-up beige pants visible below, very simple Animal Crossing villager torso proportions. PBR matte fabric texture, soft ambient occlusion. No head, no hat, no rod, no background — torso section only on transparent background. Avoid: 2D illustration, flat vector, anime, line art, sketch, watercolor, painting, photographic, dark, glossy, metallic, text, watermark, low quality, blurry, sharp shadows, hard outlines, cel-shading lines, front view, profile view, multiple bodies, background scenery.
```

저장: `public/images/angler/head-back.png` · **1:1** (1024×1024) · 투명

```
3D rendered Nintendo Switch in-game prop in the Animal Crossing: New Horizons visual style. Square 1:1 sprite, isolated chibi human head shown from BEHIND, wearing a wide-brimmed straw hat in warm cream and tan tones, the dome of the hat visible from a slightly elevated angle, hat brim curving around the head, small tuft of brown hair just below the brim at the back of the neck. NO face visible. PBR matte material, painterly straw weave texture on the hat, soft ambient occlusion under the brim. Head only on transparent background. Avoid: 2D illustration, flat vector, anime, line art, sketch, watercolor, painting, photographic, dark, glossy, metallic, text, watermark, low quality, blurry, sharp shadows, hard outlines, cel-shading lines, front view, profile view, visible face, visible eyes, visible mouth, background scenery.
```

저장: `public/images/angler/arm-rod.png` · **1:1** (1024×1024) · 투명

```
3D rendered Nintendo Switch in-game prop in the Animal Crossing: New Horizons visual style. Square 1:1 sprite, a chibi human right arm holding a small short fishing rod, viewed from behind. The arm is bent at the elbow, the rod extends diagonally upward to the upper-right. Soft mint-green short-sleeve cuff visible at the shoulder. The rod is brown wood with a tiny lighter wood tip. PBR matte material. No body, no head, no background — arm + rod only on transparent background. The shoulder/upper-arm side is positioned so it pivots cleanly from the lower-left of the sprite (this is the pivot point for animation in code). Avoid: 2D illustration, flat vector, anime, line art, sketch, watercolor, painting, photographic, dark, glossy, metallic, text, watermark, low quality, blurry, sharp shadows, hard outlines, cel-shading lines, full body, multiple arms, background scenery.
```

---

## 3. 잡어 — 붕어
저장: `public/images/fish/trash-bunge.png` · **1:1** (1024×1024) · 투명

```
3D rendered fish in the Animal Crossing: New Horizons visual style — the same look as a 3D fish model from the game's pond. Square 1:1 sprite, single fish centered with transparent space around it. A small chibi 붕어 (Korean crucian carp) facing right in side view, rounded oval body, matte pastel sage-green and cream scales with a subtle iridescent sheen, tiny dot eye with a soft white highlight, mouth slightly open in a friendly way, smooth small dorsal and tail fins. Matte clay/plastic material with soft ambient occlusion and gentle warm rim light. No water, no bubbles, no background — fish only on transparent background. Animal Crossing: New Horizons 3D game art style, low-poly geometry with smoothed edges, vinyl figure quality, soft Pixar-like lighting. PNG with transparent background. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, blood, text, watermark, signature, low quality, blurry, oversaturated, neon, sharp shadows, hard outlines, cel-shading lines, multiple fish, water background.
```

---

## 4. 잡어 — 피라미
저장: `public/images/fish/trash-pirami.png` · **1:1** (1024×1024) · 투명

```
3D rendered fish in the Animal Crossing: New Horizons visual style — the same look as a 3D fish model from the game's pond. Square 1:1 sprite, single fish centered with transparent space around it. A small chibi 피라미 (Korean minnow) facing right in side view, slender rounded body, matte pastel silver with a subtle pale-blue horizontal stripe along the side, tiny dot eye with white highlight, small smile, smooth fins. Matte clay/plastic material with soft ambient occlusion and warm rim light. No water, no bubbles, no background. Animal Crossing: New Horizons 3D game art style, low-poly geometry with smoothed edges, vinyl figure quality, soft Pixar-like lighting. PNG transparent background. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, blood, text, watermark, signature, low quality, blurry, oversaturated, neon, sharp shadows, hard outlines, cel-shading lines, multiple fish, water background.
```

---

## 5. 잡어 — 송사리
저장: `public/images/fish/trash-songsari.png` · **1:1** (1024×1024) · 투명

```
3D rendered fish in the Animal Crossing: New Horizons visual style. Square 1:1 sprite, single tiny fish centered with transparent space around it. A very small chibi 송사리 (Korean killifish) facing right in side view, rounded teardrop body, matte pastel cream with a row of tiny dark dots along the back, large dot eye relative to body size with white highlight, gentle smile. Matte clay/plastic material with soft ambient occlusion and warm rim light. No water, no bubbles, no background. Animal Crossing: New Horizons 3D game art style, low-poly geometry with smoothed edges, vinyl figure quality, soft Pixar-like lighting. PNG transparent background. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, blood, text, watermark, signature, low quality, blurry, oversaturated, neon, sharp shadows, hard outlines, cel-shading lines, multiple fish, water background.
```

---

## 6. 일반 — 잉어
저장: `public/images/fish/normal-ingeo.png` · **1:1** (1024×1024) · 투명

```
3D rendered fish in the Animal Crossing: New Horizons visual style. Square 1:1 sprite, single fish centered with transparent space around it. A chibi 잉어 (carp) of medium size facing right in side view, plump rounded body, matte pastel orange-cream scales with subtle larger scale pattern, single barbel hint at the corner of the mouth, tiny dot eye with white highlight, content smile, smooth fins. Matte clay/plastic material, soft ambient occlusion, warm rim light. No water, no bubbles, no background. Animal Crossing: New Horizons 3D game art style, low-poly geometry with smoothed edges, vinyl figure quality, soft Pixar-like lighting. PNG transparent background. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, blood, text, watermark, signature, low quality, blurry, oversaturated, neon, sharp shadows, hard outlines, cel-shading lines, multiple fish, water background.
```

---

## 7. 일반 — 쏘가리
저장: `public/images/fish/normal-ssogari.png` · **1:1** (1024×1024) · 투명

```
3D rendered fish in the Animal Crossing: New Horizons visual style. Square 1:1 sprite, single fish centered with transparent space around it. A chibi 쏘가리 (mandarin fish) of medium size facing right in side view, rounded body with a leopard-spot pattern in soft pastel sage-green over cream base, tiny dot eye with white highlight, calm closed-mouth smile, smooth fins. Matte clay/plastic material, soft ambient occlusion, warm rim light. No water, no bubbles, no background. Animal Crossing: New Horizons 3D game art style, low-poly geometry with smoothed edges, vinyl figure quality, soft Pixar-like lighting. PNG transparent background. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, blood, text, watermark, signature, low quality, blurry, oversaturated, neon, sharp shadows, hard outlines, cel-shading lines, multiple fish, water background.
```

---

## 8. 일반 — 빙어
저장: `public/images/fish/normal-bingeo.png` · **1:1** (1024×1024) · 투명

```
3D rendered fish in the Animal Crossing: New Horizons visual style. Square 1:1 sprite, single fish centered with transparent space around it. A chibi 빙어 (pond smelt) facing right in side view, slim elongated rounded body in icy pastel blue-white with a subtle sparkle highlight on the side, tiny dot eye with white highlight, gentle small smile, smooth small fins. Matte clay/plastic material with a hint of translucent sheen, soft ambient occlusion, warm rim light. No water, no bubbles, no background. Animal Crossing: New Horizons 3D game art style, low-poly geometry with smoothed edges, vinyl figure quality, soft Pixar-like lighting. PNG transparent background. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, blood, text, watermark, signature, low quality, blurry, oversaturated, neon, sharp shadows, hard outlines, cel-shading lines, multiple fish, water background.
```

---

## 9. 희귀 — 메기
저장: `public/images/fish/rare-megi.png` · **1:1** (1024×1024) · 투명

```
3D rendered fish in the Animal Crossing: New Horizons visual style. Square 1:1 sprite, single fish centered with transparent space around it. A chibi 메기 (catfish) slightly larger than common fish, facing right in side view, rounded broad-headed body with two prominent soft whiskers (barbels) curving from the mouth, matte pastel deep blue back fading to cream belly, tiny dot eyes with white highlights, curious closed-mouth smile, smooth wide fins. Matte clay/plastic material, soft ambient occlusion, warm rim light. No water, no bubbles, no background. Animal Crossing: New Horizons 3D game art style, low-poly geometry with smoothed edges, vinyl figure quality, soft Pixar-like lighting. PNG transparent background. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, blood, text, watermark, signature, low quality, blurry, oversaturated, neon, sharp shadows, hard outlines, cel-shading lines, multiple fish, water background.
```

---

## 10. 희귀 — 향어
저장: `public/images/fish/rare-hyangeo.png` · **1:1** (1024×1024) · 투명

```
3D rendered fish in the Animal Crossing: New Horizons visual style. Square 1:1 sprite, single fish centered with transparent space around it. A chibi 향어 (Israeli mirror carp) slightly larger than common fish, facing right in side view, plump rounded body with large irregular pastel lavender mirror-scale patches over a cream base, tiny dot eye with white highlight, proud little closed-mouth smile, smooth fins. Matte clay/plastic material, soft ambient occlusion, warm rim light. No water, no bubbles, no background. Animal Crossing: New Horizons 3D game art style, low-poly geometry with smoothed edges, vinyl figure quality, soft Pixar-like lighting. PNG transparent background. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, blood, text, watermark, signature, low quality, blurry, oversaturated, neon, sharp shadows, hard outlines, cel-shading lines, multiple fish, water background.
```

---

## 11. 희귀 — 가물치
저장: `public/images/fish/rare-gamulchi.png` · **1:1** (1024×1024) · 투명

```
3D rendered fish in the Animal Crossing: New Horizons visual style. Square 1:1 sprite, single fish centered with transparent space around it. A chibi 가물치 (snakehead) slightly larger than common fish, facing right in side view, elongated rounded torpedo body, matte pastel deep blue-purple back fading to cream belly with subtle dappled pattern, tiny dot eye with white highlight, calm confident closed-mouth smile, smooth fins. Matte clay/plastic material, soft ambient occlusion, warm rim light. No water, no bubbles, no background. Animal Crossing: New Horizons 3D game art style, low-poly geometry with smoothed edges, vinyl figure quality, soft Pixar-like lighting. PNG transparent background. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, blood, text, watermark, signature, low quality, blurry, oversaturated, neon, sharp shadows, hard outlines, cel-shading lines, multiple fish, water background.
```

---

## 12. 대물 — 대형 잉어
저장: `public/images/fish/big-ingeo.png` · **1:1** (1024×1024) · 투명

```
3D rendered fish in the Animal Crossing: New Horizons visual style. Square 1:1 sprite, single very large fish filling more of the square frame than smaller fish, centered with transparent space around it. A chibi 대형 잉어 (giant carp), substantially bigger and chunkier than common fish, facing right in side view, exaggerated proud expression with closed happy eyes and confident wide closed-mouth smile, rich matte pastel deep blue body with cream belly highlights and large decorative scale pattern. Matte clay/plastic material, soft ambient occlusion, warm rim light. No water, no bubbles, no background. Animal Crossing: New Horizons 3D game art style, low-poly geometry with smoothed edges, vinyl figure quality, soft Pixar-like lighting. PNG transparent background. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, blood, text, watermark, signature, low quality, blurry, oversaturated, neon, sharp shadows, hard outlines, cel-shading lines, multiple fish, water background.
```

---

## 13. 대물 — 대형 배스
저장: `public/images/fish/big-bass.png` · **1:1** (1024×1024) · 투명

```
3D rendered fish in the Animal Crossing: New Horizons visual style. Square 1:1 sprite, single very large fish filling more of the square frame than smaller fish, centered with transparent space around it. A chibi 대형 배스 (giant bass), substantially bigger and bulkier than common fish, facing right in side view, wide friendly open mouth, proud expression with a tiny dot eye and white highlight, matte pastel deep sage-green back with cream belly, smooth large fins. Matte clay/plastic material, soft ambient occlusion, warm rim light. No water, no bubbles, no background. Animal Crossing: New Horizons 3D game art style, low-poly geometry with smoothed edges, vinyl figure quality, soft Pixar-like lighting. PNG transparent background. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, blood, text, watermark, signature, low quality, blurry, oversaturated, neon, sharp shadows, hard outlines, cel-shading lines, multiple fish, water background.
```

---

## 14. 황금 물고기 (가장 중요한 한 장)
저장: `public/images/fish/golden.png` · **1:1** (1024×1024) · 투명

```
3D rendered fish in the Animal Crossing: New Horizons visual style — the most magical and special asset in the set. Square 1:1 sprite, single magical golden fish centered with transparent space around it (with a subtle warm radial glow extending slightly into the transparency). A magical chibi golden carp glowing with warm golden inner light, holding a small paper raffle ticket gently in its mouth, large round dot eyes with bright white highlights, very cute proud expression, matte pastel warm-gold body with subtle iridescent shimmer and decorative larger scale pattern, hint of pink cheek blush, a few small soft sparkle particles floating near the body. The raffle ticket is clearly visible, soft mint with peach accent, the Korean text "응모권" centered on it in playful rounded font. Matte clay/plastic material with subtle metallic gold sheen, soft ambient occlusion, magical golden rim light. No water, no bubbles, no scenic background — fish only on transparent background. Animal Crossing: New Horizons 3D game art style, low-poly geometry with smoothed edges, vinyl figure quality, soft Pixar-like lighting, magical glow. PNG transparent background. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, blood, watermark, signature, low quality, blurry, oversaturated, neon, sharp shadows, hard outlines, cel-shading lines, multiple fish, water background, generic gold metallic, jewelry style, realistic gold leaf.
```

---

## 15. 응모권 일러스트 (단독)
저장: `public/images/ticket.png` · **4:3** (1024×768) · 투명

```
3D rendered prop in the Animal Crossing: New Horizons visual style — like an item icon from the game's inventory. Horizontal 4:3 aspect ratio, single raffle ticket centered with transparent space around it, slight tilt for dynamic feel. A cute thick paper raffle ticket with rounded corners, soft pastel mint body with a perforated edge separating a peach-accent stub on the right, decorated with two small fish silhouettes flanking the centered Korean text "응모권" in playful rounded font, gentle soft drop shadow beneath. Matte paper material with very subtle ambient occlusion, soft warm rim light. Ticket only — no background. Animal Crossing: New Horizons 3D game art style, low-poly geometry with smoothed edges, vinyl figure quality, soft Pixar-like lighting. PNG transparent background. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, blood, watermark, signature, low quality, blurry, oversaturated, neon, sharp shadows, hard outlines, cel-shading lines, multiple tickets, background scenery, square or vertical composition.
```

---

## 16. 찌 (Bobber)
저장: `public/images/bobber.png` · **1:1** (512×512) · 투명

```
3D rendered prop in the Animal Crossing: New Horizons visual style — like a 3D fishing bobber prop from the game. Square 1:1 sprite, single bobber centered with transparent space around it. A simple round 3D fishing bobber, top half matte pastel red-coral, bottom half matte cream white, a small short cream-colored antenna pointing straight up from the top, gentle soft sphere highlight on the upper-left side. Matte clay/plastic material with soft ambient occlusion. Bobber only — no string, no water, no background. Animal Crossing: New Horizons 3D game art style, low-poly sphere with smoothed edges, vinyl figure quality, soft Pixar-like lighting. PNG transparent background. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, blood, text, watermark, signature, low quality, blurry, oversaturated, neon, sharp shadows, hard outlines, cel-shading lines, multiple bobbers, background scenery.
```

---

## 17. 파티클 — 물방울
저장: `public/images/particles/water-splash.png` · **1:1** (512×512) · 투명

```
3D rendered effect overlay in the Animal Crossing: New Horizons visual style — like the small 3D splash effect that appears when you catch a fish in the game. Square 1:1 sprite for overlay use, a cluster of cute rounded 3D water droplets scattered in an upward arc formation, soft pastel mint and pure white droplets with small white highlights on each, varied sizes from tiny to medium, no background, no other elements. Matte translucent plastic-like droplets with very soft ambient occlusion and gentle rim light. Animal Crossing: New Horizons 3D game art style, rounded smooth geometry, vinyl figure quality, soft Pixar-like lighting. PNG transparent background. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, blood, text, watermark, signature, low quality, blurry, oversaturated, neon, sharp shadows, hard outlines, cel-shading lines, scenic background, characters.
```

---

## 18. 파티클 — 황금 반짝임
저장: `public/images/particles/golden-sparkle.png` · **1:1** (512×512) · 투명

```
3D rendered effect overlay in the Animal Crossing: New Horizons visual style — like a magical sparkle effect from a special in-game moment. Square 1:1 sprite for overlay use, a burst of small 3D sparkle shapes and chunky 3D four-point star shapes scattered in a radial formation expanding outward from the center, warm matte golden-yellow and soft cream sparkles with gentle inner glow, varied sizes from tiny to medium, no background, no other elements. Matte plastic/glowing material with very soft ambient occlusion. Animal Crossing: New Horizons 3D game art style, rounded low-poly star geometry with smoothed edges, vinyl figure quality, soft Pixar-like lighting, magical warm glow. PNG transparent background. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, blood, text, watermark, signature, low quality, blurry, oversaturated, neon, sharp shadows, hard outlines, cel-shading lines, scenic background, characters.
```

---

## 작업 순서 권장
1. 황금 물고기 (14번) — 가장 중요. 톤 검증 후 다른 자산.
2. 잡어/일반/희귀/대물 (3~13번) — 통일감 위해 일괄.
3. 캐릭터 (2번).
4. UI 자산 (15, 16, 17, 18번).
5. 타이틀 배경 (1번) — 선택. CSS 그라데이션으로 대체 가능.

## 톤 트러블슈팅 — 동숲처럼 안 나올 때
- "2D 일러스트로 나옴" → 프롬프트 맨 앞 "3D rendered Nintendo Switch game screenshot" 강조. Avoid에 "2D illustration" 우선순위 올림.
- "캐릭터가 너무 어른스러움" → "chibi proportions, big head small body short stubby limbs" 추가.
- "재질이 광택 있음" → "matte" 강조, "glossy / shiny / metallic" Avoid에 추가.
- "라이팅 너무 강함" → "soft ambient lighting, no harsh shadows" 추가.
- "색이 너무 진함" → "muted pastel, low saturation" 추가.

## 후처리
- 배경 투명화: Gemini가 흰 배경 남기면 `scripts/remove-bg.py` 등으로 처리.
- 리사이즈: 위 명시 사이즈 → 사용처 맞게 (`public/images/...`).
