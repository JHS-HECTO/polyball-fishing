import type { LeaderboardEntry } from './types';
import { sortLeaderboard } from './ranking';

const RAW: Omit<LeaderboardEntry, 'rank'>[] = [
  { nickname: '강태공',    team: 'kia',     total_score: 28450, golden_count: 12, created_at: '2026-05-10T09:30:00Z' },
  { nickname: '낚시왕',    team: 'doosan',  total_score: 24100, golden_count: 9,  created_at: '2026-05-12T18:00:00Z' },
  { nickname: '월척꾼',    team: 'lg',      total_score: 21500, golden_count: 8,  created_at: '2026-05-11T11:20:00Z' },
  { nickname: '미끼장인',  team: 'samsung', total_score: 19800, golden_count: 7,  created_at: '2026-05-13T07:45:00Z' },
  { nickname: '저수지호랑이', team: 'kt',   total_score: 17250, golden_count: 6,  created_at: '2026-05-10T22:10:00Z' },
  { nickname: '찌통',      team: 'lotte',   total_score: 15600, golden_count: 5,  created_at: '2026-05-09T15:00:00Z' },
  { nickname: '루어매니아', team: 'ssg',    total_score: 13200, golden_count: 4,  created_at: '2026-05-08T20:30:00Z' },
  { nickname: '입질러',    team: 'hanwha',  total_score: 11800, golden_count: 3,  created_at: '2026-05-14T08:00:00Z' },
  { nickname: '낚시꾼A',   team: 'kiwoom',  total_score: 9400,  golden_count: 2,  created_at: '2026-05-13T14:00:00Z' },
  { nickname: '낚시꾼B',   team: 'nc',      total_score: 7200,  golden_count: 2,  created_at: '2026-05-14T16:00:00Z' },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = sortLeaderboard(
  RAW.map((r) => ({ ...r, rank: 0 })),
);
