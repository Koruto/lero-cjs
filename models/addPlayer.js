const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');

async function add_Player(newPlayerId) {
  const db = await openConnection();
  try {
    const newColumn = `_${newPlayerId}`;
    const defaultValue = 'BOOLEAN DEFAULT 0';

    const columnExistsQuery = `
    SELECT 1
    FROM pragma_table_info('Nominations')
    WHERE name = ?;
  `;
    const columnExists = await db.get(columnExistsQuery, [newColumn]);

    if (!columnExists)
      await db.run(`ALTER TABLE Nominations ADD ${newColumn} ${defaultValue}`);
  } catch (err) {
    console.log('Error: ', err);
  } finally {
    // Close the database
    await closeConnection(db);
  }
}
module.exports = {
  add_Player,
};
