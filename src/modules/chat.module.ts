import { Module } from "@nestjs/common"
import { ChatGateway } from "src/gateways/chat.gateway"
import { MessageModule } from "./message.module"
import { UserModule } from "./user.module"

@Module({
    imports: [UserModule, MessageModule],
    providers: [ChatGateway],
    controllers: [],
    exports: [],
})
export class ChatModule { }
