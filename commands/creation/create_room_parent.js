// Convert this code so it works when leaving room

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('create-room_in_category')
  .setDescription('Creates a new Room inside a Category!, Don"t use')
  .addUserOption((option) =>
    option.setName('user').setDescription('Users to be added to Room')
  );

async function execute(interaction) {
  if (interaction.user.id != '404966968005754882') {
    await interaction.reply(`Imposter Detected, SMH Shame on YOU !!`);
    return;
  }
  //   await interaction.reply(`Command Reached!`);
  //   const categoryId = '881071692414345247'; // replace with your category ID
  //   const channel = interaction.guild.channels.cache.get('1098259685573926962'); // replace with your channel ID

  //   if (channel.parentID !== categoryId) {
  //     try {
  //       await channel.setParent(categoryId);
  //       console.log(`Moved channel ${channel.name} to category ${categoryId}`);
  //     } catch (error) {
  //       console.error(`Failed to move channel ${channel.name}: ${error}`);
  //     }
  //   } else {
  //     console.log(`Channel ${channel.name} is already in category ${categoryId}`);
  //   }
  const existingChannel = interaction.guild.channels.cache.get(
    '1097847772947959839'
  ); // Get the existing channel by its ID
  const newChannel = await existingChannel.clone({
    name: `Copy of ${existingChannel.name}`, // Set the new channel name
    reason: 'Duplicate channel', // Set a reason for the duplication (optional)
  });
  await interaction.reply(`Command Reached!`);
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
