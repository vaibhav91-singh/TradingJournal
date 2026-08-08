const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'journal.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS journals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        text TEXT,
        driveFileId TEXT,
        quantity REAL,
        entryPrice REAL,
        exitPrice REAL,
        stopLoss REAL,
        target REAL,
        outcome TEXT,
        entryTime DATETIME,
        exitTime DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating table', err.message);
        }
    });
  }
});

module.exports = db;
