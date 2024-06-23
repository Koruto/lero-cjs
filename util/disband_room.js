const { Game, messageConstants } = require('./constants');
const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');

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

  const db = await openConnection();
  const GameRow = await db.get(`SELECT * FROM Game WHERE id = 1`);
  await db.run(
    ` UPDATE Game SET roomCount = ${GameRow.roomCount + 1} WHERE id = 1`
  );
  await closeConnection(db);

  if (channel.parentID !== Game.archivedCategoryId) {
    try {
      await channel.setParent(Game.archivedCategoryId);
      channel.edit({
        name: `${GameRow.day}-${GameRow.roomCount + 1}-${channel.name.slice(
          0,
          -1
        )}`,
        position: 0,
      });
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
