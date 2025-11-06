import { BACKEND_HOST, defaultDelete, defaultGet, defaultPost } from '@/services/api';
import { Founder, SocialPlatform, UploadedImage, Wc3Races } from './founder.model';
import { FounderCardProps } from '@/components/DrUniversity/FounderCard/FounderCard.model';

export async function getSocialPlatforms() {
  const res = await defaultGet<SocialPlatform[]>('/common/social-platforms', true);
  return res;
}

export async function getWc3Races() {
  const res = await defaultGet<Wc3Races[]>('/wc3/races', true);
  return res;
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  return defaultPost<UploadedImage>('/common/images', formData, true);
}

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

export async function deleteFounder(id: number) {
  return defaultDelete<{ message: string }>(`/dr-university/founders/${id}`, undefined, true);
}
