const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');

async function addPlayer(newPlayerId) {
  const db = await openConnection();
  try {
    const newColumn = `_${newPlayerId}`;

    const defaultNominationsValue = 'BOOLEAN DEFAULT 0';
    const defaultRoomsValue = 'INTEGER DEFAULT 0';

    const columnExistsQuery = (table) => `
      SELECT 1
      FROM pragma_table_info('${table}')
      WHERE name = ?;
    `;

    const checkColumnExists = async (table) => {
      const query = columnExistsQuery(table);
      return db.get(query, [newColumn]);
    };

    const addColumn = async (table, defaultValue) => {
      const alterTableQuery = `ALTER TABLE ${table} ADD ${newColumn} ${defaultValue}`;
      await db.run(alterTableQuery);
    };

    const columnExistsInNominations = await checkColumnExists('Nominations');
    const columnExistsInRooms = await checkColumnExists('Rooms');

    if (!columnExistsInNominations) {
      await addColumn('Nominations', defaultNominationsValue);
    }

    if (!columnExistsInRooms) {
      await addColumn('Rooms', defaultRoomsValue);
    }
  } catch (err) {
    console.error('Error: ', err);
  } finally {
    await closeConnection(db);
  }
}

module.exports = {
  addPlayer,
};
