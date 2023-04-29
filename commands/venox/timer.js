const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timer')
    .setDescription('Test command to set required time'),
  async execute(interaction, message) {
    await interaction.deferReply();
    await interaction.deleteReply();

    await message.channel.send("Started interval: 12s & 48s");

  },
};
