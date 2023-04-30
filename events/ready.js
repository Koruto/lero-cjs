const { Events } = require('discord.js');
const { nominationTimeTimer } = require('../util/timeOverNomination');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client, interaction) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    await nominationTimeTimer(interaction);
  },
};
