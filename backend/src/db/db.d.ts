import sqlite3 from "sqlite3";
export type RunResult = {
    changes: number;
    lastID: number;
};
export declare function getDb(): sqlite3.Database;
export declare function initDb(): Promise<void>;
export declare function run(sql: string, params?: unknown[]): Promise<RunResult>;
export declare function get<T>(sql: string, params?: unknown[]): Promise<T | null>;
export declare function all<T>(sql: string, params?: unknown[]): Promise<T[]>;
export declare function closeDb(): Promise<void>;
//# sourceMappingURL=db.d.ts.map