const { SlashCommandBuilder } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');
const { checkOngoing } = require('../../util/checkOngoing');
const { showVotes } = require('../../util/showVotes');

const { Game, define_Variables } = require('../../util/constants');

const data = new SlashCommandBuilder()
  .setName('vote')
  .setDescription('Vote for the current player being nominated!');

async function execute(interaction) {
  if (interaction.channel.name !== 'town-square') {
    await interaction.reply({
      content: `Use command from 'town-square'`,
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

  if (interaction.member.roles.cache.has(Game.noVoteId)) {
    await interaction.reply('You`ve already used your one Dead vote.');
    return;
  }
  if (!interaction.member.roles.cache.has(Game.playingId)) {
    await interaction.reply('Join the game to use its feature :)');
    return;
  }

  await interaction.deferReply('');
  await checkOngoing(interaction);
  const db = await openConnection();

  // TODO   prevent dual voting, create unvote command, remove no vote role, if they voted before or not

  try {
    const row = await db.get(
      'SELECT * FROM Nominations ORDER BY closingAt DESC LIMIT 1'
    );
    if (row && row.onGoing) {
      const userPropertyName = '_' + interaction.user.id;
      if (row[userPropertyName]) {
        await interaction.editReply(`You've already voted`);
        return;
      }
      await db.run(
        `UPDATE Nominations SET _${interaction.user.id} = ?, votes = votes + 1 WHERE id = ?`,
        ['1', row.id]
      );
      await interaction.editReply('Vote Confirmed');
      if (interaction.member.roles.cache.has(Game.deadId)) {
        await interaction.followUp('Your one dead vote is used up!');
        interaction.member.roles.add(Game.noVoteId);
      }

      console.log(`Row updated: ${row.id}`);
    } else {
      await interaction.editReply('No ongoing Nomination');
    }
  } catch (err) {
    console.error(err.message);
  } finally {
    await closeConnection(db);
  }

  // Pinging

  showVotes(interaction);
}

module.exports = {
  data: data,
  execute: execute,
};
