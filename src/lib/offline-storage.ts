import Dexie, { Table } from "dexie";
import { Message, StoredMessage } from "@/types/message";
import { bytesToHex, hexToBytes } from "@noble/ciphers/utils";
import { createEncryption } from "@/lib/encryption";

interface PrivateKeyStore {
  userId: number;
  encryptedKey: string;
}

// Create a typed Dexie class
class DuckChatDB extends Dexie {
  messages!: Table<StoredMessage>;
  privateKeys!: Table<PrivateKeyStore>;

  constructor() {
    super("duck-chat-idb");
    this.version(1).stores({
      messages: "++id, [senderId+receiverId], createdAt",
      privateKeys: "userId, encryptedKey",
    });
  }
}

const db = new DuckChatDB();

// Initialize database
export async function initStorage(): Promise<void> {
  if (!db.isOpen()) {
    await db.open();
  }
}

// Private key operations
export async function storePrivateKey(
  userId: number,
  privateKey: string,
  encryptionKey: string
): Promise<void> {
  await initStorage();
  const encryption = createEncryption(encryptionKey);
  const encrypted = encryption.encrypt(privateKey);

  await db.privateKeys.put({
    userId,
    encryptedKey:
      bytesToHex(encrypted.ciphertext) + ":" + bytesToHex(encrypted.nonce),
  });
}

export async function getPrivateKey(
  userId: number,
  encryptionKey: string
): Promise<string | null> {
  try {
    await initStorage();
    const stored = await db.privateKeys.get(userId);

    if (!stored) {
      console.warn(`No private key found for userId: ${userId}`);
      return null;
    }

    const encryption = createEncryption(encryptionKey);
    const [ciphertext, nonce] = stored.encryptedKey.split(":");

    return encryption.decrypt({
      ciphertext: hexToBytes(ciphertext),
      nonce: hexToBytes(nonce),
    });
  } catch (error) {
    console.error("Error retrieving private key:", error);
    throw error;
  }
}

// Message operations
export async function storeMessage(
  message: Message,
  encryptionKey: string
): Promise<void> {
  await initStorage();
  if (await checkMessageExists(message.id)) return;
  const encryption = createEncryption(encryptionKey);
  const encrypted = encryption.encrypt(message.content);

  const storedMessage: StoredMessage = {
    ...message,
    content: bytesToHex(encrypted.ciphertext),
    _iv: bytesToHex(encrypted.nonce),
  };

  await db.messages.put(storedMessage);
}

export async function storeMessages(
  messages: Message[],
  encryptionKey: string
): Promise<void> {
  await initStorage();
  const newMessages = await Promise.all(
    messages.filter(async (message) => {
      return !(await checkMessageExists(message.id));
    })
  );

  const encryption = createEncryption(encryptionKey);
  const messagesWithEncryptedContent = newMessages
    .map((message) => {
      try {
        const encrypted = encryption.encrypt(message.content);
        return {
          ...message,
          content: bytesToHex(encrypted.ciphertext),
          _iv: bytesToHex(encrypted.nonce),
        };
      } catch (error) {
        console.error("Error encrypting message:", error);
        return null;
      }
    })
    .filter((message) => message !== null);

  await db.messages.bulkPut(messagesWithEncryptedContent);
}

export async function getMessage(
  messageId: string,
  encryptionKey: string
): Promise<Message | null> {
  try {
    await initStorage();
    const storedMessage = await db.messages.get(messageId);
    if (!storedMessage) {
      return null;
    }

    const encryption = createEncryption(encryptionKey);
    const decrypted = encryption.decrypt({
      ciphertext: hexToBytes(storedMessage.content),
      nonce: hexToBytes(storedMessage._iv),
    });

    return {
      ...storedMessage,
      content: decrypted,
    };
  } catch (error) {
    console.error("Error retrieving message:", error);
    return null;
  }
}

export async function getMessagesBetweenUsers(
  senderId: number,
  receiverId: number,
  encryptionKey: string
): Promise<Message[]> {
  try {
    await initStorage();

    const storedMessages = await db.messages
      .where("[senderId+receiverId]")
      .equals([senderId, receiverId])
      .or("[senderId+receiverId]")
      .equals([receiverId, senderId])
      .toArray();
    if (!storedMessages.length) {
      return [];
    }

    const messages: Message[] = [];
    const encryption = createEncryption(encryptionKey);

    for (const storedMessage of storedMessages) {
      try {
        const decrypted = encryption.decrypt({
          ciphertext: hexToBytes(storedMessage.content),
          nonce: hexToBytes(storedMessage._iv),
        });

        messages.push({
          ...storedMessage,
          content: decrypted,
        });
      } catch (error) {
        console.error("Failed to decrypt message:", error);
        messages.push({
          ...storedMessage,
          content: "[Encrypted message - unable to decrypt]",
        });
      }
    }

    return messages.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return [];
  }
}

export async function swapLocalMessageWithServerMessageId(
  localMessageId: string,
  serverMessageId: string
): Promise<void> {
  await initStorage();
  await db.messages.update(localMessageId, { id: serverMessageId });
}

export async function checkMessageExists(messageId: string): Promise<boolean> {
  await initStorage();
  const count = await db.messages.where({ id: messageId }).count();
  return count > 0;
}

export async function deleteMessage(localMessageId: string): Promise<void> {
  await initStorage();
  await db.messages.delete(localMessageId);
}
