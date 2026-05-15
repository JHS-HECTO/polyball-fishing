import clsx from 'clsx';
import type { LeaderboardEntry } from 'lib/types';
import { getTeam } from 'lib/teams';
import { formatScore } from 'lib/ranking';
import styles from './LeaderboardRow.module.scss';

type Props = {
  entry: LeaderboardEntry;
  isMe: boolean;
};

export function LeaderboardRow({ entry, isMe }: Props) {
  const team = getTeam(entry.team);
  return (
    <li className={clsx(styles.row, { [styles['row--me'] as string]: isMe })}>
      <div className={styles.row__rank}>{entry.rank}</div>
      <div className={styles.row__nick}>
        {entry.nickname}
        {team && (
          <span className={styles.row__team} style={{ background: team.color }}>
            {team.name}
          </span>
        )}
      </div>
      <div className={styles.row__score}>{formatScore(entry.total_score)}점</div>
    </li>
  );
}
