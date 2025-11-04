import { User } from "../entities/User";
import { AuthRepository } from "../repositories/AuthRepository";

export class UpdateProfile {
    constructor(private authRepository: AuthRepository) {}

    async execute(userId: string, displayName: string): Promise<User> {
        if (!userId) {
            throw new Error("Se requiere ID de usuario");
        }
        if (!displayName.trim()) {
            throw new Error("El nombre no puede estar vacío");
        }
        if (displayName.length < 2) {
            throw new Error("El nombre debe tener al menos 2 caracteres");
        }

        return await this.authRepository.updateProfile(userId, displayName);
    }
}