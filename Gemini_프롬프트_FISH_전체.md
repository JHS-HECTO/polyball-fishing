# 🎨 Gemini 이미지 생성 프롬프트 시트 — 응모권 낚시하기

톤: **동물의 숲: 모여봐요(Animal Crossing: New Horizons)** 닌텐도 스위치 게임 스크린샷 풍.

핵심 비주얼 특성:
- **3D 렌더링** (2D 일러스트 X)
- 매트한 플라스틱/점토 재질 (vinyl figure / soft clay)
- 부드럽게 깎인 둥근 low-poly geometry
- 부드러운 환경광 + 미세한 ambient occlusion + soft rim light
- 따뜻한 golden hour 자연광
- 채도 낮은 파스텔 — sage, mint, peach, cream
- 살짝 toy-like / figure 느낌
- 작은 점 같은 까만 눈 + 통통한 chibi 비율

각 코드블록 1개 = 한 번 복붙. 종횡비 / 사이즈 / 저장 경로 명시.

---

## 워크플로우

1. 아래 코드블록 복붙 → Gemini Imagen 생성 → PNG 다운로드
2. `public/images/` 에 명시된 정확한 파일명으로 저장
3. 누끼 처리 (투명 배경 자산만):
   ```bash
   python scripts/remove-bg.py
   ```
4. 풀스크린 bg 이미지 (`01-*-bg.png`, `22-fight-bg.png`)는 누끼 SKIP. Gemini 우하단 워터마크는 mirror inpaint:
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

## 1. 타이틀 배경 (풀스크린 세로)
저장: `public/images/01-title-bg.png` · **9:19.5** (1080×2340) · 풀스크린, 누끼 X

```
3D rendered Nintendo Switch game screenshot in the Animal Crossing: New Horizons visual style. Vertical portrait composition, 9:19.5 aspect ratio for smartphone full-screen background. A peaceful Korean countryside reservoir at golden hour, viewed from a wooden dock. Top two-thirds: soft gradient sky from pastel peach near top to mint blue near horizon, a few stylized fluffy 3D clouds with soft ambient occlusion. Middle band: rolling rounded low-poly hills covered in tiny matte grass tufts in sage green, distant treetops as simplified rounded shapes. Bottom one-third: calm pastel teal-blue water surface with stylized rounded ripple patterns and soft cyan reflections, occasional tiny lily pad. Soft warm golden hour sunlight from the upper right, gentle rim light on hills. Matte plastic/clay material on everything, no hard outlines, no text, no characters. Cozy, inviting, slightly toy-like. Full-bleed background image (not transparent). Animal Crossing: New Horizons 3D game art style, soft Pixar-like ambient lighting, low-poly geometry with smoothed rounded edges, vinyl figure quality, soft subsurface scattering. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, blood, weapon, text, watermark, signature, low quality, blurry, oversaturated, neon, sharp shadows, hard outlines, cel-shading lines, landscape orientation.
```

---

## 1-b. 게임 화면 배경 (풀스크린 세로, 호수+도크)
저장: `public/images/01-play-bg.png` · **9:19.5** (1080×2340) · 풀스크린, 누끼 X

> Play 화면용. 캐릭터가 앉을 도크가 정중앙 하단에, 큰 호수가 중간을 차지, 하늘이 위쪽.

