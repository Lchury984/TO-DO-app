// establece la conexion a la base de datos
import * as SQLite from 'expo-sqlite';
let instance: SQLite.SQLiteDatabase | null = null;
export async function getDb(): Promise<SQLite.SQLiteDatabase> {
    if (instance) return instance;
    const db = await SQLite.openDatabaseAsync('todos.db');
    await db.execAsync(`
        PRAGMA journal_mode=WAL;
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            createdAt TEXT NOT NULL
        );
    `);
    instance = db;
    return db;
}