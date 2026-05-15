'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LeaderboardRow } from 'components/LeaderboardRow';
import { MOCK_LEADERBOARD } from 'lib/mockLeaderboard';
import { sortLeaderboard } from 'lib/ranking';
import { ROUTES } from 'lib/routes';
import { useGameStore } from 'lib/gameState';
import type { LeaderboardEntry } from 'lib/types';
import styles from './page.module.scss';

export default function LeaderboardPage() {
  const player = useGameStore((s) => s.player);
  const totalScore = useGameStore((s) => s.totalScore);
  const [entries, setEntries] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);

  useEffect(() => {
    if (!player) return;
    const withMe: LeaderboardEntry[] = [
      ...MOCK_LEADERBOARD,
      {
        rank: 0,
        user_id: 'me',
        nickname: player.nickname,
        team: player.team,
        total_score: totalScore,
        golden_count: 0,
        created_at: new Date().toISOString(),
      },
    ];
    setEntries(sortLeaderboard(withMe));
  }, [player, totalScore]);

  return (
    <main className={styles.lb}>
      <header className={styles.lb__head}>
        <Link href={ROUTES.HOME} className={styles.lb__back}>← 뒤로</Link>
        <h2 className={styles.lb__title}>🏆 명예의 전당</h2>
      </header>
      <ul className={styles.lb__list}>
        {entries.map((e) => (
          <LeaderboardRow key={`${e.nickname}-${e.created_at}`} entry={e} isMe={e.user_id === 'me'} />
        ))}
      </ul>
    </main>
  );
}
