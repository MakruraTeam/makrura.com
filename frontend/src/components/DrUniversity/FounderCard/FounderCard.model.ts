export interface FounderCardProps {
  image: string;
  name: string;
  role: string;
  race: {
    nightelf?: boolean;
    orc?: boolean;
    human?: boolean;
    undead?: boolean;
  };
  contribution: string;
  tiktok?: string;
  youtube?: string;
  liquipedia?: string;
  soop?: string;
  twitch?: string;
  instagram?: string;
  twitter?: string;
  reddit?: string;
  w3champions?: string;
}
