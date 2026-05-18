'use client';

// QA gallery — renders every visible game state side-by-side so it can be
// audited on one page without playing through. Components are mounted with
// fixed props (no RAF, no postMessage) so each screen is reproducible.

import { useState } from 'react';
import { TicketProgress } from 'components/TicketProgress';
import { ResultModal } from 'components/ResultModal';
import { GoldenRewardModal } from 'components/GoldenRewardModal';
import { TicketClaimedModal } from 'components/TicketClaimedModal';
import { FishSilhouette } from 'components/Fight/FishSilhouette';
import { TensionMeter } from 'components/Fight/TensionMeter';
import { Joystick } from 'components/Fight/Joystick';
import { CastButton } from 'components/CastButton';
import { Bobber } from 'components/Bobber';
import { Splash } from 'components/Splash';
import { FishingLine } from 'components/FishingLine';
import { Angler } from 'components/Angler';
import { CatchSequence } from 'components/CatchSequence';
import { Lake } from 'components/Lake';
import type { FishSpecies, FishGrade } from 'lib/types';
import styles from './page.module.scss';

const SPECIES: Record<FishGrade, FishSpecies> = {
  trash:  { id: 'trash-1',  name: '붕어',     grade: 'trash',  image: '/images/03-trash-bunge.png' },
  normal: { id: 'normal-1', name: '잉어',     grade: 'normal', image: '/images/06-normal-ingeo.png' },
  rare:   { id: 'rare-1',   name: '메기',     grade: 'rare',   image: '/images/09-rare-megi.png' },
  big:    { id: 'big-1',    name: '대형 잉어', grade: 'big',    image: '/images/12-big-ingeo.png' },
  golden: { id: 'golden-1', name: '황금 잉어', grade: 'golden', image: '/images/14-golden.png' },
};

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <div className={styles.label}>
        <h3>{title}</h3>
        {note && <p>{note}</p>}
      </div>
      <div className={styles.canvas}>{children}</div>
    </section>
  );
}

// Wraps a tiny "phone-frame" preview so we can show multiple "screens" inline.
function Phone({ children }: { children: React.ReactNode }) {
  return <div className={styles.phone}>{children}</div>;
}

