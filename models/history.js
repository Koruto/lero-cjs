const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');
const ROOM_LIMIT = 3;

async function define_History() {
  const db = await openConnection();

  let userColumns = '';
  for (let i = 1; i <= ROOM_LIMIT; i++) {
    userColumns += `, user${i} TEXT DEFAULT none `;
  }

  await db.run(`DROP TABLE IF EXISTS History`);
  await db.run(
    `CREATE TABLE History (id INTEGER PRIMARY KEY AUTOINCREMENT ${userColumns}, day INTEGER DEFAULT 0, createdAt INTEGER DEFAULT 0)`
  );

  await db.run(`INSERT INTO History DEFAULT VALUES`);
  // Close the database

  await closeConnection(db);
}
module.exports = {
  define_History,
};
