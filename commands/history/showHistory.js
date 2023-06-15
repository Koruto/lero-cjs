const { SlashCommandBuilder, codeBlock } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');
const { Game, ROOM_LIMIT, define_Variables } = require('../../util/constants');

const data = new SlashCommandBuilder()
  .setName('history')
  .setDescription('Shows history of people this user talked to!')
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('Specify User whos history needed')
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName('day')
      .setDescription('Shows history of specific day, Default is current Day')
  );

async function execute(interaction) {
  const timeOfDay = await define_Variables();
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

  const taggedUserId = await interaction.options.getUser('user').id;
  const taggedUser = await interaction.guild.members.cache.get(taggedUserId);
  const userHistory = taggedUser.displayName;

  if (!taggedUser.roles.cache.has(Game.playingId)) {
    await interaction.reply('History only for playing players');
    return;
  }
  await interaction.deferReply(``);

  const db = await openConnection();
  let query = `SELECT * FROM History WHERE `;

  for (let i = 1; i <= ROOM_LIMIT; i++) {
    query += `user${i} = '${userHistory}' OR `;
  }
  query = query.slice(0, -3);

  let resultsByDay = {};
  let historyMessage = '';
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
    // Funny Bug here is that if day is 0, the following won't be executed but day can't be 0, so nicely planned :)
    if (dayHistory) {
      historyMessage += `\nDay ${dayHistory}:\n`;

      historyMessage +=
        resultsByDay[dayHistory]?.join('\n') ?? `Hasn't been in a room yet.`;
    }
    // for (const [day, results] of Object.entries(resultsByDay)) {
    //   historyMessage += `\nDay ${day}:\n`;
    //   historyMessage += results.join('\n');
    // }
  } catch (err) {
    console.error(err.message);
  } finally {
    await closeConnection(db);
  }

  // Pinging

  await interaction.editReply(
    `Room History for ${userHistory}:\n${codeBlock(historyMessage)}`
  );
}

module.exports = {
  data: data,
  execute: execute,
};
