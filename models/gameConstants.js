const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');
const ROOM_LIMIT = 3;

async function define_Game() {
  const db = await openConnection();

  await db.run(`DROP TABLE IF EXISTS Game`);
  await db.run(
    `CREATE TABLE Game (id INTEGER PRIMARY KEY AUTOINCREMENT ,day INTEGER DEFAULT 1, createdAt INTEGER DEFAULT 0)`
  );

  await db.run(`INSERT INTO Game DEFAULT VALUES`);
  // Close the database

  await closeConnection(db);
}
module.exports = {
  define_Game,
};
