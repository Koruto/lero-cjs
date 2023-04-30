const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');

async function define_Variables() {
  const db = await openConnection();
  const variables = await db.all(`SELECT * FROM Nominations`);
  console.log(variables);
  await closeConnection(db);
}
await define_Variables();
