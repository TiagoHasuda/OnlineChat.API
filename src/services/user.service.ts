import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import { User } from "src/models/user.model"
import { EncryptionService } from "./encryption.service"

@Injectable()
export class UserSerive {
    constructor(
        private readonly encryptionService: EncryptionService,
        private readonly users: { [key: string]: User }
    ) { }

    newUser(client_id: string, name: string): User & { secretKey: Uint8Array } {
        if (!name) throw new BadRequestException("Name not provided!")
        if (!!this.users[name]) throw new ConflictException("Name already in use!")
        const newKeyPair = this.encryptionService.generateKeyPair()
        this.users[name] = {
            id: client_id,
            name,
            publicKey: newKeyPair.publicKey,
        }
        return {
            ...this.users[name],
            secretKey: newKeyPair.secretKey,
        }
    }

    removeUser(client_id: string): boolean {
        const user = Object.keys(this.users).find(key => this.users[key].id === client_id)
        if (!user) return false
        delete this.users[user]
        return true
    }

    verifyUser(name: string, id: string): boolean {
        if (!this.users[name]) return false
        return this.users[name].id === id
    }

    getUser(name: string): User {
        if (!this.users[name]) throw new NotFoundException("User not found!")
        return this.users[name]
    }

    getUserById(id: string): User {
        const find = Object.keys(this.users).find(key => this.users[key].id === id)
        if (!find) return null
        return this.users[find]
    }
}
