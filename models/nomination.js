const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');

async function define_Nomination(playingMembers) {
  const db = await openConnection();

  const columns = playingMembers
    .map((str) => `_${str} BOOLEAN DEFAULT 0`)
    .join(', ');

  await db.run(`DROP TABLE IF EXISTS Nominations`);
  await db.run(
    `CREATE TABLE Nominations (id INTEGER PRIMARY KEY AUTOINCREMENT, ${columns}, onGoing BOOLEAN DEFAULT 1, day INTEGER DEFAULT 0, nominated TEXT DEFAULT ele, nominee TEXT DEFAULT ele, votes INTEGER DEFAULT 0, majority INTEGER DEFAULT 0 , createdAt INTEGER DEFAULT 0)`
  );

  await db.run(`INSERT INTO Nominations DEFAULT VALUES`);
  // Close the database
  await closeConnection(db);
}
module.exports = {
  define_Nomination,
};
