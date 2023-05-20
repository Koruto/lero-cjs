const { SlashCommandBuilder, time } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');

const data = new SlashCommandBuilder()
  .setName('time')
  .setDescription('Time left till Day Ends!');

async function execute(interaction) {
  const db = await openConnection();
  const GameRow = await db.get(`SELECT * FROM Game WHERE id = 1`);
  await closeConnection(db);
  const relative = time(GameRow.closingAt, 'R');
  await interaction.reply(`Day ends  ${relative}`);
}

module.exports = {
  data: data,
  execute: execute,
};
