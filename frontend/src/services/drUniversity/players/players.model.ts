export interface Player {
  id?: number;
  name: string;
  mmr?: number | null;
  country?: string | null;
  races?: number[];
  socialLinks?: {
    id: number;
    link: string;
  }[];
  role?: string;
  contribution?: string;
}

export interface PlayerResponse {
  id: number;
  name: string;
  mmr?: number;
  country?: string;
  role?: string;
  contribution?: string;

  race: {
    nightelf: boolean;
    orc: boolean;
    human: boolean;
    undead: boolean;
  };

  links: {
    platform: string;
    url: string;
  }[];
}
