import { toast } from "@/components/ui/use-toast";
import { useNotificationsStore } from "@/store";

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

class NotificationService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000; // 1 segundo

  constructor(private url: string) {}

  connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("WebSocket conectado");
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        const notification: Notification = JSON.parse(event.data);
        this.handleNotification(notification);
      };

      this.ws.onclose = () => {
        console.log("WebSocket desconectado");
        this.reconnect();
      };

      this.ws.onerror = (error) => {
        console.error("Erro na conexão WebSocket:", error);
      };
    } catch (error) {
      console.error("Erro ao conectar WebSocket:", error);
      this.reconnect();
    }
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(
          `Tentando reconectar (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
        );
        this.connect();
      }, this.reconnectTimeout * this.reconnectAttempts);
    } else {
      console.error("Número máximo de tentativas de reconexão atingido");
    }
  }

  private handleNotification(notification: Notification) {
    // Adiciona a notificação ao store
    useNotificationsStore.getState().addNotification(notification);

    // Mostra o toast
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type,
      action: notification.action && (
        <button
          onClick={() => {
            notification.action?.onClick();
            useNotificationsStore.getState().markAsRead(notification.id);
          }}
          className="text-sm font-medium text-primary hover:text-primary/90"
        >
          {notification.action.label}
        </button>
      ),
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Instância singleton do serviço
export const notificationService = new NotificationService(
  process.env.REACT_APP_WS_URL || "ws://localhost:8080/notifications"
);
