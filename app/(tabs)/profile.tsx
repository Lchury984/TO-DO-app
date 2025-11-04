import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/src/presentation/hooks/useAuth';
import { container } from '@/src/di/container';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async () => {
        if (!user) return;

        try {
            setLoading(true);
            await container.updateProfile.execute(user.id, displayName);
            Alert.alert('Éxito', 'Perfil actualizado correctamente');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            router.replace('/(tabs)/login');
        }
    };

    if (!user) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                        {user.displayName?.[0]?.toUpperCase() || 'U'}
                    </Text>
                </View>
                <Text style={styles.emailText}>{user.email}</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Nombre de usuario</Text>
                <TextInput
                    style={styles.input}
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="Tu nombre"
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleUpdateProfile}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Actualizar Perfil</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.logoutButton]}
                    onPress={handleLogout}
                >
                    <Text style={styles.buttonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#007AFF',
        padding: 20,
        alignItems: 'center',
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#0055CC',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatarText: {
        fontSize: 40,
        color: '#fff',
        fontWeight: 'bold',
    },
    emailText: {
        color: '#fff',
        fontSize: 16,
    },
    form: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonDisabled: {
        backgroundColor: '#999',
    },
    logoutButton: {
        backgroundColor: '#FF3B30',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});