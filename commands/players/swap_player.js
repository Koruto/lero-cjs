const { SlashCommandBuilder } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');
const { Game } = require('../../util/constants');
const { addPlayer } = require('../../models/addPlayer');

const data = new SlashCommandBuilder()
  .setName('swap-player')
  .setDescription('Swap people in the game!')
  .addUserOption((option) =>
    option
      .setName('new-player')
      .setDescription('Player to be added in the game')
      .setRequired(true)
  )
  .addUserOption((option) =>
    option
      .setName('remove-player')
      .setDescription('Player to be removed in the game')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(0x0000000000000008);

async function execute(interaction) {
  const newPlayer = await interaction.options.getUser('new-player');
  const oldPlayer = await interaction.options.getUser('remove-player');

  const newPlayerMember = await interaction.guild.members.cache.get(
    newPlayer.id
  );
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

  if (newPlayerMember.roles.cache.has(Game.playingId)) {
    await interaction.reply({
      content: 'Player is already in the game. Choose someone else',
      ephemeral: true,
    });
    return;
  }

  addPlayer(newPlayer.id);

  await newPlayerMember.roles.add(Game.townSquareRole);
  await newPlayerMember.roles.add(Game.playingId);
  await newPlayerMember.roles.add(Game.aliveId);

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
    `The future is yours!\nUser Added: ${newPlayerMember.displayName}\nUser Removed: ${oldPlayerMember.displayName}\nNext Steps:\n1. Remove any extra roles from the removed player, and give spectator if you want.\n2. For the added player, if you want to turn them dead, give them dead role, and no vote role if they used their Ghost Vote.\nThank You!`
  );

  console.log(`--- PLAYER REMOVED: ${oldPlayerMember.displayName} ---`);
  console.log(`--- PLAYER ADDED: ${newPlayerMember.displayName} ---`);
}

module.exports = {
  cooldown: 5,
  data: data,
  execute: execute,
};
