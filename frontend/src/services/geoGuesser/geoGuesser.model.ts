export interface GeoGuesserImages {
  small: string;
  medium: string;
  large: string;
}

export interface GeoGuesser {
  id: number;
  images: GeoGuesserImages;
  createdAt: string;
}

export interface EditableGeoGuesser {
  id: number;
  mapId: number;
  images: GeoGuesserImages;
  createdAt: string;
}

export interface CreateGeoGuesserRequest {
  mapId: number;
  smallImageId?: number;
  mediumImageId?: number;
  largeImageId?: number;
}

export interface CreateGeoGuesserResponse {
  id: number;
  images: GeoGuesserImages;
  createdAt: string;
}

export interface GuessGeoGuesserRequest {
  mapId: number;
}

export interface GuessGeoGuesserResponse {
  correct: boolean;
}
