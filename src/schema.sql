CREATE TABLE IF NOT EXISTS maintenance_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_model TEXT NOT NULL,
    service_date DATE NOT NULL,
    service_type TEXT NOT NULL,
    mileage INTEGER NOT NULL,
    cost REAL,
    notes TEXT
);