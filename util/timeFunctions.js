const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');

async function compareTime(discordTime, sqlTime) {
  const onGoing = Math.floor(discordTime / 1000) < sqlTime;
  return onGoing;
}

async function checkOngoing(interaction) {
  const db = await openConnection();
  try {
    const row = await db.get(
      'SELECT * FROM Nominations ORDER BY createdAt DESC LIMIT 1'
    );
    if (row.onGoing) {
      const value = await compareTime(
        interaction.createdTimestamp,
        row.createdAt
      );
      if (!value) {
        await db.run(
          `UPDATE Nominations SET onGoing = 0 WHERE createdAt = ${row.createdAt};
          `
        );
      }
    }
  } catch (err) {
    console.error(err.message);
  }
  closeConnection(db);
}
module.exports = {
  checkOngoing,
};
