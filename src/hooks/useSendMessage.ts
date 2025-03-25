import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Message } from "@/types/message";
import { toast } from "sonner";

interface SendMessageParams {
  receiverId: number;
  content: string;
  attachments?: string[];
}

// Define a more specific response type that matches the actual API response
interface MessageResponse {
  data: Message;
}

export function useSendMessage() {
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SendMessageParams) => {
      const response = await api.post<MessageResponse>(
        `/messages/${params.receiverId}`,
        {
          content: params.content,
        }
      );
      return {
        response,
        receiverId: params.receiverId,
      };
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    },
  });
}
