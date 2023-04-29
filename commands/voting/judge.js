const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, '..', '..', 'database', 'sql.db');

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
  await interaction.reply('.');
  const db = new sqlite3.Database(
    dbPath,
    sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the database. nomination.js');
    }
  );

  db.get(
    'SELECT * FROM Nominations ORDER BY createdAt DESC LIMIT 1',
    [],
    async (err, row) => {
      if (err) {
        console.error(err.message);
      }
      if (row && row.onGoing) {
        let voteCount = 'Users who voted are: ';
        for (column in row) {
          if (column[0] == '_' && row[column]) {
            const userId = column.slice(1);
            const member = await interaction.guild.members.fetch(userId);
            const voterName = await member.user.username;
            voteCount += voterName + ' ';
          }
        }
        // console.log(row);
        await interaction.editReply(voteCount);
      } else {
        await interaction.editReply('No Ongoing Nomination Currently');
        return;
      }
    }
  );

  // Pinging

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });

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
