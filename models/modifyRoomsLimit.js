const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');

async function modifyRoomsLimit(newRoomCount) {
  const db = await openConnection();

  try {
    const getRoomCountQuery = `SELECT roomLimit FROM Game WHERE id = 1`;
    const updateRoomCountQuery = `UPDATE Game SET roomLimit = ? WHERE id = 1`;

    // Fetch the current roomCount
    const game = await db.get(getRoomCountQuery);

    if (game) {
      console.log('Current roomCount:', game.roomCount);

      await db.run(updateRoomCountQuery, [newRoomCount]);
      console.log('Updated roomCount to:', newRoomCount);
    } else {
      console.log('Game table is empty or the row with id 1 does not exist');
    }
  } catch (err) {
    console.error('Error: ', err);
    return err;
  } finally {
    await closeConnection(db);
  }
}

module.exports = {
  modifyRoomsLimit,
};
