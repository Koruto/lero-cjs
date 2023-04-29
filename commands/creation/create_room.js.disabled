const { SlashCommandBuilder } = require('discord.js');
const {
  openConnection,
  closeConnection,
} = require('../../database/interactWithDB');
const { Game } = require('../../util/constants');

const data = new SlashCommandBuilder()
  .setName('create-room')
  .setDescription('Creates a new Room!, Don"t use')
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('Users to be added to Room')
      .setRequired(true)
  );

for (let i = 1; i <= 2; i++) {
  data.addUserOption((option) =>
    option.setName(`user${i}`).setDescription(`User ${i}`)
  );
}

async function execute(interaction) {
  if (interaction.user.id != '404966968005754882') {
    await interaction.reply(`Imposter Detected, SMH Shame on YOU !!`);
    return;
  }
  let target = [];
  target.push(interaction.options.getUser('user'));
  for (let i = 1; i <= 2; i++) {
    if (interaction.options.getUser(`user${i}`))
      target.push(interaction.options.getUser(`user${i}`));
  }
  await interaction.reply(`Command Reached! Users: ${target}`);
  try {
    const createdChannel = await interaction.guild.channels.create({
      name: 'new-general',
      reason: 'Needed a cool new channel',
    });
    // const db = await openConnection();
    let query = `INSERT History SET `;

    for (let i = 1; i <= target.length() + 1; i++) {
      query += `user${i} = '${target[i].username}' `;
    }
    console.log(query);
    // await db.run(query);
    // await closeConnection(db);
  } catch (error) {
    console.error(error);
  }

  // Pinging
  const sent = await interaction.followUp({
    content: 'Pinging...',
    fetchReply: true,
  });
  interaction.editReply(
    `Roundtrip latency: ${
      sent.createdTimestamp - interaction.createdTimestamp
    }ms`
  );
}

module.exports = {
  data: data,
  execute: execute,
};
