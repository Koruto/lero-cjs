const { SlashCommandBuilder } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');
const { checkOngoing } = require('../../util/checkOngoing');
const { nominationTimeTimer } = require('../../util/nominationTimeTimer');
const { Game, define_Variables } = require('../../util/constants');
const { sendNominationWarning } = require('../../util/sendNominationWarning');

//   const Game.twelveHoursInSeconds = 43200; // 12 hours in seconds

const data = new SlashCommandBuilder()
  .setName('nominate')
  .setDescription('Nominates a person for Death!')
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('User to be Nominated')
      .setRequired(true)
  );

async function execute(interaction) {
  const timeOfDay = await define_Variables();
  // Check if user being nominated is playing or not
  const userBeingNominatedId = interaction.options.getUser('user').id;
  const userBeingNominated =
    interaction.guild.members.cache.get(userBeingNominatedId);
  if (!userBeingNominated.roles.cache.has(Game.playingId)) {
    await interaction.reply('Only Nominate playing players');
    return;
  }

  if (interaction.member.roles.cache.has(Game.deadId)) {
    await interaction.reply(
      'Dead people have no rights, so you cannot nominate!'
    );
    return;
  }

  await checkOngoing(interaction);
  await interaction.deferReply('');

  const nominated = userBeingNominated.displayName;
  const nominee = interaction.member.displayName;
  // TODO Also check day,

  const db = await openConnection();
  try {
    const row = await db.get(
      'SELECT * FROM Nominations ORDER BY closingAt DESC LIMIT 1'
    );
    if (row.onGoing) {
      await interaction.editReply(
        `Nomination already onGoing, try again <t:${row.closingAt}:R>`
      );
      return;
    }

    const alreadyNominated = await db.get(
      `SELECT COUNT(*) as count FROM Nominations WHERE day = ? AND nominee = ? AND closingAt <> 0`,
      [timeOfDay.currentDay, nominee]
    );

    if (alreadyNominated.count) {
      await interaction.editReply(
        'You already nominated for the day, cannot nominate again'
      );
      return;
    }

    const alreadyUpForExecution = await db.get(
      `SELECT COUNT(*) as count FROM Nominations WHERE nominated = ? AND votes >= majority AND closingAt <> 0;`,
      [nominated]
    );

    if (alreadyUpForExecution.count) {
      await interaction.editReply(
        `${nominated} is already up for Execution! Give them a break`
      );
      return;
    }

    // Checks Finished, Starting Nomination Process
    // Calculate Finishing Time
    const nominationFinishingTime =
      Math.floor(interaction.createdTimestamp / 1000) +
      Game.twelveHoursInSeconds;

    // Check if Day ends before Nomination ends and Update it accordingly
    const GameRow = await db.get(`SELECT * FROM Game WHERE id = 1`);
    if (nominationFinishingTime > GameRow.closingAt) {
      await db.run(
        ` UPDATE Game SET closingAt = ${nominationFinishingTime} WHERE id = 1`
      );
    }

    // Calculate Majority
    await interaction.guild.members.fetch();
    const aliveMembers = await interaction.guild.members.cache.filter(
      (member) => member.roles.cache.has(Game.aliveId)
    ).size;
    if (Error) console.error();
    // Print out the members with the role
    const majority = Math.floor(aliveMembers / 2) + 1;
    // console.log(`Majority: ${majority}\n Total:${aliveMembers}`);

    let nominationMessage = `\nThe town gathers in the centre for a very needed conversation. ${nominated} has been chosen by ${nominee} and is placed in the centre for everyone to see. It is time to judge their character.\n\n<@&${Game.aliveId}> and <@&${Game.deadId}> if anyone would like for the execution go forward please vote for them.\n\nType /vote for voting\n\nThe vote will be open for 12 hours. You may take back your vote. Just type /unvote.
    `;

    // Checking if previous nomination was succesful
    const newMajority = await db.get(
      `SELECT * FROM Nominations WHERE day = ${timeOfDay.currentDay} AND votes >= majority AND closingAt <> 0 ORDER BY votes DESC LIMIT 1`
    );
    // Check votes column

    if (newMajority) {
      nominationMessage += `\nOne player is already up for execution, to stop that get ${
        newMajority.votes
      } votes, and to make this player nominate get ${
        newMajority.votes + 1
      } votes`;
    } else {
      nominationMessage += `\nCurrent majority is ${majority}`;
    }

    // Adding the Nomination to Database
    await db.run(
      `INSERT INTO Nominations (day, nominated, nominee, _${interaction.user.id}, majority,votes ,closingAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        timeOfDay.currentDay,
        nominated,
        nominee,
        1,
        majority,
        1,
        nominationFinishingTime,
      ]
    );
    await interaction.editReply('Hope you succeed in your Endeavour!');
    await interaction.deleteReply();
    await interaction.channel.send(nominationMessage);
    sendNominationWarning(interaction, nominated, nominee);
    nominationTimeTimer(interaction);
  } catch (err) {
    console.error(err.message);
  } finally {
    await closeConnection(db);
  }

  // Pinging
}

module.exports = {
  data: data,
  execute: execute,
};
