import { IBlog } from '../types/blogs';
import { MICROSERVICE_URL, PUBLIC_CLIENT_KEY } from '@env';
import { IBaseResponse } from '../types/api';
import { Article } from '../types/blogs';
import { apiRequest } from './api.config';

export const getSpecificArticle = (articleId: number) => {
  console.log(articleId, 'articleId');
  return apiRequest.get<IBaseResponse<Article>>({
    path: `/${articleId}`,
    baseUrlOverride: 'https://11ic.pk/api/blogs',
    customHeaders: {
      'X-Client-Key': PUBLIC_CLIENT_KEY,
    },
  });
};

export const getBlogs = (
  category?: string,
): Promise<IBaseResponse<IBlog[]>> => {
  return apiRequest.get<IBaseResponse<IBlog[]>>({
    path: '',
    ...(category && { params: { category } }),
    baseUrlOverride: 'https://11ic.pk/api/blogs',
    customHeaders: {
      'X-Client-Key': PUBLIC_CLIENT_KEY,
    },
  });
};
