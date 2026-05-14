CREATE TABLE IF NOT EXISTS softwareProducts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    version INTEGER NOT NULL CHECK (version > 0),
    licensetype TEXT NOT NULL CHECK (licensetype IN ('Free', 'Commercial', 'Academic')), 
    date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    login TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS license(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    software_id INTEGER,
    license_key TEXT NOT NULL UNIQUE,
    FOREIGN KEY (software_id) REFERENCES softwareProducts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS request(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    software_id INTEGER,
    request_date TEXT NOT NULL,
    FOREIGN KEY (software_id) REFERENCES softwareProducts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

