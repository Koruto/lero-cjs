const { SlashCommandBuilder } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');
const { checkOngoing } = require('../../util/timeFunctions');
const { Game } = require('../../util/constants');
const { nominationTimeTimer } = require('../../util/timeOverNomination');

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
  if (Game.isNightTime) {
    await interaction.reply({
      content: 'Cannot use this command at night',
      ephemeral: true,
    });
    return;
  }
  //   const db = await openConnection();
  const nominationFinishingTime =
    Math.floor(interaction.createdTimestamp / 1000) + Game.twelveHoursInMs;

  const db = await openConnection();
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

  let message;
  await checkOngoing(interaction);

  try {
    const row = await db.get(
      'SELECT * FROM Nominations ORDER BY createdAt DESC LIMIT 1'
    );
    if (row.onGoing) {
      message = `Nomination already onGoing, wait <t:${row.createdAt}:R> for it to finish`;
    }
  } catch (err) {
    console.error(err.message);
  }

  if (message) {
    await interaction.reply(message);
    return;
  }

  const alreadyNominated = await db.get(
    `SELECT COUNT(*) as count FROM Nominations WHERE day = ? AND nominee = ?`,
    [Game.currentDay, nominee]
  );
  // if (alreadyNominated.count) {
  //   await interaction.reply(
  //     'You already nominated for the day, cannot nominate again'
  //   );
  //   return;
  // }

  // Calculate Majority
  await interaction.guild.members.fetch();
  const aliveMembers = await interaction.guild.members.cache.filter((member) =>
    member.roles.cache.has(Game.aliveId)
  ).size;
  if (Error)
    console.error();
  // Print out the members with the role
  const majority = Math.floor(aliveMembers / 2) + 1;
  console.log(`\nMajority: ${majority} \nTotal: ${aliveMembers}`);

  await db.run(
    `INSERT INTO Nominations (day, nominated, nominee, _${interaction.user.id}, majority ,createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
    [Game.currentDay, nominated, nominee, 1, majority, nominationFinishingTime]
  );
  let nominationMessage = `
The town gathers in the centre for a very needed conversation. ${nominated} is placed in the centre for everyone to see. It is time to judge their character.

@alive and @dead if anyone would like for the execution go forward please vote with:
  
Type /vote for voting
  
The vote will be open for 12 hours(currently 1 minute). You may take back your vote. Just ping me in the centre and tell me so.
`;

  // Checking if previous nomination was succesful
  const newMajority = await db.get(
    `SELECT * FROM Nominations WHERE day = ${Game.currentDay} AND votes >= majority ORDER BY votes DESC LIMIT 1`
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
  await interaction.reply(nominationMessage);
  nominationTimeTimer(interaction);

  // Pinging

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
