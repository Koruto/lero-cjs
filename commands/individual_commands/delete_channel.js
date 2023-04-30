const { SlashCommandBuilder } = require('discord.js');
const { Game, define_Variables } = require('../../util/constants');

const data = new SlashCommandBuilder()
  .setName('delete_channel')
  .setDescription('Deletes Channel!')
  .setDefaultMemberPermissions(0x0000000000000008);

async function execute(interaction) {
  await interaction.reply(`Deleting Channels`);
  // Assuming you have already fetched the guild and created the roles

  // Delete all Channel under it
  await interaction.guild.channels.fetch();
  const channels = await interaction.guild.channels.cache.filter(
    (channel) =>
      channel.parentId === Game.categoryId && channel.name !== 'town-square'
  );

  channels.forEach((channel) => {
    channel.delete();
  });

  const sent = await interaction.followUp({
    content: 'Pinging...',
    fetchReply: true,
  });
  interaction.followUp(
    `Roundtrip latency: ${
      sent.createdTimestamp - interaction.createdTimestamp
    }ms`
  );
}

module.exports = {
  data: data,
  execute: execute,
};
