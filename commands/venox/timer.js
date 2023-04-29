const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timer')
    .setDescription('Test command to set required time'),
  async execute(interaction, client) {
    await interaction.deferReply();
    await interaction.reply("Started interval: 5s");

    const start = Date.now()

     setTimeout(function()
        {
        const end = Date.now();
        interaction.channel.send(`Total time passed:${(end - start)/1000}s`)
        client.channels.cache.get('1100799293079691394').send(`Alternative send method`)
        }, 5000);

  },

}