```
3D rendered Nintendo Switch in-game screenshot in the Animal Crossing: New Horizons visual style. Vertical portrait 9:19.5 mobile background. A peaceful Korean countryside reservoir at golden hour, framed from a fishing-dock perspective. TOP 18%: warm peach-to-mint gradient sky with a few rounded 3D clouds, soft golden sun in the upper-right corner. MIDDLE BAND 12%: rolling sage-green low-poly hills with tiny matte grass tufts, small distant trees, a tiny rounded Korean traditional house on the left and a fence on the right. CENTER 40%: large calm teal-blue lake taking the dominant area, with stylized soft ripples, a few rounded lily pads, a small empty wooden rowboat near the upper-left, and tall reeds at the right edge. BOTTOM 30%: narrow sandy beach strip across, then a wooden plank dock extending in perspective from center-bottom into the lake, viewed slightly from above so the dock tapers away. Two small wooden side rails on the dock. NO characters, NO fish, NO rod, NO text. Cozy, inviting, slightly toy-like. PBR matte plastic/clay material on everything, painterly textured surfaces, soft Pixar-style atmospheric lighting, warm golden hour, low-poly geometry with smoothed rounded edges, vinyl figure quality. Full-bleed background (not transparent). Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, neon, glossy plastic, metallic, text, watermark, signature, low quality, blurry, sharp shadows, hard outlines, cel-shading lines, landscape orientation, multiple docks, people, fish.
```

---

## 2. 낚시꾼 캐릭터 (뒷모습 스프라이트)
저장: `public/images/02-angler.png` · **3:4** (768×1024) · 투명 배경 ← rembg 처리

```
3D rendered Nintendo Switch in-game character render in the Animal Crossing: New Horizons visual style. Vertical 3:4 portrait sprite, a single character centered with empty transparent space around it. A chibi human angler shown from BEHIND (back view), seated cross-legged facing AWAY from the camera, looking forward toward a distant lake (the lake itself is not drawn here — only the character). We see the back of the head, the round dome of the straw hat from a slightly elevated angle (so the brim disc is visible curving around the head), the back of the torso, and a small fishing rod held in the right hand extending diagonally up-right out of frame. Big round head, small chunky body, short stubby arms — classic Animal Crossing villager proportions. The straw hat is wide-brimmed in warm cream and soft tan. The shirt is soft mint-green short-sleeve. Pants are rolled-up beige. NO face visible (back of head only — short tuft of brown hair just below the hat brim). PBR matte plastic/clay material on skin and clothing, painterly fabric texture, soft ambient occlusion under the hat brim onto the neck/shoulders, gentle warm golden hour rim light from upper-back-right giving a soft glow on the hat top and shoulders. No background, no dock, no water, no ground — character only on transparent background. Animal Crossing: New Horizons 3D game art style, low-poly geometry with smoothed rounded edges, vinyl figure quality, soft Pixar-like atmospheric lighting, soft subsurface scattering, no hard outlines, no cel-shading lines, no glossy highlights. PNG with transparent background. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark, gritty, horror, blood, weapon, text, watermark, signature, low quality, blurry, oversaturated, neon, sharp shadows, hard outlines, cel-shading lines, glossy plastic, metallic, multiple characters, background scenery, horizontal composition, front view, three-quarter view, profile view, visible face, visible eyes, visible mouth, character looking at camera.
```

---

## 3-5. 잡어 (3종)

저장 경로 / 프롬프트 (각각 종 이름만 교체):
- `public/images/03-trash-bunge.png` (붕어)
- `public/images/04-trash-pirami.png` (피라미)
- `public/images/05-trash-songsari.png` (송사리)

종횡비 **1:1** (1024×1024) · 투명 배경

```
3D rendered fish sprite in the Animal Crossing: New Horizons visual style. Square 1:1, a single small chibi 붕어 (Korean crucian carp) facing RIGHT in side view, simplified rounded oval body, matte pastel sage-green and cream scales with subtle iridescent sheen, tiny dot eye with white highlight, slight friendly smile, smooth small dorsal and tail fins. No water, no bubbles, no background — fish only on transparent background. PBR matte clay/plastic material, painterly textures, soft ambient occlusion, gentle warm rim light. Low-poly smoothed geometry, vinyl figure quality. Avoid: 2D illustration, flat vector art, anime, line art, sketch, watercolor, painting, photographic, dark gritty, neon, glossy, metallic, multiple fish, water background, text, watermark, signature, sharp shadows, hard outlines, cel-shading lines, facing left.
```

---

## 6-8. 일반 (3종)

