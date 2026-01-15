import { Database } from "bun:sqlite";

const db = new Database("bookings.sqlite");

// Initialize table
db.run(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    date TEXT,
    time TEXT,
    reason TEXT,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Migration: Add image column if it doesn't exist
try {
  db.run("ALTER TABLE bookings ADD COLUMN image TEXT");
} catch (error) {
  // Column likely exists, ignore
}

export default db;
