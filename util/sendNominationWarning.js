const { Game } = require('./constants');

async function sendNominationWarning(interaction, nominated, nominee) {
  const channels = interaction.guild.channels.cache.filter(
    (channel) =>
      channel.parentId === Game.categoryId &&
      channel.name.endsWith('_') &&
      channel.name !== 'town-square'
  );

  channels.forEach((channel) => {
    channel.send(`**Warning:** ${nominated} has been nominated by ${nominee}.`);
  });
}

module.exports = { sendNominationWarning };
