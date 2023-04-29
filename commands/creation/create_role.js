const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('create-role')
  .setDescription('Creates the required roles, Don"t use');

async function execute(interaction) {
  if (interaction.user.id != '404966968005754882') {
    await interaction.reply(`Imposter Detected, SMH Shame on YOU !!`);
    return;
  }
  await interaction.reply(`Command Reached! Creating Roles`);
  const rolesArray = [
    'The Blacksmith Shop',
    'The Infirmary',
    'The Tavern',
    'The Main Garden',
    'The Edge of Town',
    'The Train Station',
    'The Alley',
    'The Inn',
    'The Sheriff Station',
    'The Carpentry Shop',
    'Town Square',
  ];

  rolesArray.forEach((roleName) => {
    // create a role for each element in the array
    interaction.guild.roles
      .create({
        name: roleName,
      })
      .then((role) =>
        console.log(`Created role ${role.name} with ID ${role.id}`)
      )
      .catch(console.error);
  });

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
