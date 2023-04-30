const { SlashCommandBuilder } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');

const data = new SlashCommandBuilder()
  .setName('get-nominations')
  .setDescription('Gives the history of Nomination!')
  .setDefaultMemberPermissions(0x0000000000000008);

async function execute(interaction) {
  const db = await openConnection();

  let query = `SELECT * FROM Nominations`;
  let resultsByDay = {};
  let nominationMessage = '```';
  try {
    const nominations = await db.all(query);

    for (const nomination of nominations) {
      const day = nomination.day;
      const nominee = nomination.nominee;
      const nominatedBy = nomination.nominated;
      const votes = nomination.votes; // get the column value based on the user who nominated
      const majority = nomination.majority;
      let playerVotes = [];
      for (const key in nomination) {
        if (key.startsWith('_') && nomination[key] === 1) {
          playerVotes.push(key.slice(1));
        }
      }
      let memberNames = [];
      for (const id of playerVotes) {
        const member = await interaction.guild.members.fetch(id);
        const memberName = member.displayName;
        memberNames.push(memberName);
      }
      const resultString = `${nomination.id}: '${nominatedBy}' was Nominated by '${nominee}', [${votes}/${majority}] , Voted By: ${memberNames}`;

      if (!resultsByDay[day]) {
        resultsByDay[day] = [`${resultString}`];
      } else {
        resultsByDay[day].push(`${resultString}`);
      }
    }

    // Print the results by day
    for (const [day, results] of Object.entries(resultsByDay)) {
      nominationMessage += `
Day ${day}:\n`;
      nominationMessage += results.join('\n');
    }
    nominationMessage += '```';
  } catch (err) {
    console.error(err.message);
  }

  await closeConnection(db);
  await interaction.reply(nominationMessage);

  // Pinging
}

module.exports = {
  data: data,
  execute: execute,
};
