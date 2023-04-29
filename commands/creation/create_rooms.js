const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('create-rooms')
  .setDescription(
    'Creates the 10 Roles for Chanel, Only for admin dont use it'
  );

async function execute(interaction) {
  if (interaction.user.id != '404966968005754882') {
    await interaction.reply(`Imposter Detected, SMH Shame on YOU !!`);
    return;
  }

  await interaction.reply(`Command Reached! Creating Roles`);
  // Assuming you have already fetched the guild and created the roles
  const categoryId = '1100059641498574949';
  const placeRoles = {
    'The Blacksmith Shop': '1100061352636186675',
    'The Infirmary': '1100061354901123153',
    'The Tavern': '1100061357182812311',
    'The Main Garden': '1100061359988813934',
    'The Edge of Town': '1100061361951752225',
    'The Train Station': '1100061364615135242',
    'The Alley': '1100061366733258824',
    'The Inn': '1100061369170149487',
    'The Sheriff Station': '1100061371598647446',
    'The Carpentry Shop': '1100061374241058870',
    'Town Square': '1100061376694722693',
  };
  const viewChannelPermission = '0x0000000000000400';
  for (const place in placeRoles) {
    // Create the channel
    const channel = await interaction.guild.channels.create({
      name: place,
    });
    channel.setParent(categoryId);
    channel.edit({
      name: place,
      permissionOverwrites: [
        {
          id: placeRoles[place],
          allow: viewChannelPermission,
        },
        {
          id: interaction.guild.id,
          deny: viewChannelPermission,
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
