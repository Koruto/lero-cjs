const { SlashCommandBuilder } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');

const data = new SlashCommandBuilder()
  .setName('new-day')
  .setDescription('Starts New Day!')
  .setDefaultMemberPermissions(0x0000000000000008);

async function execute(interaction) {
  const endDayTime = Math.floor(interaction.createdTimestamp / 1000) + 1_72_800;
  await interaction.reply(`Starting new day`);
  const db = await openConnection();
  await db.run(
    ` UPDATE Game SET day = day + 1, night = 0, closingAt = ${endDayTime} WHERE id = 1`
  );
  await closeConnection(db);

  const townSquareChannel = await interaction.guild.channels.cache.find(
    (ch) => ch.name === 'town-square'
  );
  await townSquareChannel.permissionOverwrites.edit(interaction.guild.id, {
    SendMessages: true,
  });

  // Send a confirmation message
}

module.exports = {
  data: data,
  execute: execute,
};
