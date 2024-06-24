const { SlashCommandBuilder } = require('discord.js');
const { Game } = require('../../util/constants');
const { add_Player } = require('../../models/addPlayer');

const data = new SlashCommandBuilder()
  .setName('add-player')
  .setDescription('Add people in the game!')
  .addUserOption((option) =>
    option
      .setName('new-player')
      .setDescription('Player to be added in the game')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(0x0000000000000008);

async function execute(interaction) {
  const newPlayer = await interaction.options.getUser('new-player');

  const newPlayerMember = await interaction.guild.members.cache.get(
    newPlayer.id
  );

  if (newPlayerMember.roles.cache.has(Game.playingId)) {
    await interaction.reply({
      content: 'Player is already in the game. Choose someone else',
      ephemeral: true,
    });
    return;
  }

  add_Player(newPlayer.id);

  await newPlayerMember.roles.add(Game.townSquareRole);
  await newPlayerMember.roles.add(Game.playingId);
  await newPlayerMember.roles.add(Game.aliveId);

  await interaction.reply(
    `Welcome \nUser Added: ${newPlayerMember.displayName}.\n\nNext Steps:\nFor the added player, if you want to turn them dead, give them dead role, and no vote role if they used their Ghost Vote.\nThank You!`
  );
  console.log(`--- PLAYER ADDED: ${newPlayerMember.displayName} ---`);
}

module.exports = {
  cooldown: 5,
  data: data,
  execute: execute,
};
