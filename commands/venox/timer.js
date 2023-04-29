const { SlashCommandBuilder, WebhookClient } = require('discord.js');
const townhook = new WebhookClient({ id: '1101903776744484994', token: 'R9Sujh4KS8b1zxAq6yW10B0BFd4HuNdZhYbq24QU-uLGs-k_wQk0JBv7KMKxxoy1STEU' });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timer')
    .setDescription('Test command to set required time'),
  async execute(interaction, message) {
    await interaction.reply("Started interval: 5s");

    const start = Date.now()

     setTimeout(function()
        {
        const end = Date.now();


        townhook.send({
            content: `Total time passed:${(end - start)/1000}s`,
            username: 'Lero AI',
            avatarURL: 'https://cdn.discordapp.com/avatars/1095648453721333790/70e5059d02f5c7a10733a9d4bc69e0ae.webp',
        });
        }, 5000);

  },

}