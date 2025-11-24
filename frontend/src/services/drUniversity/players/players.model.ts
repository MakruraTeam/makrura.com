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
}

export interface PlayerResponse {
  id: number;
  name: string;
  mmr: number | null;
  country: string | null;

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
