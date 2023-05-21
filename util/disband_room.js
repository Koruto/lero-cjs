const { Game } = require('./constants');

async function disbandRoom(interaction) {
  const channelId = interaction.channel.id;
  const channel = interaction.guild.channels.cache.get(channelId); // replace with your channel ID

  // Get the existing channel by its ID
  const newChannel = await channel.clone({
    name: `${channel.name.slice(0, -1)}`, // Set the new channel name
    reason: 'Duplicate channel', // Set a reason for the duplication (optional)
  });
  // console.log(newChannel);

  let startingMessage = '```';
  startingMessage += `Welcome to your own private room!\n\nPlease feel free to use this room to discuss whatever you may need. This is completely private, no other player will be able to see this conversation (All conversations will be saved and shared in the end).\n\nTo leave, use the command: /leave-room\n\nP.S.: Do not forget, if the number of players are less than 2, Chat will be deleted immediately, so make sure they see the messages before leaving the room.`;
  startingMessage += '```';
  await newChannel.send(startingMessage);

  if (channel.parentID !== Game.archivedCategoryId) {
    try {
      await channel.setParent(Game.archivedCategoryId);
      channel.edit({ position: 0 });
      console.log(
        `Moved channel ${channel.name} to category ${Game.archivedCategoryId}`
      );
    } catch (error) {
      console.error(`Failed to move channel ${channel.name}: ${error}`);
    }
  } else {
    console.log(
      `Channel ${channel.name} is already in category ${Game.archivedCategoryId}`
    );
  }
}

module.exports = disbandRoom;
