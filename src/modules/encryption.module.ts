import { Module } from "@nestjs/common"
import { EncryptionService } from "src/services/encryption.service"

@Module({
    imports: [],
    providers: [EncryptionService],
    controllers: [],
    exports: [EncryptionService],
})
export class EncryptionModule { }
