const { SlashCommandBuilder } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');

const data = new SlashCommandBuilder()
  .setName('new-day')
  .setDescription('Starts New Day!')
  .setDefaultMemberPermissions(0x0000000000000008);

async function execute(interaction) {
  await interaction.reply(`Starting new day`);
  const db = await openConnection();
  await db.run(`UPDATE Game SET day = day + 1 WHERE id = 1`);
  await closeConnection(db);
  // TODO Change everyine permission to yes

  // Send a confirmation message
  await interaction.followUp('Channels created successfully!');

  const sent = await interaction.followUp({
    content: 'Pinging...',
    fetchReply: true,
  });
  interaction.editReply(
    `Roundtrip latency: ${
      sent.createdTimestamp - interaction.createdTimestamp
    }ms`
  );
}

module.exports = {
  data: data,
  execute: execute,
};
