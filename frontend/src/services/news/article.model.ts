export interface ArticleTypes {
  id: number;
  name: string;
}

export interface ArticleLink {
  link: string;
  platform: string;
  description: string | null;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  image: string;
  typeId: number;
  links: ArticleLink[];
  createdAt: string;
}

export interface ArticleListItem {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  image: string;
  typeId: number;
  links: ArticleLink[];
  createdAt: string;
}

export interface CreateArticleRequest {
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  imageId: number;
  typeId: number;
  links?: {
    id: number;
    url: string;
    text: string;
  }[];
}

export interface CreateArticleResponse {
  message: string;
  article: Article;
}

export interface EditableArticle {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  imageId: number;
  image: string | null;
  typeId: number;
  links: {
    id: number;
    url: string;
    text: string;
  }[];
  createdAt: string;
}
