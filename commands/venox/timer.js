const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timer')
    .setDescription('Test command to set required time'),
  async execute(interaction) {
    await interaction.deferReply();
    await interaction.deleteReply();

    await interaction.channel.send("Started interval: 12s & 48s");

  },
};
