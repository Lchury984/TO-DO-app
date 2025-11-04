import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    updateProfile as firebaseUpdateProfile,
    User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/FirebaseConfig";
import { User } from "@/src/domain/entities/User";

export class FirebaseAuthDataSource {
    // ===== MÉTODO PRIVADO: CONVERTIR FIREBASEUSER A USER =====
    private mapFirebaseUserToUser(firebaseUser: FirebaseUser): User {
        return {
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || "Usuario",
            createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
        };
    }

    // ===== REGISTRO DE USUARIO =====
    async register(
        email: string,
        password: string,
        displayName: string
    ): Promise<User> {
        try {
            // 1️⃣ Crear usuario en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // 2️⃣ Actualizar perfil (añadir nombre visible)
            await firebaseUpdateProfile(firebaseUser, { displayName });

            // 3️⃣ Guardar datos adicionales en Firestore
            await setDoc(doc(db, "users", firebaseUser.uid), {
                email,
                displayName,
                createdAt: new Date(),
            });

            // 4️⃣ Retornar usuario mapeado
            return {
                id: firebaseUser.uid,
                email,
                displayName,
                createdAt: new Date(),
            };
        } catch (error: any) {
            console.error("Error registering user:", error);

            // 🧠 Manejo de errores más detallado
            switch (error.code) {
                case "auth/email-already-in-use":
                    throw new Error("EMAIL_ALREADY_IN_USE");
                case "auth/invalid-email":
                    throw new Error("INVALID_EMAIL");
                case "auth/weak-password":
                    throw new Error("WEAK_PASSWORD");
                case "auth/network-request-failed":
                    throw new Error("NETWORK_ERROR");
                case "auth/too-many-requests":
                    throw new Error("TOO_MANY_REQUESTS");
                default:
                    throw new Error(error.message || "UNKNOWN_ERROR");
            }
        }
    }

    // ===== LOGIN =====
    async login(email: string, password: string): Promise<User> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            const userData = userDoc.data();

            return {
                id: firebaseUser.uid,
                email: firebaseUser.email || "",
                displayName: userData?.displayName || firebaseUser.displayName || "Usuario",
                createdAt: userData?.createdAt?.toDate() || new Date(),
            };
        } catch (error: any) {
            console.error("Error logging in:", error);
            if (error.code === "auth/user-not-found") {
                throw new Error("Usuario no encontrado");
            } else if (error.code === "auth/wrong-password") {
                throw new Error("Contraseña incorrecta");
            } else if (error.code === "auth/invalid-credential") {
                throw new Error("Credenciales inválidas");
            }
            throw new Error(error.message || "Error al iniciar sesión");
        }
    }

    // ===== ACTUALIZAR PERFIL =====
    async updateProfile(userId: string, displayName: string): Promise<User> {
        try {
            const firebaseUser = auth.currentUser;
            if (!firebaseUser) throw new Error("No hay usuario autenticado");

            await firebaseUpdateProfile(firebaseUser, { displayName });

            await updateDoc(doc(db, "users", userId), {
                displayName,
                updatedAt: new Date(),
            });

            return {
                id: firebaseUser.uid,
                email: firebaseUser.email || "",
                displayName,
                createdAt: firebaseUser.metadata.creationTime
                    ? new Date(firebaseUser.metadata.creationTime)
                    : new Date(),
            };
        } catch (error: any) {
            console.error("Error updating profile:", error);
            throw new Error(error.message || "Error al actualizar perfil");
        }
    }

    // ===== CERRAR SESIÓN =====
    async logout(): Promise<void> {
        try {
            await signOut(auth);
        } catch (error: any) {
            console.error("Error logging out:", error);
            throw new Error(error.message || "Error al cerrar sesión");
        }
    }

    // ===== OBTENER USUARIO ACTUAL =====
    async getCurrentUser(): Promise<User | null> {
        try {
            const firebaseUser = auth.currentUser;
            if (!firebaseUser) return null;
            return this.mapFirebaseUserToUser(firebaseUser);
        } catch (error) {
            console.error("Error getting current user:", error);
            return null;
        }
    }

    // ===== OBSERVAR CAMBIOS DE AUTENTICACIÓN =====
    onAuthStateChanged(callback: (user: User | null) => void): () => void {
        return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                callback(this.mapFirebaseUserToUser(firebaseUser));
            } else {
                callback(null);
            }
        });
    }
}
