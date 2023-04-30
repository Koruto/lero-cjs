const { Events } = require('discord.js');
const { sleep } = require('system-sleep')
module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client,interaction) {
    sleep(3000);
    console.log(`Running startup script...`);

  },
};
