import { ForbiddenException } from "@nestjs/common"
import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { MessageService } from "src/services/message.service"
import { UserSerive } from "src/services/user.service"

@WebSocketGateway()
export class ChatGateway implements OnGatewayDisconnect {
    constructor(
        private readonly userService: UserSerive,
        private readonly messageService: MessageService,
    ) { }

    @WebSocketServer()
    server: Server

    handleDisconnect(client: Socket) {
        const user = this.userService.getUserById(client.id)
        client.leave(user.name)
        this.userService.removeUser(client.id)
    }

    @SubscribeMessage('newUser')
    handleNewUser(
        @MessageBody() rawData: string,
        @ConnectedSocket() client: Socket,
    ) {
        const data = JSON.parse(rawData)
        try {
            const res = this.userService.newUser(client.id, data.name)
            client.join(res.name)
            client.emit('newUserResponse', JSON.stringify(res))
        } catch (excp) {
            client.emit('newUserResponse', JSON.stringify(excp))
        }
    }

    @SubscribeMessage('sendMessage')
    handleSendMessage(
        @MessageBody() rawData: string,
        @ConnectedSocket() client: Socket,
    ) {
        const data = JSON.parse(rawData)
        if (!this.userService.verifyUser(data.from, client.id))
            client.emit('sendMessageResponse', JSON.stringify(new ForbiddenException('User not verified!')))
        try {
            const to = this.userService.getUser(data.to)
            const newMessage = this.messageService.newMessage(data.from, data.to, data.message, data.code)
            client.emit('newMessage', JSON.stringify(newMessage))
            this.server.in(to.name).emit('newMessage', JSON.stringify(newMessage))
        } catch (excp) {
            client.emit('sendMessageResponse', JSON.stringify(excp))
        }
    }
}
