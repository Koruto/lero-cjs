const { SlashCommandBuilder } = require('discord.js');
const { refreshRoomsLimit } = require('../../models/refreshRoomsLimit');

const data = new SlashCommandBuilder()
  .setName('refresh-room-limit')
  .setDescription('Refresh the limit of players room creation')
  .setDefaultMemberPermissions(0x0000000000000008);

async function execute(interaction) {
  refreshRoomsLimit();

  interaction.reply('Room limit refreshed!');
}

module.exports = {
  data: data,
  execute: execute,
};
