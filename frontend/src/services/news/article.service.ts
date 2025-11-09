import { defaultGet } from '../api';
import { ArticleTypes } from './article.model';

export async function getArticleTypes() {
  const res = await defaultGet<ArticleTypes[]>('/news/article-types', false);
  return res;
}
