const { time, codeBlock } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');
const { nominationTimeTimer } = require('./nominationTimeTimer');
const { checkOngoing } = require('./checkOngoing');
const { Game } = require('./constants');

async function showVotes(interaction) {
  await checkOngoing(interaction);
  let message = '';
  const db = await openConnection();
  try {
    const row = await db.get(
      'SELECT * FROM Nominations ORDER BY closingAt DESC LIMIT 1'
    );
    let newNominationTime = '';

    if (row && row.onGoing) {
      message += `${row.nominated}'s execution player list:\n`;
      for (column in row) {
        if (column[0] == '_' && row[column]) {
          const userId = column.slice(1);
          const member = await interaction.guild.members.fetch(userId);
          const voterName = await member.displayName;
          message += `- ${voterName}`;
          message += (await member.roles.cache.has(Game.noVoteId))
            ? ` (Ghost vote)\n`
            : `\n`;
        }
      }

      message += `\n${row.votes}/${row.majority} votes acquired.\n?? votes to hammer.`;

      const nominationTime = time(row.closingAt, 'R');
      newNominationTime = `\nCan Nominate Again ${nominationTime}`;
    } else {
      message += 'No Ongoing Nomination Currently';
    }
    message = codeBlock(message);

    const GameRow = await db.get(`SELECT * FROM Game WHERE id = 1`);
    const newDayTime = time(GameRow.closingAt, 'R');

    if (newNominationTime) message += newNominationTime;

    message += `\nDay ends  ${newDayTime}`;
  } catch (error) {
    console.error(error);
  } finally {
    await closeConnection(db);
  }
  // Pinging
  await interaction.followUp(message);
  nominationTimeTimer(interaction);
}

module.exports = { showVotes };
