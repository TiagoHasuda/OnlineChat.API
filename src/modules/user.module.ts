import { Module } from "@nestjs/common"
import { UserService } from "src/services/user.service"
import { EncryptionModule } from "./encryption.module"

@Module({
    imports: [EncryptionModule],
    providers: [UserService],
    controllers: [],
    exports: [UserService],
})
export class UserModule { }