저장 경로:
- `public/images/06-normal-ingeo.png` (잉어)
- `public/images/07-normal-ssogari.png` (쏘가리)
- `public/images/08-normal-bingeo.png` (빙어)

종횡비 **1:1** (1024×1024) · 투명

```
3D rendered fish sprite in the Animal Crossing: New Horizons visual style. Square 1:1, a single medium chibi 잉어 (carp) facing RIGHT in side view, plump rounded body, matte pastel orange-cream scales with subtle larger scale pattern, single small barbel hint at mouth corner, tiny dot eye with white highlight, content closed-mouth smile, smooth fins. No water, no bubbles, no background. PBR matte clay/plastic, painterly texture, soft ambient occlusion, warm rim light. Low-poly smoothed, vinyl quality. Avoid: 2D illustration, flat vector, anime, line art, sketch, watercolor, painting, photographic, dark gritty, neon, glossy, metallic, multiple fish, background, text, watermark, hard outlines, cel-shading lines, facing left.
```

---

## 9-11. 희귀 (3종)

저장 경로:
- `public/images/09-rare-megi.png` (메기)
- `public/images/10-rare-hyangeo.png` (향어)
- `public/images/11-rare-gamulchi.png` (가물치)

```
3D rendered fish sprite in the Animal Crossing: New Horizons visual style. Square 1:1, a slightly larger chibi 메기 (catfish) facing RIGHT in side view, rounded broad-headed body with two prominent soft whiskers (barbels) curving from the mouth, matte pastel deep blue back fading to cream belly, tiny dot eyes with white highlights, curious closed-mouth smile, smooth wide fins. No water, no bubbles, no background. PBR matte material, painterly texture, soft ambient occlusion. Low-poly smoothed, vinyl quality. Avoid: 2D illustration, flat vector, anime, line art, sketch, watercolor, painting, photographic, dark gritty, neon, glossy, metallic, multiple fish, background, text, watermark, hard outlines, cel-shading lines, facing left.
```

---

## 12-13. 대물 (2종)

저장 경로:
- `public/images/12-big-ingeo.png` (대형 잉어)
- `public/images/13-big-bass.png` (대형 배스)

```
3D rendered fish sprite in the Animal Crossing: New Horizons visual style. Square 1:1, a very large chibi 대형 잉어 (giant carp) substantially bigger and chunkier than common fish, facing RIGHT in side view, exaggerated proud expression with closed happy eyes and confident wide closed-mouth smile, rich matte pastel deep blue body with cream belly and large decorative scale pattern. No water, no bubbles, no background. PBR matte clay/plastic, painterly texture, soft ambient occlusion, warm rim light. Low-poly smoothed, vinyl quality. Avoid: 2D illustration, flat vector, anime, line art, sketch, watercolor, painting, photographic, dark gritty, neon, glossy, metallic, multiple fish, background, text, watermark, hard outlines, cel-shading lines, facing left.
```

---

## 14. 황금 물고기 ★ 핵심 자산
저장: `public/images/14-golden.png` · **1:1** (1024×1024) · 투명

> 코드는 fish가 **오른쪽 향함** 가정. 왼쪽 향하게 나오면 `python -c "from PIL import Image; Image.open('public/images/14-golden.png').transpose(Image.FLIP_LEFT_RIGHT).save('public/images/14-golden.png')"` 로 좌우 반전.

```
3D rendered Nintendo Switch in-game render in the Animal Crossing: New Horizons visual style — the most magical sprite in the set. Square 1:1, a single magical golden carp fish facing RIGHT in side view, glowing with warm golden inner light, holding a small paper raffle ticket gently in its mouth (ticket extends slightly to the right of the mouth). Large round dot eyes with bright white highlights, very cute proud expression, matte pastel warm-gold body with subtle iridescent shimmer, decorative larger scale pattern, hint of pink cheek blush, a few small soft sparkle particles floating near the body. The raffle ticket is clearly visible — soft mint with peach accent, the Korean text "응모권" centered on it in playful rounded font. Matte clay/plastic material with subtle metallic gold sheen, soft ambient occlusion, magical golden rim light. No water, no bubbles, no scenic background — fish only on transparent background. Avoid: 2D illustration, flat vector art, anime, manga, line art, sketch, watercolor, painting, photographic, dark gritty, horror, neon, glossy plastic, generic gold metallic jewelry, realistic gold leaf, multiple fish, water background, text other than 응모권, watermark, signature, low quality, sharp shadows, hard outlines, cel-shading lines, facing left.
```