export default function QAPage() {
  const noop = () => {};
  const [meterValue, setMeterValue] = useState(35);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>응모권 낚시하기 — QA 갤러리</h1>
        <p>각 컴포넌트의 모든 상태를 한 페이지에서 확인. 실제 플레이는 <a href="/">/</a> 또는 <a href="/play">/play</a></p>
      </header>

      {/* ─── TicketProgress: all 4 states ───────────────────────────────── */}
      <h2 className={styles.group}>1. TicketProgress (응모권 게이지)</h2>

      <Section title="1A. 잠김 (점수 부족, 1번째)" note="1번째 클레임 대상이지만 게이지 미달">
        <TicketProgress current={300} target={2000} ticketsClaimed={0} ticketsMax={3} needsAd={false} exhausted={false} onClaim={noop} />
      </Section>

      <Section title="1B. 활성 무료 (1번째 클레임)" note="첫 클레임 — 광고 없이 받기 가능">
        <TicketProgress current={2000} target={2000} ticketsClaimed={0} ticketsMax={3} needsAd={false} exhausted={false} onClaim={noop} />
      </Section>

      <Section title="1C. 잠김 (2번째 클레임 대기)" note="이미 1장 받음, 게이지 미달">
        <TicketProgress current={800} target={2000} ticketsClaimed={1} ticketsMax={3} needsAd={true} exhausted={false} onClaim={noop} />
      </Section>

      <Section title="1D. 활성 광고 (2~3번째 클레임)" note="광고 시청 후 받기">
        <TicketProgress current={2000} target={2000} ticketsClaimed={1} ticketsMax={3} needsAd={true} exhausted={false} onClaim={noop} />
      </Section>

      <Section title="1E. 마감 (3장 다 받음)" note="오늘 끝 — 황금만 노리기">
        <TicketProgress current={1200} target={2000} ticketsClaimed={3} ticketsMax={3} needsAd={true} exhausted={true} onClaim={noop} />
      </Section>

      <Section title="1F. compact (게임 내 HUD)" note="play 페이지 상단에 표시되는 버전">
        <TicketProgress compact current={1100} target={2000} ticketsClaimed={1} ticketsMax={3} needsAd={true} exhausted={false} onClaim={noop} />
      </Section>

      {/* ─── ResultModal variants ─────────────────────────────────────────── */}
      <h2 className={styles.group}>2. ResultModal (결과 모달)</h2>

      <Section title="2A. 잡힘 - 잡어 (붕어)">
        <Phone><ResultModal outcome="caught" grade="trash" species={SPECIES.trash} onClose={noop} /></Phone>
      </Section>
      <Section title="2B. 잡힘 - 일반 (잉어)">
        <Phone><ResultModal outcome="caught" grade="normal" species={SPECIES.normal} onClose={noop} /></Phone>
      </Section>
      <Section title="2C. 잡힘 - 희귀 (메기)">
        <Phone><ResultModal outcome="caught" grade="rare" species={SPECIES.rare} onClose={noop} /></Phone>
      </Section>
      <Section title="2D. 잡힘 - 대물 (대형 잉어)">
        <Phone><ResultModal outcome="caught" grade="big" species={SPECIES.big} onClose={noop} /></Phone>
      </Section>
      <Section title="2E. 잡힘 - 황금 (황금 잉어)" note="비교용 — 실제는 GoldenRewardModal 가 대체">
        <Phone><ResultModal outcome="caught" grade="golden" species={SPECIES.golden} onClose={noop} /></Phone>
      </Section>
      <Section title="2F. 도망 (escaped)">
        <Phone><ResultModal outcome="escaped" grade="normal" species={SPECIES.normal} onClose={noop} /></Phone>
      </Section>
      <Section title="2G. 줄 끊김 (broken)">
        <Phone><ResultModal outcome="broken" grade="rare" species={SPECIES.rare} onClose={noop} /></Phone>
      </Section>

      {/* ─── GoldenRewardModal ─────────────────────────────────────────── */}
      <h2 className={styles.group}>3. GoldenRewardModal (황금물고기 보상)</h2>

      <Section title="3A. ad-prompt (광고 시청 권유)">
        <Phone><GoldenRewardModal mode="ad-prompt" onWatchAd={noop} onDecline={noop} /></Phone>
      </Section>
      <Section title="3B. granted (황금물고기 응모권 지급 완료)">
        <Phone><GoldenRewardModal mode="granted" count={1} onClose={noop} /></Phone>
      </Section>

      <Section title="3C. TicketClaimedModal (게이지 채워 응모권 지급)">
        <Phone><TicketClaimedModal count={1} onClose={noop} /></Phone>
      </Section>

      {/* ─── Fight HUD pieces ─────────────────────────────────────────── */}
      <h2 className={styles.group}>4. Fight 화면 구성요소</h2>

      <Section title="4A. TensionMeter — 단계별">
        <div className={styles.row}>
          <div className={styles.col}>
            <p className={styles.colLabel}>safe (30%)</p>
            <TensionMeter value={30} />
          </div>
          <div className={styles.col}>
            <p className={styles.colLabel}>warn (60%)</p>
            <TensionMeter value={60} />
          </div>
          <div className={styles.col}>
            <p className={styles.colLabel}>danger (85%)</p>
            <TensionMeter value={85} />
          </div>
        </div>
      </Section>

      <Section title="4B. TensionMeter — 조절 슬라이더 (실시간 테스트)">
        <div className={styles.col}>
          <p className={styles.colLabel}>값: {meterValue}%</p>
          <TensionMeter value={meterValue} />
          <input
            type="range"
            min={0}
            max={100}
            value={meterValue}
            onChange={(e) => setMeterValue(Number(e.target.value))}
            className={styles.range}
          />
        </div>
      </Section>

      <Section title="4C. FishSilhouette — 등급별">
        <div className={styles.row}>
          {(['trash', 'normal', 'rare', 'big', 'golden'] as FishGrade[]).map((g) => (
            <div key={g} className={styles.col}>
              <p className={styles.colLabel}>{g}</p>
              <FishSilhouette grade={g} species={SPECIES[g]} direction={1} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="4D. Joystick" note="드래그 가능 — 폰에서 터치 테스트">
        <div className={styles.center}><Joystick onChange={noop} /></div>
      </Section>

      {/* ─── Buttons ─────────────────────────────────────────── */}
      <h2 className={styles.group}>5. CastButton 상태별</h2>

      <Section title="5A. 활성 (던지기!)">
        <div className={styles.center}><CastButton onClick={noop} /></div>
      </Section>
      <Section title="5B. 활성 (당기기!)" note="입질시 라벨 변경">
        <div className={styles.center}><CastButton onClick={noop} label="🎣 당기기!" /></div>
      </Section>
      <Section title="5C. 비활성">
        <div className={styles.center}><CastButton onClick={noop} disabled label="기다리는 중…" /></div>
      </Section>

      {/* ─── Scene pieces ─────────────────────────────────────────── */}
      <h2 className={styles.group}>6. 호수 신 컴포넌트</h2>

      <Section title="6A. Lake (전체 배경, 애니메이션 포함)">
        <Phone>
          <Lake>
            <Angler castedRod={false} />
          </Lake>
        </Phone>
      </Section>

      <Section title="6B. Lake — 캐스팅 상태 (낚시줄+찌)">
        <Phone>
          <Lake>
            <Angler castedRod={true} />
            <FishingLine visible={true} />
            <Bobber state="floating" />
          </Lake>
        </Phone>
      </Section>

      <Section title="6C. Splash 이펙트">
        <Phone>
          <Lake>
            <Splash visible={true} />
          </Lake>
        </Phone>
      </Section>

      <Section title="6D. CatchSequence (황금 잡힘 연출)" note="2초 후 자동 종료">
        <Phone>
          <Lake>
            <CatchSequence grade="golden" species={SPECIES.golden} onComplete={noop} />
          </Lake>
        </Phone>
      </Section>

      <footer className={styles.footer}>
        <p>QA 페이지 끝. 실제 게임: <a href="/play">/play</a> · 시작화면: <a href="/">/</a></p>
      </footer>
    </main>
  );
}
