const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');

async function define_Rooms(playingMembers) {
  const db = await openConnection();

  try {
    const columns = playingMembers
      .map((str) => `_${str} INTEGER DEFAULT 0`)
      .join(', ');

    await db.run(`DROP TABLE IF EXISTS Rooms`);
    await db.run(
      `CREATE TABLE Rooms (id INTEGER PRIMARY KEY AUTOINCREMENT, ${columns})`
    );

    await db.run(`INSERT INTO Rooms DEFAULT VALUES`);
    // Close the database
  } catch (err) {
    console.log('Error: ', err);
  } finally {
    await closeConnection(db);
  }
}
module.exports = {
  define_Rooms,
};
