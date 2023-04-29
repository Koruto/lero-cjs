const { SlashCommandBuilder } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');
const { Game } = require('../../util/constants');
const { closeRooms } = require('../../util/close_rooms');

const data = new SlashCommandBuilder()
  .setName('end-day')
  .setDescription('Ends Day!')
  .setDefaultMemberPermissions(0x0000000000000008);

async function execute(interaction) {
  await interaction.reply(`Ending day`);

  //   await interaction.guild.channels.fetch();
  const channel = await interaction.guild.channels.cache.find(
    (ch) => ch.name === 'town-square'
  );

  await channel.permissionOverwrites.edit(interaction.guild.id, {
    SendMessages: false,
  });

  // Fetch channel from parentid
  await interaction.guild.channels.fetch();
  const channels = await interaction.guild.channels.cache.filter(
    (channel) =>
      channel.parentId === Game.categoryId &&
      channel.name.charAt(channel.name.length - 1) === '_'
  );

  for (const room of channels) {
    const roomName = room[1].name;
    // console.log(room, roomName);
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

    const channelMembers = await room[1].members;
    for (const [key, value] of channelMembers.entries()) {
      value.roles.remove(role.id);
      value.roles.add(Game.townSquareRole);
    }
    await closeRooms(room[1]);
  }

  const db = await openConnection();
  await db.run(`UPDATE Game SET night = 1 WHERE id = 1`);
  await closeConnection(db);

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