---

## 15. 응모권 일러스트 (단독)
저장: `public/images/15-ticket.png` · **4:3** (1024×768) · 투명

```
3D rendered prop sprite in the Animal Crossing: New Horizons visual style — like an inventory item icon. Horizontal 4:3 aspect ratio, single raffle ticket centered with transparent space around it, slight tilt for dynamic feel. A cute thick paper raffle ticket with rounded corners, soft pastel mint body with a perforated edge separating a peach-accent stub on the right, decorated with two small fish silhouettes flanking the centered Korean text "응모권" in playful rounded font, gentle soft drop shadow beneath. PBR matte paper material with subtle ambient occlusion, soft warm rim light. Ticket only — no background. Avoid: 2D illustration, flat vector, anime, line art, sketch, watercolor, painting, photographic, dark gritty, neon, glossy, metallic, multiple tickets, background scenery, text other than 응모권, watermark, low quality, sharp shadows, hard outlines, cel-shading lines, square or vertical composition.
```

---

## 16. 찌 (Bobber)
저장: `public/images/16-bobber.png` · **1:1** (512×512) · 투명

```
3D rendered prop in the Animal Crossing: New Horizons visual style — a 3D fishing bobber. Square 1:1, single bobber centered with transparent space around it. A simple round 3D fishing bobber, top half matte pastel red-coral, bottom half matte cream white, a small short cream-colored antenna pointing straight up, gentle soft sphere highlight on the upper-left side. PBR matte clay/plastic with soft ambient occlusion. Bobber only — no string, no water, no background. Low-poly sphere with smoothed edges, vinyl quality. Avoid: 2D illustration, flat vector, anime, line art, sketch, watercolor, painting, photographic, dark gritty, neon, glossy plastic, metallic sheen, text, watermark, low quality, multiple bobbers, background scenery, sharp shadows, hard outlines, cel-shading lines.
```

---

## 17. 파티클 — 물방울 splash
저장: `public/images/17-splash.png` · **1:1** (512×512) · 투명

```
3D rendered effect overlay sprite in the Animal Crossing: New Horizons visual style — like a small 3D splash that appears when something hits the water. Square 1:1, a cluster of cute rounded 3D water droplets scattered in an upward arc formation, soft pastel mint and pure white droplets with small white highlights on each, varied sizes from tiny to medium, no background, no other elements. Matte translucent plastic droplets with very soft ambient occlusion and gentle rim light. Low-poly smoothed, vinyl quality. Avoid: 2D illustration, flat vector, anime, line art, sketch, watercolor, painting, photographic, dark gritty, neon, glossy, metallic, multiple separate splashes, scenic background, characters, text, watermark, sharp shadows, hard outlines, cel-shading lines.
```

---

## 18. 파티클 — 황금 반짝임
저장: `public/images/18-sparkle.png` · **1:1** (512×512) · 투명

```
3D rendered effect overlay sprite in the Animal Crossing: New Horizons visual style — magical sparkle effect from a special in-game moment. Square 1:1, a burst of small 3D sparkle shapes and chunky 3D four-point star shapes scattered in a radial formation expanding outward from the center, warm matte golden-yellow and soft cream sparkles with gentle inner glow, varied sizes from tiny to medium, no background, no other elements. Matte plastic/glowing material with soft ambient occlusion. Low-poly star geometry with smoothed edges, vinyl quality, magical warm glow. Avoid: 2D illustration, flat vector, anime, line art, sketch, watercolor, painting, photographic, dark gritty, neon, glossy plastic, metallic sheen, scenic background, characters, text, watermark, sharp shadows, hard outlines, cel-shading lines.
```

