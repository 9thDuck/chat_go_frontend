import { PaginatedResponse } from "./pagination";
import { ServerUser } from "./user";

export type ContactsResponse = PaginatedResponse<ServerUser>;

export type ServerContactRequest = {
  sender_id: number;
  receiver_id: number;
  created_at: string;
  sender_username: string;
  receiver_username: string;
};

export type ContactRequest = {
  senderId: number;
  receiverId: number;
  createdAt: string;
  senderUsername: string;
  receiverUsername: string;
};

export type ContactRequestsResponse = PaginatedResponse<ServerContactRequest>;
export interface SearchUser {
  id: number;
  username: string;
  public_key: string;
  is_contact: boolean;
  has_pending_request: boolean;
}

export interface SearchUsersResponse {
  data: {
    records: SearchUser[];
    total_records: number;
  };
}