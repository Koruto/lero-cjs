const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');

async function refreshRoomsLimit() {
  const db = await openConnection();

  try {
    // Insert default values into Rooms table
    const insertDefaultValuesQuery = `
      INSERT INTO Rooms DEFAULT VALUES
    `;
    await db.run(insertDefaultValuesQuery);
    console.log('Inserted default values into Rooms table.');
  } catch (err) {
    console.error('Error: ', err);
    return err;
  } finally {
    await closeConnection(db);
  }
}

module.exports = {
  refreshRoomsLimit,
};
