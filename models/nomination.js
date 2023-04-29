const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, '..', 'database', 'sql.db');

function define_Nomination(playingMembers, me) {
  const db = new sqlite3.Database(
    dbPath,
    sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the database. nomination.js');
    }
  );

  const columns = playingMembers
    .map((str) => `_${str} BOOLEAN DEFAULT 0`)
    .join(', ');

  db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS Nominations`);
    db.run(
      `CREATE TABLE Nominations (id INTEGER PRIMARY KEY AUTOINCREMENT, ${columns}, onGoing BOOLEAN DEFAULT 1, day INTEGER DEFAULT 0, nominated TEXT DEFAULT ele, nominee TEXT DEFAULT ele, votes INTEGER DEFAULT 0, majority INTEGER DEFAULT 0 , createdAt INTEGER DEFAULT 0)`
    );
  });
  db.run(`INSERT INTO Nominations DEFAULT VALUES`);
  // Close the database
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}
module.exports = {
  define_Nomination,
};
