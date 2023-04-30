const { SlashCommandBuilder } = require('discord.js');
const disbandRoom = require('../../util/disband_room.js');

const { Game, define_Variables, ROOM_LIMIT } = require('../../util/constants');

const data = new SlashCommandBuilder()
  .setName('leave-room')
  .setDescription('Leaves the Private Room!');

async function execute(interaction) {
  // Check if User is doing command from Private room or not
  const timeOfDay = await define_Variables();

  if (timeOfDay.isNightTime) {
    await interaction.reply({
      content: 'Cannot use this command at night',
      ephemeral: true,
    });
    return;
  }

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

  // TODO Better this Loop , so that it doesnt loop for each member again
  if (count < ROOM_LIMIT) {
    for (const [key, value] of channelMembers.entries()) {
      value.roles.remove(role.id);
      value.roles.add(Game.townSquareRole);
    }
    disbandRoom(interaction);
  } else {
    await interaction.member.roles.remove(role.id);
    await interaction.member.roles.add(Game.townSquareRole);
  }

  // Pinging
}

module.exports = {
  data: data,
  execute: execute,
};
