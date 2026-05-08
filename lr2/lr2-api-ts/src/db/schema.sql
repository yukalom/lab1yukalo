CREATE TABLE IF NOT EXISTS softwareProducts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    version INTEGER NOT NULL CHECK (version > 0),
    licensetype TEXT NOT NULL CHECK (licensetype IN ('Free', 'Commercial', 'Academic')), 
    date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);