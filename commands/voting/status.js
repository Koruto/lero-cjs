const { SlashCommandBuilder } = require('discord.js');
const { showVotes } = require('../../util/showVotes');

const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription('Displays current Votes!');

async function execute(interaction) {
  await interaction.reply({ content: 'Showing Status: ', ephemeral: true });
  showVotes(interaction);
}

module.exports = {
  data: data,
  execute: execute,
};
