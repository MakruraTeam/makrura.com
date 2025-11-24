import { defaultDelete, defaultGet, defaultPatch, defaultPost } from '@/services/api';
import type { Player, PlayerResponse } from './players.model';

export async function createPlayer(player: Player) {
  return defaultPost<{ message: string; id: number }>('/dr-university/players', player, true);
}

export async function getAllPlayers() {
  const data = await defaultGet<PlayerResponse[]>('/dr-university/players', false);
  return data;
}

export async function getPlayerById(id: number) {
  const data = await defaultGet<PlayerResponse>(`/dr-university/players/${id}`, false);
  return data;
}

export async function deletePlayer(id: number) {
  return defaultDelete<{ message: string }>(`/dr-university/players/${id}`, undefined, true);
}

export async function patchPlayerById(id: number, player: Player) {
  return defaultPatch<{ message: string }>(`/dr-university/players/${id}`, player, true);
}
