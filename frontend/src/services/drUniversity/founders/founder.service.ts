import { BACKEND_HOST, defaultDelete, defaultGet, defaultPatch, defaultPost } from '@/services/api';
import { Founder } from './founder.model';
import { FounderCardProps } from '@/components/DrUniversity/FounderCard/FounderCard.model';

export async function createFounder(founder: Founder) {
  return defaultPost<{ message: string; founder: Founder }>('/dr-university/founders', founder, true);
}

export async function getAllFounders() {
  const data = await defaultGet<FounderCardProps[]>('/dr-university/founders', false);

  return data.map((f) => ({
    ...f,
    image: `${BACKEND_HOST}${f.image}`,
  }));
}

export async function getFounderById(id: number) {
  const data = await defaultGet<FounderCardProps>(`/dr-university/founders/${id}`, false);

  return {
    ...data,
    image: `${BACKEND_HOST}${data.image}`,
  };
}

export async function deleteFounder(id: number) {
  return defaultDelete<{ message: string }>(`/dr-university/founders/${id}`, undefined, true);
}

export async function patchFounderById(id: number, founder: Founder) {
  return defaultPatch<{ message: string; founder: Founder }>(`/dr-university/founders/${id}`, founder, true);
}
