const { SlashCommandBuilder } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');
const { Game, define_Variables, ROOM_LIMIT } = require('../../util/constants');

const data = new SlashCommandBuilder()
  .setName('history')
  .setDescription('Gets history of people talked to that User!')
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('Specify User whos history needed')
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName('day')
      .setDescription('Results history of specific day, Default is current Day')
  );

async function execute(interaction) {
  const timeOfDay = await define_Variables();
  if (timeOfDay.isNightTime) {
    await interaction.reply({
      content: 'Cannot use this command at night',
      ephemeral: true,
    });
    return;
  }
  const userHistory = await interaction.options.getUser('user').username;
  const dayHistory =
    (await interaction.options.getInteger('day')) || timeOfDay.currentDay;

  if (dayHistory > timeOfDay.currentDay) {
    await interaction.reply(`This dude wants future Info! smh`);
    return;
  }

  if (!interaction.member.roles.cache.has(Game.playingId)) {
    await interaction.reply('Join the game to use its feature :)');
    return;
  }

  const taggedUserId = interaction.options.getUser('user').id;
  const taggedUser = interaction.guild.members.cache.get(taggedUserId);
  if (!taggedUser.roles.cache.has(Game.playingId)) {
    await interaction.reply('History only for playing players');
    return;
  }
  await interaction.reply(`History as follows:`);
  const db = await openConnection();
  let query = `SELECT * FROM History WHERE `;

  for (let i = 1; i <= ROOM_LIMIT; i++) {
    query += `user${i} = '${userHistory}' OR `;
  }
  query = query.slice(0, -3);

  let resultsByDay = {};
  let historyMessage = '```';
  try {
    const rows = await db.all(query);
    // Create an object to hold the results grouped by day
    // Iterate through each row and group by day
    for (const row of rows) {
      const day = row.day;
      const resultString = [row.user1, row.user2, row.user3]
        .filter((user) => user !== userHistory && user !== 'none') // Remove the searched user
        .join(' and ');
      if (!resultString) continue;
      if (!resultsByDay[day]) {
        resultsByDay[day] = [`${resultString}`];
      } else {
        resultsByDay[day].push(`${resultString}`);
      }
    }

    // Print the results by day
    if (dayHistory) {
      historyMessage += `\nDay ${dayHistory}:\n`;

      historyMessage +=
        resultsByDay[dayHistory]?.join('\n') ??
        'Town-Square is being introverted';
    }
    // for (const [day, results] of Object.entries(resultsByDay)) {
    //   historyMessage += `\nDay ${day}:\n`;
    //   historyMessage += results.join('\n');
    // }

    historyMessage += '```';
  } catch (err) {
    console.error(err.message);
  } finally {
    await closeConnection(db);
  }

  // Pinging

  await interaction.followUp(`${historyMessage}`);
}

module.exports = {
  data: data,
  execute: execute,
};