---

## 22. 파이팅 배경 (수중)
저장: `public/images/22-fight-bg.png` · **9:19.5** (1080×2340) · 풀스크린, 누끼 X

```
3D rendered Nintendo Switch in-game screenshot in the Animal Crossing: New Horizons visual style. Vertical portrait 9:19.5 mobile wallpaper depicting an underwater fishing scene from the angler's first-person POV looking down into a deep cozy lake at golden hour. Composition top-to-bottom: TOP 18% — dappled water surface viewed from below, shimmering caustic light patterns breaking through, warm golden sun rays piercing diagonally from upper right. UPPER MIDDLE 32% — clear teal-blue water with soft floating light particles drifting up, gentle volumetric god rays. CENTER 32% — slightly deeper teal water with empty open space for game UI overlay (no fish, no rod, no characters there). LOWER 18% — darker navy-teal abyss fading to deep blue-black, faint hint of murky lake floor and a few stylized rounded rocks far below. Tiny rising bubbles scattered throughout the whole frame. Side edges have soft vignette darkness. Cozy yet slightly tense underwater atmosphere. PBR painterly underwater textures, matte plastic/clay material feel, soft Pixar-like atmospheric lighting, smooth low-poly geometry where visible, no hard outlines, no sharp shadows, cozy pastel palette muted by depth. Avoid: 2D illustration, flat vector art, anime, manga, line art, hand-drawn sketch, watercolor, painting, photographic realism, dark gritty horror, blood, neon, glossy plastic, metallic sheen, text, watermark, signature, low quality, blurry, oversaturated, characters, people, faces, fish, fishing rod, boats, swimming gear, landscape orientation.
```

---

## 작업 순서 권장

1. **#14 황금 물고기** — 가장 중요. 톤 검증.
2. **#3~13 잡어/일반/희귀/대물** — 통일감 위해 일괄.
3. **#22 파이팅 배경** — 수중 분위기.
4. **#01 + #01-b 배경 2종**.
5. **#2 캐릭터**.
6. **#15~18 UI 자산** (응모권 / 찌 / 파티클).

## 톤 트러블슈팅 — 동숲처럼 안 나올 때

- "2D 일러스트로 나옴" → "3D rendered Nintendo Switch game screenshot" 맨 앞 강조. Avoid에 "2D illustration" 우선순위 올림.
- "캐릭터 너무 어른" → "chibi proportions, big head small body short stubby limbs" 추가.
- "재질 광택 있음" → "matte" 강조, "glossy / shiny / metallic" Avoid에 추가.
- "라이팅 강함" → "soft ambient lighting, no harsh shadows" 추가.
- "색 진함" → "muted pastel, low saturation" 추가.
- "왼쪽 향함 (물고기)" → "facing RIGHT in side view" 강조 + Avoid에 "facing left". 그래도 왼쪽 나오면 PIL `FLIP_LEFT_RIGHT` 로 직접 반전.

## 후처리 (모든 자산 공통)

```bash
# 1. 스프라이트 (투명 배경) 누끼 처리
python scripts/remove-bg.py

# 2. 워터마크 패치 (풀스크린 bg 자산만 — 파일명만 바꿔 실행)
python -c "
from PIL import Image
img = Image.open('public/images/01-play-bg.png').convert('RGBA')  # ← 대상 파일
w, h = img.size
strip = int(h * 0.10)
above = img.crop((0, h - strip*2, w, h - strip))
img.paste(above.transpose(Image.FLIP_TOP_BOTTOM), (0, h - strip))
img.save('public/images/01-play-bg.png', format='PNG', optimize=True)
"
```

`scripts/remove-bg.py` 의 `SKIP` 리스트에는 `01-title-bg.png`, `01-play-bg.png`, `22-fight-bg.png` 가 등록되어 있어 풀스크린 bg는 자동 제외.
