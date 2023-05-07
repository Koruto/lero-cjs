const { SlashCommandBuilder } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');
const { checkOngoing } = require('../../util/checkOngoing');
const { nominationTimeTimer } = require('../../util/timeOverNomination');
const { Game, define_Variables } = require('../../util/constants');
const { sendNominationWarning } = require('../../util/sendNominationWarning');

//   const Game.twelveHoursInMs = 43200; // 12 hours in seconds

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
  if (interaction.channel.name !== 'town-square') {
    await interaction.reply({
      content: `Use command from Town Square`,
      ephemeral: true,
    });
    return;
  }

  const timeOfDay = await define_Variables();

  if (timeOfDay.isNightTime) {
    await interaction.reply({
      content: 'Cannot use this command at night',
      ephemeral: true,
    });
    return;
  }
  //   const db = await openConnection();
  const nominationFinishingTime =
    Math.floor(interaction.createdTimestamp / 1000) + Game.twelveHoursInMs;

  const nominated = await interaction.options.getUser('user').username;
  const nominee = await interaction.user.username;
  // TODO Also check day,

  // Check if User is playing or not
  if (!interaction.member.roles.cache.has(Game.playingId)) {
    await interaction.reply('Join the game to use its feature :)');
    return;
  }

  // Check if user being nominated is playing or not
  const taggedUserId = interaction.options.getUser('user').id;
  const taggedUser = interaction.guild.members.cache.get(taggedUserId);
  if (!taggedUser.roles.cache.has(Game.playingId)) {
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

  const db = await openConnection();
  try {
    const row = await db.get(
      'SELECT * FROM Nominations ORDER BY createdAt DESC LIMIT 1'
    );
    if (row.onGoing) {
      await interaction.reply(
        `Nomination already onGoing, try again <t:${row.createdAt}:R>`
      );
      await closeConnection(db);
      return;
    }
  } catch (err) {
    console.error(err.message);
  }

  const alreadyNominated = await db.get(
    `SELECT COUNT(*) as count FROM Nominations WHERE day = ? AND nominee = ?`,
    [timeOfDay.currentDay, nominee]
  );

  if (alreadyNominated.count) {
    await interaction.reply(
      'You already nominated for the day, cannot nominate again'
    );
    return;
  }

  // Calculate Majority
  await interaction.guild.members.fetch();
  const aliveMembers = await interaction.guild.members.cache.filter((member) =>
    member.roles.cache.has(Game.aliveId)
  ).size;
  if (Error) console.error();
  // Print out the members with the role
  const majority = Math.floor(aliveMembers / 2) + 1;
  console.log(`Majority: ${majority}\n Total:${aliveMembers}`);
  await db.run(
    `INSERT INTO Nominations (day, nominated, nominee, _${interaction.user.id}, majority,votes ,createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
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
  let nominationMessage = '';

  nominationMessage += `
The town gathers in the centre for a very needed conversation. ${nominated} has been chosen by ${nominee} and is placed in the centre for everyone to see. It is time to judge their character.

<@&${Game.aliveId}> and <@&${Game.deadId}> if anyone would like for the execution go forward please vote with:
  
Type /vote for voting
  
The vote will be open for 12 hours. You may take back your vote. Just type /unvote.
`;

  // Checking if previous nomination was succesful
  const newMajority = await db.get(
    `SELECT * FROM Nominations WHERE day = ${timeOfDay.currentDay} AND votes >= majority ORDER BY votes DESC LIMIT 1`
  );
  // Check votes column

  if (newMajority)
    nominationMessage += `
One player is already nominated, to stop that get ${
      newMajority.votes
    } votes, and to make this player nominate get ${
      newMajority.votes + 1
    } votes`;
  else
    nominationMessage += `
Current majority is ${majority}`;

  await closeConnection(db);
  await interaction.reply({ content: `Nomination Received`, ephemeral: true });
  await interaction.channel.send(nominationMessage);
  sendNominationWarning(interaction, nominated, nominee);
  nominationTimeTimer(interaction);

  // Pinging
}

module.exports = {
  data: data,
  execute: execute,
};
