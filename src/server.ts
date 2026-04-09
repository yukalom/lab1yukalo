import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db, { initDb } from './database/db';
db.serialize(() => {
    const checkQuery = "SELECT COUNT(*) as count FROM software";
    db.get(checkQuery, (err, row: any) => {
        if (row && row.count === 0) {
            const id1 = uuidv4();
            const id2 = uuidv4();
            const userId = uuidv4();
            
            db.run("INSERT INTO users (id, username, email) VALUES ('" + userId + "', 'Margarita', 'margo@test.com')");
            
            db.run("INSERT INTO software (id, name, version, developer, price) VALUES ('" + id1 + "', 'Photoshop', '2024', 'Adobe', 29.99)");
            db.run("INSERT INTO software (id, name, version, developer, price) VALUES ('" + id2 + "', 'VS Code', '1.87', 'Microsoft', 0.00)");
            
            db.run("INSERT INTO reviews (id, software_id, user_id, rating, comment) VALUES ('" + uuidv4() + "', '" + id1 + "', '" + userId + "', 5, 'Great tool!')");
            
            console.log("✅ Тестові дані додано");
        }
    });
});
const app = express();
app.use(express.json());

initDb();

app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${Date.now() - start}ms`);
    });
    next();
});

app.get('/api/software', (req: Request, res: Response) => {
    const { developer, sortBy } = req.query;
    let query = "SELECT * FROM software WHERE 1=1";
    
    if (developer) {
        query += " AND developer = '" + developer + "'";
    }
    
    if (sortBy === 'name') {
        query += " ORDER BY name ASC";
    }
    
    query += " LIMIT 20";

    db.all(query, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows, total: rows.length });
    });
});

app.get('/api/software/:id', (req: Request, res: Response) => {
    const query = "SELECT * FROM software WHERE id = '" + req.params.id + "'";
    
    db.get(query, (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Not Found" });
        res.json(row);
    });
});

app.post('/api/software', (req: Request, res: Response) => {
    const { name, version, developer, price } = req.body;
    
    if (!name || price === undefined) {
        return res.status(400).json({ error: "VALIDATION_ERROR", message: "Required fields missing" });
    }

    const id = uuidv4();
    const query = "INSERT INTO software (id, name, version, developer, price) VALUES ('" + 
                  id + "', '" + name + "', '" + (version || '1.0') + "', '" + (developer || 'Unknown') + "', " + price + ")";

    db.run(query, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ id, name, version, developer, price });
    });
});

app.put('/api/software/:id', (req: Request, res: Response) => {
    const { name, price } = req.body;
    const query = "UPDATE software SET name = '" + name + "', price = " + price + " WHERE id = '" + req.params.id + "'";

    db.run(query, function(err) {
        if (err) return res.status(400).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Not Found" });
        res.json({ message: "Updated" });
    });
});

app.delete('/api/software/:id', (req: Request, res: Response) => {
    const query = "DELETE FROM software WHERE id = '" + req.params.id + "'";

    db.run(query, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(this.changes > 0 ? 204 : 404).send();
    });
});

app.get('/api/software-reviews/:id', (req: Request, res: Response) => {
    const query = "SELECT s.name as softwareName, r.comment, r.rating, u.username " +
                  "FROM software s " +
                  "LEFT JOIN reviews r ON s.id = r.software_id " +
                  "LEFT JOIN users u ON r.user_id = u.id " +
                  "WHERE s.id = '" + req.params.id + "'";

    db.all(query, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

app.get('/api/stats', (req: Request, res: Response) => {
    const query = "SELECT COUNT(*) as count, AVG(price) as avgPrice FROM software";
    
    db.get(query, (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
        error: {
            code: "SERVER_ERROR",
            message: err.message || "Internal Server Error"
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 http://localhost:${PORT}`);
});