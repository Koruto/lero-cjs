const { SlashCommandBuilder } = require('discord.js');
const disbandRoom = require('../../util/disband_room.js');

const ROOM_LIMIT = 3;
const townSquareRole = '1100061376694722693';
const validRooms = [
  'the-blacksmith-shop_',
  'the-infirmary_',
  'the-tavern_',
  'the-main-garden_',
  'the-edge-of-town_',
  'the-train-station_',
  'the-alley_',
  'the-inn_',
  'the-sheriff-station_',
  'the-carpentry-shop_',
];

const data = new SlashCommandBuilder()
  .setName('leave-room')
  .setDescription('Leaves the Private Room!');

async function execute(interaction) {
  // Check if User is doing command from Private room or not
  const roomName = interaction.channel.name;
  if (!validRooms.includes(roomName)) {
    await interaction.reply({
      content: 'Use Command in Private Room',
      ephemeral: true,
    });
    return;
  }

  // Check if the User is in the Private room or not
  const member = interaction.member;

  //   Check if the member has the specific role ID
  if (member.roles.cache.has(townSquareRole)) {
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

  // ! Try to fetch directly the guild
  // await interaction.guild.fetch();
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

  interaction.followUp(
    `There are ${count} members with the role ${role.name}.`
  );
  // TODO Better this Loop , so that it doesnt loop for each member again
  if (count < ROOM_LIMIT) {
    for (const [key, value] of channelMembers.entries()) {
      value.roles.remove(role.id);
      value.roles.add(townSquareRole);
    }
    disbandRoom(interaction);
  }

  // Pinging
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
