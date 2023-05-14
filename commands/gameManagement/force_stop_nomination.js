const { SlashCommandBuilder } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');

const data = new SlashCommandBuilder()
  .setName('force-stop-nomination')
  .setDescription('Forcefully Stops the Nomination, Admin Only!')
  .addStringOption((option) =>
    option
      .setName('id')
      .setDescription('Id of Nomination to be stopped')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(0x0000000000000008);

async function execute(interaction) {
  // Check if User is doing command from Private room or not

  const db = await openConnection();

  await db.run(`UPDATE Nominations SET closingAt = 0 WHERE id = ?`, [
    interaction.options.getString('id'),
  ]);
  await interaction.reply('Force Stopped Nomination');
  // Close the database
  await closeConnection(db);

  // Pinging
}

module.exports = {
  data: data,
  execute: execute,
};
