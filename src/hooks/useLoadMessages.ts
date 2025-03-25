import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getMessagesBetweenUsers,
  getMessage,
  storeMessages,
} from "@/lib/offline-storage";
import { Message, MessagesResponse } from "@/types/message";
import { asymDecryptMessage, getSearchParams } from "@/lib/utils";
import { api } from "@/lib/api";
import { useMessagesStore } from "@/store/useMessagesStore";
import { swapLocalMessageWithServerMessageId } from "@/lib/offline-storage";
const MESSAGES_PER_PAGE = 50;

export function useLoadMessages(contactId: number) {
  const { authUser, getPrivateKey, getEncryptionKey } = useAuthStore();
  const { addMessages } = useMessagesStore();

  return useInfiniteQuery({
    queryKey: ["messages", contactId],
    queryFn: async ({ pageParam = 1 }) => {
      if (!authUser) {
        throw new Error("User not authenticated");
      }

      try {
        const encryptionKey = getEncryptionKey();
        const searchParamsArr = [
          `page=${pageParam}`,
          `limit=${MESSAGES_PER_PAGE}`,
          `sort=created_at`,
          `sort_direction=DESC`,
        ];

        const response = await api.get<MessagesResponse>(
          `/messages?${getSearchParams(searchParamsArr)}`
        );
        const serverMessages = response.data.data.records;

        const processedMessages: Message[] = [];
        for (const message of serverMessages) {
          const processedMessage = { ...message };

          if (message.receiverId === authUser.id) {
            // If we are the receiver, decrypt using asymmetric encryption
            try {
              const decryptedContent = asymDecryptMessage(
                message.content,
                getPrivateKey()
              );
              processedMessage.content = decryptedContent;
            } catch (error) {
              console.error("Failed to decrypt received message:", error);
              processedMessage.content =
                "[Encrypted message - unable to decrypt]";
            }
          } else if (message.senderId === authUser.id) {
            try {
              const storedMessage = await getMessage(message.id, encryptionKey);

              if (storedMessage) {
                processedMessage.content = storedMessage.content;
              } else {
                // Handle contact request messages by searching local storage
                const localMessages = await getMessagesBetweenUsers(
                  authUser.id,
                  message.receiverId,
                  encryptionKey
                );

                // Find contact request message by creation time proximity (±5s)
                const contactRequestMessage = localMessages.find(
                  (m) =>
                    Math.abs(
                      new Date(m.createdAt).getTime() -
                        new Date(message.createdAt).getTime()
                    ) < 5000
                );

                if (contactRequestMessage) {
                  await swapLocalMessageWithServerMessageId(
                    contactRequestMessage.id,
                    message.id
                  );
                  processedMessage.content = contactRequestMessage.content;
                }
              }
            } catch (error) {
              console.error("Failed to get sent message:", error);
              processedMessage.content = "[Failed to load]";
            }
          }

          processedMessages.push(processedMessage);
        }

        await storeMessages(processedMessages, encryptionKey);
        const messages = await getMessagesBetweenUsers(
          authUser.id,
          contactId,
          encryptionKey
        );
        addMessages(messages);

        return {
          records: processedMessages,
          totalRecords: response.data.data.totalRecords,
        };
      } catch (error) {
        console.error("Error loading messages:", error);
        throw error;
      }
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage?.records?.length) return undefined;
      const totalPages = Math.ceil(lastPage.totalRecords / MESSAGES_PER_PAGE);
      const nextPage = pages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
}
