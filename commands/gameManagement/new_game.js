const { SlashCommandBuilder, time } = require('discord.js');
const { define_Nomination } = require('../../models/nomination');
const { define_History } = require('../../models/history');
const { define_Game } = require('../../models/gameConstants');
const { Game, messageConstants } = require('../../util/constants');

const data = new SlashCommandBuilder()
  .setName('new-game')
  .setDescription('Starts a New Game!');

async function execute(interaction) {
  await interaction.reply(`Command Reached! Starting new game`);
  // Assuming you have already fetched the guild and created the roles

  // Create channel
  for (const place in Game.placeRoles) {
    // Create the channel

    const channel = await interaction.guild.channels.create({
      name: place,
    });
    await channel.setParent(Game.categoryId);
    if (place == 'Town Square') {
      await channel.edit({
        permissionOverwrites: [
          {
            id: Game.placeRoles[place],
            allow: Game.viewChannelPermission,
          },
          {
            id: Game.spectatorId,
            allow: Game.viewChannelPermission,
          },
          {
            id: interaction.guild.id,
            deny: [Game.sendMessagePermission, Game.viewChannelPermission],
          },
        ],
      });
    } else {
      await channel.edit({
        permissionOverwrites: [
          {
            id: Game.placeRoles[place],
            allow: Game.viewChannelPermission,
          },
          {
            id: Game.spectatorId,
            allow: Game.viewChannelPermission,
            deny: Game.sendMessagePermission,
          },
          {
            id: interaction.guild.id,
            deny: Game.viewChannelPermission,
          },
        ],
      });
    }
    if (place !== 'Town Square')
      await channel.send(messageConstants.privateRoomStartingMessage);

    console.log(`Created channel ${channel.name} with ID ${channel.id}`);
  }

  // Defines Database
  await interaction.guild.members.fetch();

  // Giving Roles Automatically

  const pendingMembers = await interaction.guild.members.cache.filter(
    (member) => member.roles.cache.has(Game.pendingId)
  );
  for (const member of pendingMembers.values()) {
    await member.roles.add([Game.playingId, Game.aliveId, Game.townSquareRole]);
    await member.roles.remove(Game.pendingId);
  }

  const playingMembers = await interaction.guild.members.cache
    .filter((member) => member.roles.cache.has(Game.playingId))
    .map((member) => member.user.id);

  define_Nomination(playingMembers);
  define_Game(interaction.createdTimestamp);
  define_History(); //To be added later on

  // Send a confirmation message
  await interaction.followUp('Game Initializing complete!');
}

module.exports = {
  data: data,
  execute: execute,
};
