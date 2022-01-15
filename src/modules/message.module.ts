import { Module } from "@nestjs/common"
import { MessageService } from "src/services/message.service"

@Module({
    imports: [],
    providers: [MessageService],
    controllers: [],
    exports: [MessageService],
})
export class MessageModule { }
