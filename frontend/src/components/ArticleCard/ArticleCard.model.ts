import { ArticleLink } from '@/services/news/article.model';

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
  shortDescription: string;
  slug: string;
  image: string;
  links: ArticleLink[];
  createdAt: string;
}
