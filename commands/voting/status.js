const { SlashCommandBuilder } = require('discord.js');
const { define_Variables } = require('../../util/constants');
const { showVotes } = require('../../util/showVotes');

const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription('Displays current Votes!');

async function execute(interaction) {
  if (interaction.channel.name !== 'town-square') {
    await interaction.reply({
      content: `Use command from 'town-square'`,
      ephemeral: true,
    });
    return;
  }
  const timeOfDay = await define_Variables();
  if (timeOfDay.isNightTime) {
    await interaction.reply({
      content: 'Cannot use this command at night',
      ephemeral: true,
    });
    return;
  }
  // Check if User is doing command from Private room or not
  await interaction.reply('Showing Status: ');
  showVotes(interaction);

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
