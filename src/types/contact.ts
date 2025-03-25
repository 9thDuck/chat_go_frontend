import { PaginatedResponse } from "./pagination";
import { User } from "./user";

export type ContactsResponse = PaginatedResponse<User>;

export type ContactRequest = {
  senderId: number;
  receiverId: number;
  createdAt: string;
  senderUsername: string;
  receiverUsername: string;
  messageContent: string;
};

export type ContactRequestsResponse = PaginatedResponse<ContactRequest>;
export interface SearchUser {
  id: number;
  username: string;
  publicKey: string;
  isContact: boolean;
  hasPendingRequest: boolean;
}

export interface SearchUsersResponse {
  data: {
    records: SearchUser[];
    totalRecords: number;
  };
}
