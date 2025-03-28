import { createContext, useContext, useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
export const SocketContext = createContext<WebSocket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const { authUser } = useAuthStore();

  useEffect(() => {
    let ws: WebSocket;

    const connect = () => {
      ws = new WebSocket(`${import.meta.env.VITE_WS_BASE_URL}`);

      ws.onopen = () => {
        console.log("Socket Connected to the server");
        setSocket(ws);
        reconnectAttempts.current = 0;
        if (reconnectTimer.current) {
          clearTimeout(reconnectTimer.current);
          reconnectTimer.current = null;
        }
      };

      ws.onclose = (e) => {
        console.log("Socket Disconnected", e.reason);
        setSocket(null);
        if (!authUser) return;
        if (reconnectAttempts.current > 0) {
          toast.error(
            "Error connecting to server with WebSockets. Messages maybe delayed"
          );
        }
        // exponential backoff
        const delay = Math.min(
          import.meta.env.VITE_WS_RECONNECT_INTERVAL *
            Math.pow(2, reconnectAttempts.current),
          import.meta.env.VITE_WS_RECONNECT_MAX_DELAY
        );
        reconnectTimer.current = setTimeout(() => {
          reconnectAttempts.current++;
          connect();
        }, delay);
      };
    };

    connect();

    return () => {
      // Cleanup websocket and any pending reconnects
      if (ws) ws.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [authUser]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const socket = useContext(SocketContext);
  if (!socket) {
    toast.error(
      "Error connecting to server with WebSockets. Messages maybe delayed"
    );
    return null;
  }
  return socket;
}
