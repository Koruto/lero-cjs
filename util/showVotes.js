const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');
const { nominationTimeTimer } = require('./nominationTimeTimer');
const { checkOngoing } = require('./checkOngoing');
const { Game } = require('./constants');

async function showVotes(interaction) {
  await checkOngoing(interaction);
  let message = '```';
  const db = await openConnection();
  try {
    const row = await db.get(
      'SELECT * FROM Nominations ORDER BY closingAt DESC LIMIT 1'
    );

    if (row && row.onGoing) {
      message += `${row.nominated}'s execution player list:\n`;
      for (column in row) {
        if (column[0] == '_' && row[column]) {
          const userId = column.slice(1);
          const member = await interaction.guild.members.fetch(userId);
          const voterName = await member.user.username;
          message += `- ${voterName}`;
          message += (await member.roles.cache.has(Game.noVoteId))
            ? ` (Ghost vote)\n`
            : `\n`;
        }
      }

      message += `\n${row.votes}/${row.majority} votes acquired.\n?? votes to hammer.`;
    } else {
      message += 'No Ongoing Nomination Currently';
    }
  } catch (error) {
    console.error(error);
  } finally {
    await closeConnection(db);
  }
  // Pinging
  message += '```';
  await interaction.followUp(message);
  nominationTimeTimer(interaction);
}

module.exports = { showVotes };
