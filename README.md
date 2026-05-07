# CarCare Tracker

CarCare Tracker is a small web app for recording and reviewing vehicle maintenance. It lets you log service records, view maintenance history, delete old records, and see summary stats such as total services, total money spent, and the most recent service date.

## Features

- Log maintenance records with car model, service type, mileage, date, cost, and notes
- View all maintenance records in a history table
- Delete maintenance records
- See dashboard stats on the home page
- Responsive navigation for desktop and mobile
- Local SQLite storage

## Tech Stack

- Node.js
- Express
- better-sqlite3
- SQLite
- HTML, CSS, and vanilla JavaScript

## Getting Started

### Prerequisites

- Node.js installed
- npm installed

### Installation

Install dependencies:

```bash
npm install
```

### Run the App

Start the server:

```bash
node src/server.js
```

Then open:

```text
http://localhost:3000
```

The server creates the `maintenance_logs` table automatically from `src/schema.sql` if it does not already exist.

## Project Structure

```text
Car-Maintenance-Tracker/
|-- package.json
|-- package-lock.json
|-- README.md
`-- src/
    |-- server.js
    |-- schema.sql
    |-- database.db
    `-- public/
        |-- index.html
        |-- log.html
        |-- history.html
        |-- images/
        |-- js/
        `-- styles/
```

## Pages

- `index.html`: Home page with maintenance stats and feature overview
- `log.html`: Form for adding a new maintenance record
- `history.html`: Table of saved maintenance records with delete controls

## API Endpoints

### Get all logs

```http
GET /api/logs
```

Returns all maintenance logs ordered by service date, newest first.

### Add a log

```http
POST /api/logs
```

Required fields:

- `car_model`
- `service_date`
- `service_type`
- `mileage`

Optional fields:

- `cost`
- `notes`

Example request body:

```json
{
  "car_model": "Toyota Camry",
  "service_date": "2026-05-06",
  "service_type": "Oil change",
  "mileage": 85000,
  "cost": 64.99,
  "notes": "Synthetic oil"
}
```

### Get stats

```http
GET /api/stats
```

Returns:

- Total services logged
- Total maintenance cost
- Most recent service date

### Delete a log

```http
DELETE /api/logs/:id
```

Deletes a maintenance log by its database ID.

## Database

The app uses `src/database.db` as its local SQLite database. The schema is defined in `src/schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_model TEXT NOT NULL,
    service_date DATE NOT NULL,
    service_type TEXT NOT NULL,
    mileage INTEGER NOT NULL,
    cost REAL,
    notes TEXT
);
```

## Notes

- The app currently runs on port `3000`.
- Data is stored locally in `src/database.db`.
- There is no authentication, so this project is intended for local or learning use.
