const dbloader = require('better-sqlite3');
const express = require('express');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, './database.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = dbloader(dbPath);

const schema = fs.readFileSync(path.resolve(__dirname, './schema.sql'), 'utf-8');

db.exec(schema);

function seedDemoData() {
    const existing = db.prepare('SELECT COUNT(*) AS total FROM maintenance_logs').get();
    if (existing.total > 0) {
        return;
    }

    const demoLogs = [
        ['Toyota Camry', '2026-04-22', 'Oil Change', 84250, 72.45, 'Full synthetic oil and filter'],
        ['Toyota Camry', '2026-03-10', 'Tire Rotation', 81890, 29.99, 'Rotated tires and checked pressure'],
        ['Toyota Camry', '2026-01-18', 'Brake Inspection', 79240, 0, 'Front pads still in good condition'],
        ['Toyota Camry', '2025-11-05', 'Battery Replacement', 77120, 184.50, 'Installed new battery before winter'],
        ['Toyota Camry', '2025-08-14', 'Air Filter Replacement', 74680, 24.99, 'Replaced engine air filter']
    ];

    const insert = db.prepare('INSERT INTO maintenance_logs (car_model, service_date, service_type, mileage, cost, notes) VALUES (?, ?, ?, ?, ?, ?)');
    const insertMany = db.transaction((logs) => {
        logs.forEach((log) => insert.run(...log));
    });

    insertMany(demoLogs);
}

seedDemoData();

const app = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, './public')));

// Get all maintenance logs
app.get('/api/logs', (req, res) => {
    try{
        const stmt = db.prepare('SELECT * FROM maintenance_logs ORDER BY service_date DESC');
        const logs = stmt.all();
        res.json(logs);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to retrieve logs' });
    }
});

// Add a new maintenance log
app.post('/api/logs', (req, res) => {
    try{
    const { car_model, service_date, service_type, mileage, cost, notes } = req.body;

    if (!car_model || !service_date || !service_type || !mileage) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const stmt = db.prepare('INSERT INTO maintenance_logs (car_model, service_date, service_type, mileage, cost, notes) VALUES (?, ?, ?, ?, ?, ?)')
    .run(car_model, service_date, service_type, mileage, cost, notes);
    
    res.json({ id: stmt.lastInsertRowid });
} catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to add log' });
}
});

// Get maintenance statistics for home page
app.get('/api/stats', (req, res) => {
    try{
        const stmt = db.prepare('SELECT COUNT(*) AS total_services, SUM(cost) AS total_cost, MAX(service_date) AS most_recent_date FROM maintenance_logs');
        const stats = stmt.get();
        if (!stats.most_recent_date) {
            stats.most_recent_date = 'N/A';
        }
        res.json(stats);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to retrieve stats' });
    }
});

// Delete a maintenance log by ID
app.delete('/api/logs/:id', (req, res) => {
    if (!process.env.ADMIN_KEY || req.headers['x-admin-key'] !== process.env.ADMIN_KEY) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    try {
        const { id } = req.params;
        const stmt = db.prepare('DELETE FROM maintenance_logs WHERE id = ?');
        const result = stmt.run(id);
        res.json({ deleted: result.changes > 0 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to delete log' });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
