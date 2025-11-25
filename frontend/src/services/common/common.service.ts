import { BACKEND_HOST, defaultGet, defaultPost } from '../api';
import { SocialPlatform } from './common.model';

export async function getSocialPlatforms() {
  const res = await defaultGet<SocialPlatform[]>('/common/social-platforms', true);
  return res;
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await defaultPost<{ imageId: number }>('/common/images', formData, true);

  return {
    imageId: res.imageId,
    url: `${BACKEND_HOST}/common/images/${res.imageId}`,
  };
}
