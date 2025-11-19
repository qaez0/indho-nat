// Message record request parameters
export interface IMessageRecord {
  page: number;
  pagesize: number;
  read_status?: string;
}

// Message record response item
export interface IMessageRecordItem {
  id: number;
  title: string;
  content: string;
  create_time: string;
  is_seen: boolean;
  status: string;
  read_time: string;
}

// Message record response
export interface IMessageRecordResponse {
  data: IMessageRecordItem[];
  totalItems: number;
  currentPage: number;
  totalPage: number;
  pageSize: number;
}

// Mark message as read request
export interface IMarkMessageAsReadRequest {
  message_id: string;
}
