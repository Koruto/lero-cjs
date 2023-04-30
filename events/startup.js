const { Events } = require('discord.js');
const  sleep = require('system-sleep');
const execSync = require('child_process').execSync;

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client,interaction) {
    sleep(3000);    // adds 3 second delay to run 

    const output = execSync('echo Hello World', { encoding: 'utf-8' }); // the command to run, stores command output in "output"
		console.log('Running Startup script...\n', output);     // logs the output to console
  },
};
