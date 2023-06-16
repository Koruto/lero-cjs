const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');
const { Game } = require('./constants');
const { codeBlock } = require('discord.js');

const { startTimer } = require('./startTimer');

async function nominationTimeTimer(interaction) {
  const db = await openConnection();
  // Check if User is doing command from Private room or not
  let message = '';

  const row = await db.get(
    'SELECT * FROM Nominations ORDER BY closingAt DESC LIMIT 1'
  );
  if (!row) return;
  if (interaction.createdTimestamp >= row.closingAt * 1000) return;

  startTimer(row.closingAt * 1000 - interaction.createdTimestamp)
    .then(async () => {
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

      message += `\n${row.votes}/${row.majority} votes acquired. Time is up.\n`;

      if (row.votes >= row.majority) {
        message += `${row.nominated} is up for execution.`;
      } else if (row.votes == row.majority - 1 && row.upForExecution) {
        message += `Stopped Execution of ${row.playerBeingExecuted}.`;
      } else {
        message += row.upForExecution
          ? `Not Enough votes. ${row.playerBeingExecuted} is again up for execution.`
          : `Not Enough Votes. Execution Failed`;
      }

      // Pinging
      await closeConnection(db);

      const channel = await interaction.guild.channels.cache.find(
        (channel) => channel.name === 'town-square'
      );

      await channel.send(codeBlock(message));
    })
    .catch((error) => {
      // Code to  when promise rejects
      console.error(error);
    });
}

module.exports = {
  nominationTimeTimer,
};
