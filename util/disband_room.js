const { Game, define_Variables } = require('./constants');

async function disbandRoom(interaction) {
  const channelId = interaction.channel.id;
  const channel = interaction.guild.channels.cache.get(channelId); // replace with your channel ID

  // Get the existing channel by its ID
  const newChannel = await channel.clone({
    name: `${channel.name.slice(0, -1)}`, // Set the new channel name
    reason: 'Duplicate channel', // Set a reason for the duplication (optional)
  });
  // console.log(newChannel);
  await newChannel.send(`
Welcome to a private room!

Use this room as you'd like.
No one else will see this conversation without someone's permission, so don't worry. All conversations are saved.
  
To leave,  use /leave-room
P.S. If the number of players are less than 2, Chat will be deleted immediately, so make sure they see the messages before leaving the room.`);
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

  await interaction.followUp(`Command Reached!`);
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

module.exports = disbandRoom;
