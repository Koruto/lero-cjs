const { SlashCommandBuilder } = require('discord.js');
const { Game } = require('../../util/constants');

const data = new SlashCommandBuilder()
  .setName('delete-archived-channel')
  .setDescription('Deletes Channel in Archived Category!')
  .setDefaultMemberPermissions(0x0000000000000008);

async function execute(interaction) {
  await interaction.reply(`Deleting Channels in Archived`);
  // Assuming you have already fetched the guild and created the roles

  // Delete all Channel under it
  await interaction.guild.channels.fetch();
  const channels = await interaction.guild.channels.cache.filter(
    (channel) => channel.parentId === Game.archivedCategoryId
  );

  channels.forEach((channel) => {
    channel.delete();
  });
}

module.exports = {
  data: data,
  execute: execute,
};
