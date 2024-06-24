const { SlashCommandBuilder } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');
const { Game } = require('../../util/constants');

const data = new SlashCommandBuilder()
  .setName('remove-player')
  .setDescription('Remove people in the game!')
  .addUserOption((option) =>
    option
      .setName('remove-player')
      .setDescription('Player to be removed in the game')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(0x0000000000000008);

async function execute(interaction) {
  const oldPlayer = await interaction.options.getUser('remove-player');

  const oldPlayerMember = await interaction.guild.members.cache.get(
    oldPlayer.id
  );

  if (!oldPlayerMember.roles.cache.has(Game.playingId)) {
    await interaction.reply({
      content: 'Can only remove playing member',
      ephemeral: true,
    });
    return;
  }

  await oldPlayerMember.roles.remove(Game.playingId);

  const db = await openConnection();

  try {
    const row = await db.get(
      'SELECT * FROM Nominations ORDER BY closingAt DESC LIMIT 1'
    );
    const userPropertyName = '_' + oldPlayer.id;

    if (row && row.onGoing && row[userPropertyName]) {
      await db.run(
        `UPDATE Nominations SET _${oldPlayer.id} = ?, votes = votes - 1 WHERE id = ?`,
        ['0', row.id]
      );

      console.log(`Row updated: ${row.id}`);
    }
  } catch (err) {
    console.error(err.message);
  } finally {
    await closeConnection(db);
  }

  await interaction.reply(
    `I see dead people.\nUser removed: ${oldPlayerMember.displayName}\nNext Steps:\n1. Remove any extra roles from the removed player, and give spectator if you want.\nThank You!`
  );

  console.log(`--- PLAYER REMOVED: ${oldPlayerMember.displayName} ---`);
}

module.exports = {
  cooldown: 5,
  data: data,
  execute: execute,
};
