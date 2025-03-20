import { ContactRequest } from "@/types/contact";

type ServerContactRequest = {
  sender_id: number;
  receiver_id: number;
  created_at: string;
  sender_username: string;
  receiver_username: string;
};

export function transformToClientContactRequest(
  serverRequest: ServerContactRequest
): ContactRequest {
  return {
    senderId: serverRequest.sender_id,
    receiverId: serverRequest.receiver_id,
    createdAt: serverRequest.created_at,
    senderUsername: serverRequest.sender_username,
    receiverUsername: serverRequest.receiver_username,
  };
}
