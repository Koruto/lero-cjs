const { SlashCommandBuilder } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');
const { Game, ROOM_LIMIT, define_Variables } = require('../../util/constants');

const data = new SlashCommandBuilder()
  .setName('join-room')
  .setDescription('Joins a Room!')
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('Users to be added to Room')
      .setRequired(true)
  );

for (let i = 1; i <= ROOM_LIMIT - 2; i++) {
  data.addUserOption((option) =>
    option.setName(`user${i}`).setDescription(`User ${i}`)
  );
}

// TODO Players dont add players aside from those playing

async function execute(interaction) {
  const timeOfDay = await define_Variables();

  const interactionUser = await interaction.guild.members.cache.get(
    interaction.user.id
  );

  // Adding players into an array
  let target = [interactionUser.user];
  target.push(await interaction.options.getUser('user'));

  // console.log(await interaction.options.getUser('user'));

  for (let i = 1; i <= ROOM_LIMIT - 2; i++) {
    if (await interaction.options.getUser(`user${i}`))
      target.push(await interaction.options.getUser(`user${i}`));
  }

  let targetNamesSet = new Set();
  let playersNotAvailable = false;

  // Checking players availablity
  // console.log('Before Loop', target);
  for (const user of target) {
    const member = await interaction.guild.members.cache.get(user.id);
    const haveTownSquareRole = await member.roles.cache.has(
      Game.townSquareRole
    );

    targetNamesSet.add(member.displayName);
    if (!haveTownSquareRole) playersNotAvailable = true;
  }

  if (playersNotAvailable) {
    await interaction.reply({
      content: 'Player not available to be added to Private Room',
      ephemeral: true,
    });
    return;
  }
  // Check if there's only one user
  if (targetNamesSet.size == 1) {
    await interaction.reply({
      content: `Don't be a loner, who talks to himself, Pui!`,
      ephemeral: true,
    });
    return;
  }

  const db = await openConnection();
  let message = '';
  let limitReached = false;

  try {
    const getRoomCountQuery = `SELECT roomLimit FROM Game WHERE id = 1`;
    const game = await db.get(getRoomCountQuery);
    const roomLimit = game.roomLimit;

    const getPlayerLimitQuery = `SELECT _${interaction.user.id} FROM Rooms WHERE id = (SELECT MAX(id) FROM Rooms)`;
    const roomsData = await db.get(getPlayerLimitQuery);
    const playerRoomLimit = roomsData[`_${interaction.user.id}`];

    if (roomLimit === 0) {
      message = 'No more rooms can be created. Room creation is frozen.';
      limitReached = true;
    } else if (roomLimit < 0) {
      await db.run(
        `UPDATE Rooms SET _${interaction.user.id} = _${interaction.user.id} + 1 WHERE id = (SELECT MAX(id) FROM Rooms)`
      );
    } else {
      const remainingRooms = roomLimit - playerRoomLimit;

      if (remainingRooms <= 0) {
        message = `You have reached your daily room creation limit. ${playerRoomLimit}/${roomLimit}`;
        limitReached = true;
      } else {
        message = `\nYou can create ${remainingRooms - 1} more rooms today. ${
          playerRoomLimit + 1
        }/${roomLimit}`;

        await db.run(
          `UPDATE Rooms SET _${interaction.user.id} = _${interaction.user.id} + 1 WHERE id = (SELECT MAX(id) FROM Rooms)`
        );
      }
    }
  } catch (err) {
    console.error('Error: ', err);
    return err;
  }

  if (limitReached) {
    await interaction.reply(`${message}.\nNo more rooms can be created today`);
    return;
  }

  let targetNames = '';
  const targetNamesArray = Array.from(targetNamesSet);
  targetNamesArray.forEach((user, index) => {
    targetNames += user;
    if (index < targetNamesArray.length - 2) {
      targetNames += ', ';
    } else if (index == targetNamesArray.length - 2) {
      targetNames += ' and ';
    }
  });
  await interaction.reply(
    `Request Received! Users to be added: ${targetNames}.${message}`
  );

  // Array of available rooms
  // ! Check if Can use the channel directly and just use edit at end

  const channelNames = await interaction.guild.channels.cache
    .filter(
      (channel) =>
        channel.parentId === Game.categoryId &&
        !channel.name.endsWith('_') &&
        channel.name != 'town-square'
    )
    .map((channel) => channel.name);

  // Checking if Room Available
  if (channelNames.length == 0) {
    await interaction.followUp('Oops! All rooms in use, try again afterwards!');
    return;
  }

  // Choosing a random channel
  const randomChannel =
    channelNames[Math.floor(Math.random() * channelNames.length)];

  // ! Add some error before slip that room not avaiblabe
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
      await member.roles.remove(Game.townSquareRole);
    }
  });

  // Changing the Text Channel name, Adding _
  const channel = await interaction.guild.channels.cache
    .find((channel) => channel.name === randomChannel)
    .edit({ name: randomChannel + '_' });

  // Adding to Database

  let query = `INSERT INTO History (day`;
  let values = `) VALUES ( ${timeOfDay.currentDay}`;

  targetNamesArray.forEach((user, index) => {
    query += `, user${index + 1}`;
    values += `, '${user}'`;
  });

  query += values + ')';
  await db.run(query);
  await closeConnection(db);
}

module.exports = {
  cooldown: 5,
  data: data,
  execute: execute,
};
