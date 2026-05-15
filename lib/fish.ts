import fishData from 'data/fish.json';
import type { FishData, FishGrade, FishGradeConfig, FishSpecies } from './types';

const data = fishData as FishData;

export type RandomFn = () => number;

export function rollGrade(rng: RandomFn = Math.random): FishGrade {
  const r = rng();
  let cumulative = 0;
  for (const cfg of data.grades) {
    cumulative = Math.round((cumulative + cfg.probability) * 1e9) / 1e9;
    if (r < cumulative) return cfg.grade;
  }
  return data.grades[data.grades.length - 1]?.grade ?? 'trash';
}

export function gradeConfig(grade: FishGrade): FishGradeConfig {
  const cfg = data.grades.find((g) => g.grade === grade);
  if (!cfg) throw new Error(`Unknown grade: ${grade}`);
  return cfg;
}

export function pickSpecies(grade: FishGrade, rng: RandomFn = Math.random): FishSpecies {
  const cfg = gradeConfig(grade);
  const idx = Math.floor(rng() * cfg.species.length);
  const safeIdx = Math.min(idx, cfg.species.length - 1);
  const species = cfg.species[safeIdx];
  if (!species) throw new Error(`No species for grade ${grade}`);
  return species;
}

export function allGrades(): FishGradeConfig[] {
  return data.grades;
}
