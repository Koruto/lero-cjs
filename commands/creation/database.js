const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '..', '..', 'database', 'sql.db');
const data = new SlashCommandBuilder()
  .setName('database')
  .setDescription('Database la!');

async function execute(interaction) {
  // Open or create the database
  const db = new sqlite3.Database(
    dbPath,
    sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the database.');
    }
  );

  // Close the database
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });

  await interaction.reply('Testing');
  // Pinging
  const sent = await interaction.followUp({
    content: 'Pinging...',
    fetchReply: true,
  });
  interaction.editReply(
    `Roundtrip latency: ${
      sent.createdTimestamp - interaction.createdTimestamp
    }ms`
  );
}

module.exports = {
  data: data,
  execute: execute,
};
