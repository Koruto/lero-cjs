const { SlashCommandBuilder } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');
const { checkOngoing } = require('../../util/timeFunctions');
const { Game } = require('../../util/constants');

const data = new SlashCommandBuilder()
  .setName('unvote')
  .setDescription('Removes your vote from current player being nominated!');

async function execute(interaction) {
  if (Game.isNightTime) {
    await interaction.reply({
      content: 'Cannot use this command at night',
      ephemeral: true,
    });
    return;
  }
  await checkOngoing(interaction);

  if (!interaction.member.roles.cache.has(Game.playingId)) {
    await interaction.reply('Join the game to use its feature :)');
    return;
  }

  const db = await openConnection();

  try {
    const row = await db.get(
      'SELECT * FROM Nominations ORDER BY createdAt DESC LIMIT 1'
    );
    if (row && row.onGoing) {
      const userPropertyName = '_' + interaction.user.id;
      if (!row[userPropertyName]) {
        await interaction.reply('Vote before unvoting');
        return;
      }
      await db.run(
        `UPDATE Nominations SET _${interaction.user.id} = ? WHERE id = ?`,
        ['0', row.id]
      );
      await interaction.reply('Vote Removed');
      if (interaction.member.roles.cache.has(Game.noVoteId)) {
        await interaction.followUp('You regained your dead vote!');

        interaction.member.roles.remove(Game.noVoteId);
      }

      console.log(`Row updated: ${row.id}`);
    } else {
      await interaction.reply('No ongoing Nomination');
    }
  } catch (err) {
    console.error(err.message);
  }

  // Pinging

  await closeConnection(db);

  const sent = await interaction.followUp({
    content: 'Pinging...',
    fetchReply: true,
  });
  interaction.followUp(
    `Roundtrip latency: ${
      sent.createdTimestamp - interaction.createdTimestamp
    }ms`
  );
}

module.exports = {
  data: data,
  execute: execute,
};
