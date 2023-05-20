const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('resume')
  .setDescription('Resumes Day!')
  .setDefaultMemberPermissions(0x0000000000000008);

async function execute(interaction) {
  const channel = await interaction.guild.channels.cache.find(
    (ch) => ch.name === 'town-square'
  );

  await channel.permissionOverwrites.edit(interaction.guild.id, {
    SendMessages: true,
  });
  await interaction.reply('Resumes Day!');
}

module.exports = {
  data: data,
  execute: execute,
};
