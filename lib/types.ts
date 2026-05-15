export type FishGrade = 'trash' | 'normal' | 'rare' | 'big' | 'golden';

export type FishSpecies = {
  id: string;
  name: string;
  grade: FishGrade;
  image: string;
};

export type FishGradeConfig = {
  grade: FishGrade;
  probability: number;        // 0..1
  score: number;
  // Continuous fight (no rounds). Player wins when catchProgress reaches 100,
  // fish wins when tension reaches 100.
  staminaUpPerSec: number;    // catch progress % per second when input is correct
  staminaDownPerSec: number;  // catch progress drains slowly when input is wrong/none
  tensionUpPerSec: number;    // tension % per second when wrong/no input
  tensionDownPerSec: number;  // tension % per second when input is correct
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
