import { AuthRepository } from "../repositories/AuthRepository";
import { User } from "../entities/User";

export class RegisterUser {
    constructor(private authRepository: AuthRepository) {}

    async execute(
        email: string,
        password: string,
        displayName: string
    ): Promise<User> {
        // 🟢 VALIDACIONES DE NEGOCIO
        if (!email || !password || !displayName) {
            throw new Error("Todos los campos son requeridos");
        }

        // Validación de formato de email más completa
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            throw new Error("El formato del email no es válido");
        }

        if (password.length < 6) {
            throw new Error("La contraseña debe tener al menos 6 caracteres");
        }

        if (displayName.trim().length < 2) {
            throw new Error("El nombre debe tener al menos 2 caracteres");
        }

        // 🟡 Intentar registrar al usuario
        try {
            return await this.authRepository.register(email, password, displayName);
        } catch (error: any) {
            // 🛑 Manejo de errores específicos
            if (error.message === "EMAIL_ALREADY_IN_USE") {
                throw new Error("Este email ya está registrado. Por favor, utiliza otro.");
            }
            if (error.message === "INVALID_EMAIL") {
                throw new Error("El correo ingresado no es válido.");
            }
            if (error.message === "WEAK_PASSWORD") {
                throw new Error("La contraseña es demasiado débil. Usa una más segura.");
            }
            // 🧩 Cualquier otro error
            throw new Error(error.message || "Error al registrar el usuario");
        }
    }
}
