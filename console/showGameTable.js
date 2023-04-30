const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');

async function define_Variables() {
  const db = await openConnection();
  const variables = await db.all(`SELECT * FROM Game WHERE id = 1`);
  console.log(variables);
  await closeConnection(db);
}
await define_Variables();
