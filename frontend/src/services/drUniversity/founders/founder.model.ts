export interface SocialPlatform {
  id: number;
  name: string;
}

export interface Wc3Races {
  id: number;
  name: string;
}

export interface SocialPlatform {
  id: number;
  name: string;
}

export interface Wc3Races {
  id: number;
  name: string;
}

export interface UploadedImage {
  imageId: number;
  message: string;
}

export interface Founder {
  id?: number;
  name: string;
  role: string;
  contribution: string;
  imageId?: number;
  races?: number[];
  socialLinks?: {
    id: number;
    link: string;
  }[];
}
