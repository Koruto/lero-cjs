const { SlashCommandBuilder } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');
const { Game } = require('../../util/constants');

const townSquareRole = '1100061376694722693';
const playingRole = '';
const categoryId = '1100059641498574949';

const data = new SlashCommandBuilder()
  .setName('join-room')
  .setDescription('Joins a Room!')
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('Users to be added to Room')
      .setRequired(true)
  );

for (let i = 1; i <= 1; i++) {
  data.addUserOption((option) =>
    option.setName(`user${i}`).setDescription(`User ${i}`)
  );
}

// TODO Players dont add players aside from those playing

async function execute(interaction) {
  // If Condition for Wrong Access
  const interactionUser = await interaction.guild.members.cache.get(
    interaction.user.id
  );
  if (interaction.channel.name != 'town-square') {
    await interaction.reply({
      content: 'Use the Command only in Town Square',
      ephemeral: true,
    });
    return;
  }
  if (!interactionUser.roles.cache.has(townSquareRole)) {
    await interaction.reply({
      content: 'Command only for people in Town Square',
      ephemeral: true,
    });
    return;
  }

  // Adding players into an array
  let target = [interactionUser.user];
  target.push(await interaction.options.getUser('user'));
  // ! Give the room limit here
  for (let i = 1; i <= 1; i++) {
    if (await interaction.options.getUser(`user${i}`))
      target.push(await interaction.options.getUser(`user${i}`));
  }

  let playersNotAvailable;
  // Checking players availablity
  target.forEach(async (user) => {
    const member = await interaction.guild.members.cache.get(user.id);
    if (!member.roles.cache.has(townSquareRole)) playersNotAvailable = true;
  });

  if (playersNotAvailable) {
    await interaction.reply({
      content: 'Player not available to be added to Private Room',
      ephemeral: true,
    });
    return;
  }
  await interaction.reply(`Request Received! Users to be added: ${target}`);

  // Array of available rooms
  // ! Check if Can use the channel directly and just use edit at end
  const channelNames = await interaction.guild.channels.cache
    .filter(
      (channel) =>
        channel.parentId === categoryId &&
        !channel.name.endsWith('_') &&
        channel.name != 'town-square'
    )
    .map((channel) => channel.name);

  // Choosing a random channel
  const randomChannel =
    channelNames[Math.floor(Math.random() * channelNames.length)];

  // Converting Channel to valid Role Name, 'town-square' to 'Town Square'
  const roleOfRandomChannel = randomChannel
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Adding Role to the User
  const role = await interaction.guild.roles.cache.find(
    (r) => r.name === roleOfRandomChannel
  );
  target.forEach(async (user) => {
    const member = await interaction.guild.members.cache.get(user.id);
    if (role) {
      await member.roles.add(role.id);
      await member.roles.remove(townSquareRole);
    }
  });

  // Changing the Text Channel name, Adding _
  const channel = await interaction.guild.channels.cache
    .find((channel) => channel.name === randomChannel)
    .edit({ name: randomChannel + '_' });

  // Adding to Database
  const db = await openConnection();
  let query = `INSERT INTO History (day`;
  let values = `) VALUES ( ${Game.currentDay}`;

  for (let i = 0; i < target.length; i++) {
    if (target[i]) {
      query += `, user${i + 1}`;
      values += `, '${target[i].username}'`;
    }
  }
  query += values + ')';
  await db.run(query);
  await closeConnection(db);

  // User Pinging
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
