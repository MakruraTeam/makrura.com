import { BACKEND_HOST, defaultDelete, defaultGet, defaultPatch, defaultPost } from '../api';
import {
  GeoGuesser,
  CreateGeoGuesserRequest,
  CreateGeoGuesserResponse,
  GuessGeoGuesserRequest,
  GuessGeoGuesserResponse,
  EditableGeoGuesser,
} from './geoGuesser.model';

function withFullImageUrls(geo: GeoGuesser): GeoGuesser {
  return {
    ...geo,
    images: {
      small: `${BACKEND_HOST}${geo.images.small}`,
      medium: `${BACKEND_HOST}${geo.images.medium}`,
      large: `${BACKEND_HOST}${geo.images.large}`,
    },
  };
}

export function getAllGeoGuesserIds() {
  return defaultGet<number[]>('/geo-guesser', false);
}

export async function getGeoGuesserById(id: number) {
  const data = await defaultGet<GeoGuesser>(`/geo-guesser/${id}`, false);
  return withFullImageUrls(data);
}

export function createGeoGuesser(payload: CreateGeoGuesserRequest) {
  return defaultPost<CreateGeoGuesserResponse>('/geo-guesser', payload, true);
}

export function updateGeoGuesser(id: number, payload: Partial<CreateGeoGuesserRequest>) {
  return defaultPatch<CreateGeoGuesserResponse>(`/geo-guesser/${id}`, payload, true);
}

export function deleteGeoGuesser(id: number) {
  return defaultDelete<void>(`/geo-guesser/${id}`, undefined, true);
}

export function guessGeoGuesser(id: number, payload: GuessGeoGuesserRequest) {
  return defaultPost<GuessGeoGuesserResponse>(`/geo-guesser/${id}/guess`, payload, false);
}

export async function getGeoGuesserAdminById(id: number) {
  const data = await defaultGet<EditableGeoGuesser>(`/geo-guesser/${id}/admin`, true);

  return {
    ...data,
    images: {
      small: `${BACKEND_HOST}${data.images.small}`,
      medium: `${BACKEND_HOST}${data.images.medium}`,
      large: `${BACKEND_HOST}${data.images.large}`,
    },
  };
}
