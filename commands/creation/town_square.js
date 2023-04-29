const { SlashCommandBuilder } = require('discord.js');
const defaultId = '1100061376694722693';
const data = new SlashCommandBuilder()
  .setName('town-square')
  .setDescription('Gets Town Square Role!');

async function execute(interaction) {
  const interactionUser = await interaction.guild.members.cache.get(
    interaction.user.id
  );
  interactionUser.roles.add(defaultId);
  await interaction.reply(`Welcome to Town Square!`);

  // User Pinging
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
