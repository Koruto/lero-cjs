const { SlashCommandBuilder } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');
const { Game } = require('../../util/constants');
const { nominationTimeTimer } = require('../../util/timeOverNomination');

const data = new SlashCommandBuilder()
  .setName('judge')
  .setDescription('Displays current Votes!');

async function execute(interaction) {
  if (Game.isNightTime) {
    await interaction.reply({
      content: 'Cannot use this command at night',
      ephemeral: true,
    });
    return;
  }
  // Check if User is doing command from Private room or not
  let message = '```';

  const db = await openConnection();
  const row = await db.get(
    'SELECT * FROM Nominations ORDER BY createdAt DESC LIMIT 1'
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
    /* Keira's execution player list:
- Winterbed
- Cookedbread
- AllenCaspe9510 (Ghost vote)
- Maglev (Ghost vote)

4/3 votes acquired. Time is up.
Keira is up for execution.
*/
    message += `\n${row.votes}/${row.majority} votes acquired.\n?? votes to hammer.`;
  } else {
    message = 'No Ongoing Nomination Currently';
    return;
  }
  nominationTimeTimer(interaction);

  // Pinging
  message += '```';
  await closeConnection(db);
  await interaction.reply(message);

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
