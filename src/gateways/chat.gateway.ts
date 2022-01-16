import { ForbiddenException } from "@nestjs/common"
import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { Message } from "src/models/message.model"
import { MessageService } from "src/services/message.service"
import { UserService } from "src/services/user.service"

@WebSocketGateway()
export class ChatGateway implements OnGatewayDisconnect {
    constructor(
        private readonly userService: UserService,
        private readonly messageService: MessageService,
    ) { }

    @WebSocketServer()
    server: Server

    handleDisconnect(client: Socket) {
        const user = this.userService.getUserById(client.id)
        if (!!user) {
            client.leave(user.name)
            this.messageService.clearMessages(user.name)
        }
        this.userService.removeUser(client.id)
    }

    @SubscribeMessage('newUser')
    handleNewUser(
        @MessageBody() data: [{ name: string }],
        @ConnectedSocket() client: Socket,
    ) {
        try {
            const res = this.userService.newUser(client.id, data[0].name)
            client.join(res.name)
            client.emit('newUserResponse', res)
        } catch (excp) {
            client.emit('newUserResponse', excp)
        }
    }

    @SubscribeMessage('getUser')
    handleGetUser(
        @MessageBody() data: [{ name: string }],
        @ConnectedSocket() client: Socket,
    ) {
        try {
            const find = this.userService.getUser(data[0].name)
            client.emit('getUserResponse', find)
        } catch (excp) {
            client.emit('getUserResponse', excp)
        }
    }

    @SubscribeMessage('sendMessage')
    handleSendMessage(
        @MessageBody() rawData: [Message],
        @ConnectedSocket() client: Socket,
    ) {
        const data = rawData[0]
        if (!this.userService.verifyUser(data.from, client.id))
            return client.emit('sendMessageResponse', new ForbiddenException('User not verified!'))
        try {
            const to = this.userService.getUser(data.to)
            const from = this.userService.getUser(data.from)
            const newMessage = this.messageService.newMessage(data.from, data.to, new Uint8Array(data.message), new Uint8Array(data.code), data.date)
            newMessage.fromPublicKey = from.publicKey
            newMessage.toPublicKey = to.publicKey
            client.emit('newMessage', newMessage)
            this.server.in(to.name).emit('newMessage', newMessage)
        } catch (excp) {
            client.emit('sendMessageResponse', excp)
        }
    }

    @SubscribeMessage('getHistory')
    handleGetHistory(
        @MessageBody() rawData: [{ from: string, to: string }],
        @ConnectedSocket() client: Socket,
    ) {
        const data = rawData[0]
        try {
            const history = this.messageService.getMessages(data.from, data.to)
            client.emit('getHistoryResponse', history)
        } catch (excp) {
            client.emit('getHistoryResponse', excp)
        }
    }

    @SubscribeMessage('sendTyping')
    handleSendTyping(
        @MessageBody() rawData: [{ from: string, to: string }],
        @ConnectedSocket() client: Socket,
    ) {
        const data = rawData[0]
        this.server.in(data.to).emit('typing', data)
    }
}
