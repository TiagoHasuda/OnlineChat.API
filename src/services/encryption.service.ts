import { Injectable } from "@nestjs/common"
import nacl from 'tweetnacl'
//import naclUtil from 'tweetnacl-util'

@Injectable()
export class EncryptionService {
    generateKeyPair(): nacl.BoxKeyPair {
        return nacl.box.keyPair()
    }

    // generateRandomBytes(): Uint8Array {
    //     return nacl.randomBytes(24)
    // }

    // generateSharedKey(publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array {
    //     return nacl.box.before(publicKey, secretKey)
    // }

    // generateCipherText(message: string, code: Uint8Array, sharedKey: Uint8Array) {
    //     return nacl.box.after(
    //         naclUtil.decodeUTF8(message),
    //         code,
    //         sharedKey,
    //     )
    // }
}
