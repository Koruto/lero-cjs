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
      'SELECT * FROM Nominations ORDER BY closingAt DESC LIMIT 1'
    );
    if (row.onGoing) {
      const value = await compareTime(
        interaction.createdTimestamp,
        row.closingAt
      );
      if (!value) {
        await db.run(
          `UPDATE Nominations SET onGoing = 0 WHERE closingAt = ${row.closingAt};
          `
        );
      }
    }
  } catch (err) {
    console.error(err.message);
  }
  await closeConnection(db);
}
module.exports = {
  checkOngoing,
};
