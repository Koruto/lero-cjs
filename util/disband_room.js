const { Game, messageConstants } = require('./constants');

async function disbandRoom(interaction) {
  const channelId = interaction.channel.id;
  const channel = interaction.guild.channels.cache.get(channelId); // replace with your channel ID

  // Get the existing channel by its ID
  const newChannel = await channel.clone({
    name: `${channel.name.slice(0, -1)}`, // Set the new channel name
    reason: 'Duplicate channel', // Set a reason for the duplication (optional)
  });
  // console.log(newChannel);

  await newChannel.send(messageConstants.privateRoomStartingMessage);

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
