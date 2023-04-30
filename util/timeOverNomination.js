const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');
const { Game } = require('./constants');
const { startTimer } = require('./startTimer');

async function nominationTimeTimer(interaction) {
  const db = await openConnection();
  // Check if User is doing command from Private room or not
  let message = '```';

  const row = await db.get(
    'SELECT * FROM Nominations ORDER BY createdAt DESC LIMIT 1'
  );
  if (!row) return;
  if (interaction.createdTimestamp >= row.createdAt * 1000) return;
  console.log('working');
  startTimer(row.createdAt * 1000 - interaction.createdTimestamp)
    .then(async () => {
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

      message += `\n${row.votes}/${row.majority} votes acquired. Time is up.\n`;

      message +=
        row.votes >= row.majority
          ? `${row.nominated} is up for execution.`
          : `Not Enough Votes. Execution Failed`;

      // Pinging
      message += '```';
      await closeConnection(db);

      const channel = await interaction.guild.channels.cache.find(
        (channel) => channel.name === 'town-square'
      );

      await channel.send(message);

      const sent = await interaction.followUp({
        content: 'Pinging...',
        fetchReply: true,
      });
      interaction.followUp(
        `Roundtrip latency: ${
          sent.createdTimestamp - interaction.createdTimestamp
        }ms`
      );
    })
    .catch((error) => {
      // Code to  when promise rejects
      console.error(error);
    });
}

module.exports = {
  nominationTimeTimer,
};
