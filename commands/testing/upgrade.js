const { SlashCommandBuilder } = require('discord.js');

const fs = require('fs').promises;
const { checkOngoing } = require('../../util/timeFunctions');
const { Game } = require('../../util/constants');
const { startTimer } = require('../../util/startTimer');

const playingId = '1101087801925181485';
const deadId = '1101602543454408764';
const aliveId = '1101859415767924930';
//   const twelveHoursInMs = 43200; // 12 hours in seconds
const twelveHoursInMs = 60; // 1 minute in seconds

const data = new SlashCommandBuilder()
  .setName('upgrade')
  .setDescription('Test!');

async function type(interaction) {
  await interaction.followUp('Follow up message');
}

async function execute(interaction) {
  startTimer(1682835966171 - interaction.createdTimestamp)
    .then(async () => {
      // Code to execute when promise resolves
      await interaction.followUp('Working');
    })
    .catch((error) => {
      // Code to execute when promise rejects
      console.error(error);
    });

  // Pinging

  const sent = await interaction.reply({
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
