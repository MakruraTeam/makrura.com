import { defaultGet, defaultPost } from '../api';
import { SocialPlatform, UploadedImage } from './common.model';

export async function getSocialPlatforms() {
  const res = await defaultGet<SocialPlatform[]>('/common/social-platforms', true);
  return res;
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  return defaultPost<UploadedImage>('/common/images', formData, true);
}
