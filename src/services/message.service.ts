import { BadRequestException, Injectable } from "@nestjs/common"
import { Message } from "src/models/message.model"

@Injectable()
export class MessageService {
    constructor(
        private readonly messages: { [key: string]: Message[] }
    ) { }

    newMessage(from: string, to: string, message: Uint8Array, code: Uint8Array): Message {
        if (!message) throw new BadRequestException("Cannot send empty message!")
        const newMessage: Message = {
            from,
            to,
            message,
            code,
            date: Date.now(),
        }
        if (!this.messages[`${from}${to}`])
            this.messages[`${to}${from}`].unshift(newMessage)
        else
            this.messages[`${from}${to}`].unshift(newMessage)
        return newMessage
    }

    getMessages(user1: string, user2: string, take: number = 15, skip: number = 0): Message[] {
        if (!this.messages[`${user1}${user2}`] && !this.messages[`${user2}${user1}`]) throw new BadRequestException("Conversation doesn't exist!")
        const key = !this.messages[`${user1}${user2}`] ? `${user2}${user1}` : `${user1}${user2}`
        const res: Message[] = []
        while (take > 0) {
            if (this.messages[key].length < skip + 1) break
            res.unshift(this.messages[key][skip])
            take--
            skip++
        }
        return res
    }
}
