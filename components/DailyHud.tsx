'use client';

import Link from 'next/link';
import { useGameStore } from 'lib/gameState';
import { ROUTES } from 'lib/routes';
import { getTeam } from 'lib/teams';
import { formatScore } from 'lib/ranking';
import styles from './DailyHud.module.scss';

type Props = {
  fishCaught: number;
  castsTillAd: number;
};

export function DailyHud({ fishCaught, castsTillAd }: Props) {
  const player = useGameStore((s) => s.player);
  const totalScore = useGameStore((s) => s.totalScore);
  const team = player ? getTeam(player.team) : undefined;

  return (
    <header className={styles.hud}>
      <div className={styles.hud__player}>
        <span className={styles.hud__nick}>{player?.nickname ?? '익명'}</span>
        {team && (
          <span className={styles.hud__team} style={{ background: team.color }}>
            {team.name}
          </span>
        )}
      </div>
      <div className={styles.hud__stats}>
        <div className={styles.hud__stat}>
          <span className={styles.hud__label}>오늘</span>
          <span className={styles.hud__value}>{fishCaught}마리</span>
        </div>
        <div className={styles.hud__stat}>
          <span className={styles.hud__label}>누적</span>
          <span className={styles.hud__value}>{formatScore(totalScore)}점</span>
        </div>
        <div className={styles.hud__stat}>
          <span className={styles.hud__label}>광고까지</span>
          <span className={styles.hud__value}>{castsTillAd}회</span>
        </div>
      </div>
      <Link href={ROUTES.LEADERBOARD} className={styles.hud__link}>
        🏆
      </Link>
    </header>
  );
}
