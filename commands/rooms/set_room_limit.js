const { SlashCommandBuilder } = require('discord.js');
const { modifyRoomsLimit } = require('../../models/modifyRoomsLimit');

const data = new SlashCommandBuilder()
  .setName('set-room-limit')
  .setDescription('Sets the limit for rooms!')
  .addIntegerOption((option) =>
    option
      .setName('limit')
      .setDescription(
        'Negative for unlimited rooms, Positive for specific limits, and Zero to freeze room creation'
      )
      .setRequired(true)
  )
  .setDefaultMemberPermissions(0x0000000000000008);

async function execute(interaction) {
  const newLimit = await interaction.options.getInteger('limit');

  modifyRoomsLimit(newLimit);

  let message = ' ';
  if (newLimit < 0) {
    message = 'Room limit remove. Can create unlimited rooms now';
  } else if (newLimit > 0) {
    message = `Room limit set to ${newLimit} rooms per player each day.`;
  } else {
    message = 'Room creation is now frozen.';
  }

  await interaction.reply(message);

  console.log(`--- NEW ROOMS LIMIT ADDED: ${newLimit} ---`);
}

module.exports = {
  cooldown: 5,
  data: data,
  execute: execute,
};
