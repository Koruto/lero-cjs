const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');

async function define_Game(startingTime) {
  const endDayTime = Math.floor(startingTime / 1000) + 1_72_800;
  const db = await openConnection();

  try {
    await db.run(`DROP TABLE IF EXISTS Game`);
    await db.run(
      `CREATE TABLE Game (id INTEGER PRIMARY KEY AUTOINCREMENT ,day INTEGER DEFAULT 0, night BOOLEAN DEFAULT 0 , roomCount INTEGER DEFAULT 0, roomLimit INTEGER DEFAULT -1, closingAt INTEGER DEFAULT ${endDayTime})`
    );

    await db.run(`INSERT INTO Game DEFAULT VALUES`);
    // Close the database
  } catch (err) {
    console.log('Error: ', err);
    return err;
  } finally {
    await closeConnection(db);
  }
}
module.exports = {
  define_Game,
};
