const { SlashCommandBuilder } = require('discord.js');
const { define_Nomination } = require('../../models/nomination');
const { define_History } = require('../../models/history');
const { Sequelize, Model, DataTypes } = require('sequelize');
const playingId = '1101087801925181485';

const data = new SlashCommandBuilder()
  .setName('create-nomination-model')
  .setDescription(
    'Creates the model (to be integrated into new-game at end), Admin Only!'
  );

async function execute(interaction) {
  // Check if User is doing command from Private room or not
  if (interaction.user.id != '404966968005754882') {
    await interaction.reply(`Imposter Detected, SMH Shame on YOU !!`);
    return;
  }

  await interaction.guild.members.fetch();
  const playingMembers = interaction.guild.members.cache
    .filter((member) => member.roles.cache.has(playingId))
    .map((member) => member.user.id);
  // console.log(playingMembers);

  const me = interaction.user.id;
  define_Nomination(playingMembers, me);
  // define_History();  To be added later on

  await interaction.reply('Reached');
  // Pinging
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
