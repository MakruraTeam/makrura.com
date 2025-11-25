import { BACKEND_HOST, defaultDelete, defaultGet, defaultPatch, defaultPost } from '@/services/api';
import type { Player, PlayerResponse } from './players.model';

function resolveImageUrlsInContent(content?: string): string {
  if (!content) return '';
  return content.replace(/src=["']\/api\/common\/images\//g, `src="${BACKEND_HOST}/api/common/images/`);
}

export async function createPlayer(player: Player) {
  return defaultPost<{ message: string; id: number }>('/dr-university/players', player, true);
}

export async function getAllPlayers() {
  const data = await defaultGet<PlayerResponse[]>('/dr-university/players', false);
  return data.map((p) => ({
    ...p,
    contribution: resolveImageUrlsInContent(p.contribution),
  }));
}

export async function getPlayerById(id: number) {
  const data = await defaultGet<PlayerResponse>(`/dr-university/players/${id}`, false);
  return {
    ...data,
    contribution: resolveImageUrlsInContent(data.contribution),
  };
}

export async function deletePlayer(id: number) {
  return defaultDelete<{ message: string }>(`/dr-university/players/${id}`, undefined, true);
}

export async function patchPlayerById(id: number, player: Player) {
  return defaultPatch<{ message: string }>(`/dr-university/players/${id}`, player, true);
}
