const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');

async function define_Variables() {
  try {
    const db = await openConnection();
    const variables = await db.all(`SELECT * FROM Nominations`);
    console.log(variables);
    await closeConnection(db);
  } catch (error) {
    console.log('Error Executing showNominationTable');
    console.error(error);
  }
}
define_Variables();
