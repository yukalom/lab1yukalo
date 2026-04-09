import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

const dbDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

const dbPath = path.join(dbDir, 'app.db');
const db = new sqlite3.Database(dbPath);

db.run('PRAGMA foreign_keys = ON');

export const initDb = () => {
    const schemaPath = path.resolve(__dirname, '../../migrations/001_init.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    db.exec(schema, (err) => {
        if (err) console.error("❌ Помилка БД:", err.message);
        else console.log("✅ База даних SQLite готова до роботи");
    });
};

export default db;