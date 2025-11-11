import { BACKEND_HOST, defaultDelete, defaultGet, defaultPatch, defaultPost } from '@/services/api';
import { Founder } from './founder.model';
import { FounderCardProps } from '@/components/DrUniversity/FounderCard/FounderCard.model';

function resolveImageUrlsInContent(content?: string): string {
  if (!content) return '';
  return content.replace(/src=["']\/api\/common\/images\//g, `src="${BACKEND_HOST}/api/common/images/`);
}

function withFullImageUrl<T extends { image?: string | null }>(founder: T) {
  return {
    ...founder,
    image: founder.image ? `${BACKEND_HOST}${founder.image}` : null,
  };
}

export async function createFounder(founder: Founder) {
  return defaultPost<{ message: string; founder: Founder }>('/dr-university/founders', founder, true);
}

export async function getAllFounders() {
  const data = await defaultGet<FounderCardProps[]>('/dr-university/founders', false);
  return data.map((f) => ({
    ...withFullImageUrl(f),
    contribution: resolveImageUrlsInContent(f.contribution),
  }));
}

export async function getFounderById(id: number) {
  const data = await defaultGet<FounderCardProps>(`/dr-university/founders/${id}`, false);
  return {
    ...withFullImageUrl(data),
    contribution: resolveImageUrlsInContent(data.contribution),
  };
}

export async function deleteFounder(id: number) {
  return defaultDelete<{ message: string }>(`/dr-university/founders/${id}`, undefined, true);
}

export async function patchFounderById(id: number, founder: Founder) {
  return defaultPatch<{ message: string; founder: Founder }>(`/dr-university/founders/${id}`, founder, true);
}
