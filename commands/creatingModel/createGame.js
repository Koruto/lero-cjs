const { SlashCommandBuilder } = require('discord.js');
const { define_Game } = require('../../models/gameConstants');

const data = new SlashCommandBuilder()
  .setName('update-game-database')
  .setDescription('Updates Game Database! (In Development, DO NOT USE THIS !!)')
  .setDefaultMemberPermissions(0x0000000000000008);

async function execute(interaction) {
  await interaction.reply(`Command Reached! Creating Only Game Database`);
  // Assuming you have already fetched the guild and created the roles

  define_Game(interaction.createdTimestamp);

  await interaction.followUp('Initialization complete!');
}

module.exports = {
  data: data,
  execute: execute,
};
