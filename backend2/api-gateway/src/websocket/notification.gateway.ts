import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, WebSocket } from 'ws';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@app/shared';

@WebSocketGateway({
  path: '/api/notifications/ws',
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients: Map<string, WebSocket> = new Map();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: WebSocket, request: Request): Promise<void> {
    try {
      // Extract token from query params or headers
      const url = new URL(request.url, 'http://localhost');
      const token = url.searchParams.get('token');
      
      if (!token) {
        client.close(1008, 'Unauthorized');
        return;
      }
      
      // Verify JWT token
      const payload = this.jwtService.verify<JwtPayload>(token);
      
      if (!payload?.sub) {
        client.close(1008, 'Invalid token');
        return;
      }
      
      // Store client connection with user ID as key
      this.clients.set(payload.sub, client);
      
      // Send welcome message
      client.send(JSON.stringify({
        event: 'connected',
        data: { message: 'Connected to notification service', userId: payload.sub }
      }));
      
      console.log(`Client connected: ${payload.sub}, total clients: ${this.clients.size}`);
    } catch (error) {
      client.close(1008, 'Authentication failed');
    }
  }

  handleDisconnect(client: WebSocket): void {
    // Find and remove the disconnected client
    for (const [userId, savedClient] of this.clients.entries()) {
      if (savedClient === client) {
        this.clients.delete(userId);
        console.log(`Client disconnected: ${userId}, remaining clients: ${this.clients.size}`);
        break;
      }
    }
  }

  // Method to send notification to a specific user
  sendNotificationToUser(userId: string, notification: any): void {
    const client = this.clients.get(userId);
    
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        event: 'notification',
        data: notification
      }));
    }
  }

  // Method to broadcast notification to all connected clients
  broadcastNotification(notification: any): void {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          event: 'broadcast',
          data: notification
        }));
      }
    });
  }

  @SubscribeMessage('ping')
  handlePing(client: WebSocket): WsResponse<string> {
    return { event: 'pong', data: new Date().toISOString() };
  }
}