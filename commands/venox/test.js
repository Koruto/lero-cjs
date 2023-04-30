const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('testing')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    await interaction.reply('Pong!');
    const message = await interaction.fetchReply();
    message.channel.send(`Dead people: <@&1101602543454408764>`)
    message.channel.send(`Alive people: <@&1101859415767924930>`)
    message.channel.send(
      `Response Time: ${Date.now() - interaction.createdTimestamp}ms`
    );

  },
};
