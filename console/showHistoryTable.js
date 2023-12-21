const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');

async function define_Variables() {
  try {
    const db = await openConnection();
    const variables = await db.all(`SELECT * FROM History`);
    console.log(variables);
    await closeConnection(db);
  } catch (error) {
    console.log('Error Executing showHistoryTable');
    console.error(error);
  }
}
define_Variables();
