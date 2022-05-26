import {
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@WebSocketGateway(305)
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  // @SubscribeMessage('msgToServer')
  // handleMessage(client: Socket, payload: string): void {
  //   this.server.emit('msgToClient', payload);
  // }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(JwtAuthGuard)
  handleConnection(client: any, ...args: any[]) {
    client.headers = client.client.request.headers;
    this.logger.log(`Client connected: ${client.id}`);
  }
}
