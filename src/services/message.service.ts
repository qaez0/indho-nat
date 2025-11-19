import type { IBaseResponse } from '../types/api';
import type {
  IMessageRecord,
  IMessageRecordResponse,
  IMarkMessageAsReadRequest,
} from '../types/message';
import { apiRequest } from './api.config';

export const getMessageRecord = async (
  params: IMessageRecord,
): Promise<IBaseResponse<IMessageRecordResponse>> => {
  return apiRequest.get<IBaseResponse<IMessageRecordResponse>>({
    path: '/Message/MessageRecord',
    params: params as unknown as Record<string, string | number>,
  });
};

export const markMessageAsRead = async (
  messageId: number,
): Promise<IBaseResponse<{ message: string }>> => {
  const data: IMarkMessageAsReadRequest = {
    message_id: messageId.toString(),
  };

  return apiRequest.post<IBaseResponse<{ message: string }>>({
    path: '/Message/MessageView',
    body: data,
  });
};

export const deleteMessage = async (
  messageId: number,
): Promise<IBaseResponse<{ message: string }>> => {
  return apiRequest.delete<IBaseResponse<{ message: string }>>({
    path: `/Message/Delete/${messageId}`,
  });
};
