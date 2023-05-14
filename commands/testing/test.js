const { SlashCommandBuilder, time } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Does testing')
    .setDefaultMemberPermissions(0x0000000000000008),
  async execute(interaction) {
    // interaction.guild is the object representing the Guild in which the command was run
    await interaction.deferReply({
      content: ``,
    });
    await interaction.editReply({
      content: `This server is so quiet.`,
      ephemeral: true,
    });
    await interaction.followUp('Follow Up#1');
    await interaction.followUp('Follow Up#2');
    const date = new Date();

    const timeString = time(date);
    const relative = time(date, 'R');
  },
};
