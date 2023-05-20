const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('stop')
  .setDescription('Stops Day!')
  .setDefaultMemberPermissions(0x0000000000000008);

async function execute(interaction) {
  const channel = await interaction.guild.channels.cache.find(
    (ch) => ch.name === 'town-square'
  );

  await channel.permissionOverwrites.edit(interaction.guild.id, {
    SendMessages: false,
  });
  await interaction.reply('Stopped Day!');
}

module.exports = {
  data: data,
  execute: execute,
};
