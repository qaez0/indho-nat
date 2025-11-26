import { useQuery } from '@tanstack/react-query';
import type { IBaseResponse } from '../types/api';
import type { IBlog } from '../types/blogs';
import { apiRequest } from '../services/api.config';
import { MICROSERVICE_URL, PUBLIC_CLIENT_KEY } from '@env';

export const useBlogs = () => {
  const {
    data: blogsData,
    isLoading: isBlogsLoading,
    isFetching: isBlogsFetching,
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      return apiRequest.get<IBaseResponse<IBlog[]>>({
        path: '',
        baseUrlOverride: 'https://11ic.pk/api/blogs',
        customHeaders: {
          'X-Client-Key': PUBLIC_CLIENT_KEY,
        },
      });
    },
  });

  return {
    blogs: blogsData?.data || [],
    isBlogsLoading: isBlogsLoading || isBlogsFetching,
  };
};
