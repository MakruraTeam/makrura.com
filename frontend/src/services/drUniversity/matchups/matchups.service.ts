import { defaultDelete, defaultGet, defaultPatch, defaultPost } from '@/services/api';
import { CreateMatchupTableDto, MatchupTableFull, MatchupTableSummary } from './matchups.model';

export async function createMatchupTable(matchup: CreateMatchupTableDto) {
  return defaultPost<{ message: string; matchupTable: MatchupTableFull }>('/dr-university/matchups', matchup, true);
}

export async function getAllMatchupTables() {
  return defaultGet<MatchupTableSummary[]>('/dr-university/matchups', false);
}

export async function getMatchupTableById(id: number) {
  return defaultGet<MatchupTableFull>(`/dr-university/matchups/id/${id}`, false);
}

export async function deleteMatchupTableById(id: number) {
  return defaultDelete<{ message: string }>(`/dr-university/matchups/${id}`, undefined, true);
}

export async function patchMatchupTableById(id: number, matchup: CreateMatchupTableDto) {
  return defaultPatch<{ message: string; matchupTable: MatchupTableFull }>(`/dr-university/matchups/${id}`, matchup, true);
}
