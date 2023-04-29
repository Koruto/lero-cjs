const { SlashCommandBuilder } = require('discord.js');
const { Game } = require('../../util/constants');

const data = new SlashCommandBuilder()
  .setName('create-rooms')
  .setDescription('Creates the 10 Roles for Chanel, Only for admin dont use it')
  .setDefaultMemberPermissions(0x0000000000000008);

async function execute(interaction) {
  await interaction.reply(`Command Reached! Creating Channels`);
  // Assuming you have already fetched the guild and created the roles

  for (const place in Game.placeRoles) {
    // Create the channel
    const channel = await interaction.guild.channels.create({
      name: place,
    });
    channel.setParent(Game.categoryId);
    channel.edit({
      name: place,
      permissionOverwrites: [
        {
          id: Game.placeRoles[place],
          allow: Game.viewChannelPermission,
        },
        {
          id: interaction.guild.id,
          deny: Game.viewChannelPermission,
        },
      ],
    });
    console.log(`Created channel ${channel.name} with ID ${channel.id}`);
  }

  // Send a confirmation message
  await interaction.followUp('Channels created successfully!');

  const sent = await interaction.followUp({
    content: 'Pinging...',
    fetchReply: true,
  });
  interaction.editReply(
    `Roundtrip latency: ${
      sent.createdTimestamp - interaction.createdTimestamp
    }ms`
  );
}

module.exports = {
  data: data,
  execute: execute,
};
