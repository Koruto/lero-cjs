const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timer')
    .setDescription('Test command to set required time'),
  async execute(interaction) {
    await interaction.deferReply();
    await interaction.deleteReply();

    await interaction.channel.send("Started interval: 24s");
    const start = Date.now()
     setTimeout(function()
        {
        const end = Date.now();
        interaction.channel.send(`Total time passed:${(end - start)/1000}s`)
        }, 24000);

    

  },

}