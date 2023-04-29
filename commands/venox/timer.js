const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timer')
    .setDescription('Test command to set required time'),
  async execute(interaction) {
    await interaction.deferReply();
    await interaction.deleteReply();

    await interaction.channel.send("Started interval: 24s");

     let dayend = setTimeout(Boolean(1), 24000);

    do
    {
        if(dayend == '1')
            {
                interaction.channel.send("Interval completed.")
            }
    }
    while(dayend != '1')
    

    
     

  },
};
