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
  await db.run(`UPDATE Game SET night = 0 WHERE id = 1`);
  await closeConnection(db);

  const channel = await interaction.guild.channels.cache.find(
    (ch) => ch.name === 'town-square'
  );
  await channel.permissionOverwrites.edit(interaction.guild.id, {
    SendMessages: true,
  });

  // Send a confirmation message
}

module.exports = {
  data: data,
  execute: execute,
};
