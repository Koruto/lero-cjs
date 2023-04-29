const { open } = require('sqlite');
const sqlite3 = require('sqlite3').verbose();

async function openConnection(filename = './database/sql.db') {
  const db = await open({
    filename,
    driver: sqlite3.Database,
    mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  });
  console.log('Connected to the database. nomination.js');
  return db;
}

async function closeConnection(db) {
  await db.close();
  console.log('Connection closed.');
}

module.exports = {
  openConnection,
  closeConnection,
};
