const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');

async function define_Variables() {
  try {
    const db = await openConnection();
    const variables = await db.all(`SELECT * FROM Game WHERE id = 1`);
    console.log(variables);
    await closeConnection(db);
  } catch (error) {
    console.log('Error Executing showGameTable');
    console.error(error);
  }
}
define_Variables();
