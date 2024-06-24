const { SlashCommandBuilder } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');

const data = new SlashCommandBuilder()
  .setName('check-limit')
  .setDescription('Check how many rooms can you create!');

async function execute(interaction) {
  const db = await openConnection();

  try {
    const getRoomCountQuery = `SELECT roomLimit FROM Game WHERE id = 1`;
    const game = await db.get(getRoomCountQuery);
    const roomLimit = game.roomLimit;

    const getPlayerLimitQuery = `SELECT _${interaction.user.id} FROM Rooms WHERE id = (SELECT MAX(id) FROM Rooms)`;
    const roomsData = await db.get(getPlayerLimitQuery);
    const playerRoomLimit = roomsData[`_${interaction.user.id}`];

    if (roomLimit === 0) {
      message = 'No more rooms can be created. Room creation is frozen.';
    } else if (roomLimit < 0) {
      message = 'Unlimited rooms can be created. No restrictions.';
    } else {
      const remainingRooms = roomLimit - playerRoomLimit;
      if (remainingRooms <= 0) {
        message = `You have reached your daily room creation limit. ${playerRoomLimit}/${roomLimit}`;
      } else {
        message = `You can create ${remainingRooms} more rooms today. ${playerRoomLimit}/${roomLimit}`;
      }
    }

    await interaction.reply(message);
  } catch (err) {
    console.error('Error: ', err);
    return err;
  } finally {
    await closeConnection(db);
  }
}

module.exports = {
  data: data,
  execute: execute,
};
