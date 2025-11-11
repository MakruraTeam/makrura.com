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
