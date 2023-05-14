const { SlashCommandBuilder } = require('discord.js');
const { define_Nomination } = require('../../models/nomination');
const { define_History } = require('../../models/history');
const { define_Game } = require('../../models/gameConstants');
const { Game, define_Variables } = require('../../util/constants');

const data = new SlashCommandBuilder()
  .setName('create-nomination-model')
  .setDescription(
    'Creates the model (to be integrated into new-game at end), Admin Only!'
  )
  .setDefaultMemberPermissions(0x0000000000000008);

async function execute(interaction) {
  // Check if User is doing command from Private room or not

  await interaction.guild.members.fetch();
  const playingMembers = interaction.guild.members.cache
    .filter((member) => member.roles.cache.has(Game.playingId))
    .map((member) => member.user.id);
  // console.log(playingMembers);

  define_Nomination(playingMembers);
  define_Game(interaction.createdTimestamp);
  define_History();

  await interaction.reply('Reached');
}

module.exports = {
  data: data,
  execute: execute,
};
