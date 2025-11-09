export enum Platform {
  'TIKTOK' = 'tiktok',
  'YOUTUBE' = 'youtube',
  'LIQUIPEDIA' = 'liquipedia',
  'SOOP' = 'soop',
  'TWITCH' = 'twitch',
  'INSTAGRAM' = 'instagram',
  'TWITTER' = 'twitter',
  'REDDIT' = 'reddit',
  'W3CHAMPIONS' = 'w3champions',
}

export interface ArticleCardProps {
  title: string;
  text: string;
  links: { link: string; platform: Platform; description: string }[];
  image: string;
}
