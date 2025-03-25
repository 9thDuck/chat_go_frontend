export interface Message {
  id: string;
  senderId: number;
  receiverId: number;
  content: string;
  attachments?: string[];
  isRead: boolean;
  isDelivered: boolean;
  version: number;
  edited: boolean;
  createdAt: string;
  updatedAt: string;
  localId?: string;
}

export interface StoredMessage extends Message {
  _iv: string;
}

export interface EncryptedMessagePayload {
  message: string;
  iv: string;
}

export interface MessagesResponse {
  data: {
    records: Message[];
    totalRecords: number;
  };
}
