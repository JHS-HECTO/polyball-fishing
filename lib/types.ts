export type FishGrade = 'trash' | 'normal' | 'rare' | 'big' | 'golden';

export type FishSpecies = {
  id: string;
  name: string;
  grade: FishGrade;
  image: string;
};

export type FishGradeConfig = {
  grade: FishGrade;
  probability: number;       // 0..1
  score: number;
  rounds: number;
  tensionUpPerSec: number;   // % per second when wrong input
  tensionDownPerSec: number; // % per second when correct input
  escapeChanceHighTension: number; // 0..1, rolled at round end if tension >= 70%
  species: FishSpecies[];
};

export type FishData = {
  grades: FishGradeConfig[];
};

export type TeamId = string;

export type Player = {
  nickname: string;
  team: TeamId;
};

export type LeaderboardEntry = {
  rank: number;
  user_id?: string;
  nickname: string;
  team: TeamId;
  total_score: number;
  golden_count: number;
  created_at: string;
};
