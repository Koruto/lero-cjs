const { SlashCommandBuilder } = require('discord.js');
const { nominationTimeTimer } = require('../../util/nominationTimeTimer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    await interaction.reply('Pong!');
    const message = await interaction.fetchReply();
    message.channel.send(
      `Response Time: ${Date.now() - interaction.createdTimestamp}ms`
    );
    nominationTimeTimer(interaction);
  },
};
