const { SlashCommandBuilder } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');
const { checkOngoing } = require('../../util/checkOngoing');
const { showVotes } = require('../../util/showVotes');
const { Game } = require('../../util/constants');

const data = new SlashCommandBuilder()
  .setName('unvote')
  .setDescription('Removes your vote from current player being nominated!');

async function execute(interaction) {
  if (!interaction.member.roles.cache.has(Game.playingId)) {
    await interaction.reply('Join the game to use its feature :)');
    return;
  }

  await interaction.deferReply('');
  await checkOngoing(interaction);
  const db = await openConnection();

  try {
    const row = await db.get(
      'SELECT * FROM Nominations ORDER BY closingAt DESC LIMIT 1'
    );
    if (row && row.onGoing) {
      const userPropertyName = '_' + interaction.user.id;
      if (!row[userPropertyName]) {
        await interaction.editReply('Vote before unvoting');
        return;
      }

      await db.run(
        `UPDATE Nominations SET _${interaction.user.id}= ? , votes = votes - 1 WHERE id = ?`,
        ['0', row.id]
      );
      await interaction.editReply('Vote Removed');
      if (interaction.member.roles.cache.has(Game.noVoteId)) {
        await interaction.followUp('You regained your dead vote!');

        interaction.member.roles.remove(Game.noVoteId);
      }

      console.log(`Row updated: ${row.id}`);
    } else {
      await interaction.editReply('No ongoing Nomination');
    }
  } catch (err) {
    console.error(err.message);
  } finally {
    await closeConnection(db);
  }

  // Pinging
  showVotes(interaction);
}

module.exports = {
  data: data,
  execute: execute,
};
