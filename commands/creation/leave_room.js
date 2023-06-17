const { SlashCommandBuilder } = require('discord.js');
const disbandRoom = require('../../util/disband_room.js');

const { Game } = require('../../util/constants');

const data = new SlashCommandBuilder()
  .setName('leave-room')
  .setDescription('Leaves the Private Room!');

async function execute(interaction) {
  // Check if User is doing command from Private room or not

  const roomName = interaction.channel.name;
  if (!Game.validRooms.includes(roomName)) {
    await interaction.reply({
      content: 'Use Command in Private Room',
      ephemeral: true,
    });
    return;
  }

  // Check if the User is in the Private room or not
  const member = interaction.member;

  //   Check if the member has the specific role ID
  if (member.roles.cache.has(Game.townSquareRole)) {
    await interaction.reply({
      content: 'You cannot leave from the general area!',
      ephemeral: true,
    });
    return;
  }

  // Working Code
  await interaction.reply('Commencing Transfer!');

  const roleName = roomName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .slice(0, -1);

  await interaction.guild.roles.fetch();
  await interaction.guild.members.fetch();

  const role = await interaction.guild.roles.cache.find(
    (role) => role.name === roleName
  );

  let count = 0; // As Current user role will be removed

  const channelMembers = await interaction.channel.members;
  for (const [key, value] of channelMembers.entries()) {
    if (value._roles.includes(role.id)) count++;
  }

  // TODO Better this Loop , so that it doesnt loop for each member again, also dont loop players aside from playing
  // TODO bot gives them role too
  if (count <= 2) {
    for (const [key, value] of channelMembers.entries()) {
      if (value._roles.includes(role.id)) {
        value.roles.remove(role.id);
        value.roles.add(Game.townSquareRole);
      }
    }
    disbandRoom(interaction);
  } else {
    await interaction.member.roles.remove(role.id);
    await interaction.member.roles.add(Game.townSquareRole);
  }

  // Pinging
}

module.exports = {
  cooldown: 5,
  data: data,
  execute: execute,
};
