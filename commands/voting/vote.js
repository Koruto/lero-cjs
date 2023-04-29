const { SlashCommandBuilder } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');
const { checkOngoing } = require('../../util/timeFunctions');

const { Game } = require('../../util/constants');

const data = new SlashCommandBuilder()
  .setName('vote')
  .setDescription('Vote for the current player being nominated!');

async function execute(interaction) {
  await checkOngoing(interaction);

  if (interaction.member.roles.cache.has(Game.noVoteId)) {
    await interaction.reply('You`ve already used your one Dead vote.');
    return;
  }
  if (!interaction.member.roles.cache.has(Game.playingId)) {
    await interaction.reply('Join the game to use its feature :)');
    return;
  }

  const db = await openConnection();

  // TODO   prevent dual voting, create unvote command, remove no vote role, if they voted before or not

  try {
    const row = await db.get(
      'SELECT * FROM Nominations ORDER BY createdAt DESC LIMIT 1'
    );
    if (row && row.onGoing) {
      await db.run(
        `UPDATE Nominations SET _${interaction.user.id} = ?, votes = votes + 1 WHERE id = ?`,
        ['1', row.id]
      );
      await interaction.reply('Vote Confirmed');
      if (interaction.member.roles.cache.has(Game.deadId)) {
        await interaction.followUp('Your one dead vote is used up!');
        interaction.member.roles.add(Game.noVoteId);
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
