const dbloader = require('better-sqlite3');
const express = require('express');
const path = require('path');
const fs = require('fs');

const db = dbloader(path.resolve(__dirname, './database.db'));

const schema = fs.readFileSync(path.resolve(__dirname, './schema.sql'), 'utf-8');

db.exec(schema);

const app = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, './public')));

// Get all maintenance logs
app.get('/api/logs', (req, res) => {
    try{
        const stmt = db.prepare('SELECT * FROM maintenance_logs ORDER BY service_date DESC');
        const logs = stmt.all();
        console.log('GET /api/logs retrieved:', logs);
        res.json(logs);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to retrieve logs' });
    }
});

// Add a new maintenance log
app.post('/api/logs', (req, res) => {
    console.log('POST /api/logs body:', req.body);
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
    console.log('DELETE /api/logs/:id params:', req.params);
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

console.log('Server is running on http://localhost:3000');
app.listen(3000, '0.0.0.0');