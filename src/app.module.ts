import { Module } from '@nestjs/common'
import { ChatModule } from './modules/chat.module'
import { EncryptionModule } from './modules/encryption.module'
import { MessageModule } from './modules/message.module'
import { UserModule } from './modules/user.module'

@Module({
  imports: [
    MessageModule,
    EncryptionModule,
    UserModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
