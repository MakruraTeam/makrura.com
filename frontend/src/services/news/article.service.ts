import { BACKEND_HOST, defaultDelete, defaultGet, defaultPatch, defaultPost } from '../api';
import { Article, ArticleListItem, ArticleTypes, CreateArticleRequest, CreateArticleResponse, EditableArticle } from './article.model';

export function getArticleTypes() {
  return defaultGet<ArticleTypes[]>('/news/article-types', false);
}

export function createArticle(formData: CreateArticleRequest) {
  return defaultPost<CreateArticleResponse>('/news/articles', formData, true);
}

export async function getAllArticles() {
  const data = await defaultGet<ArticleListItem[]>('/news/articles', false);

  return data.map((a) => ({
    ...a,
    image: `${BACKEND_HOST}${a.image}`,
  }));
}

export async function getArticlesByType(typeName: string) {
  const data = await defaultGet<ArticleListItem[]>(`/news/articles/type/${encodeURIComponent(typeName)}`, false);

  return data.map((a) => ({
    ...a,
    image: `${BACKEND_HOST}${a.image}`,
  }));
}

export async function getArticleById(id: number) {
  const data = await defaultGet<EditableArticle>(`/news/articles/${id}`, false);

  return {
    ...data,
    image: data.image ? `${BACKEND_HOST}${data.image}` : null,
  };
}

export async function getArticleBySlug(slug: string) {
  const data = await defaultGet<Article>(`/news/articles/slug/${encodeURIComponent(slug)}`, false);

  return {
    ...data,
    image: data.image ? `${BACKEND_HOST}${data.image}` : null,
  };
}

export async function deleteArticle(id: number) {
  return defaultDelete<{ message: string }>(`/news/articles/${id}`, undefined, true);
}

export async function updateArticle(id: number, formData: CreateArticleRequest) {
  return defaultPatch<CreateArticleResponse>(`/news/articles/${id}`, formData, true);
}
