const { Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      if (command?.cooldown) {
        const { cooldowns } = interaction.client;

        if (!cooldowns.has(command.data.name)) {
          cooldowns.set(command.data.name, 0);
        }

        const now = Date.now();
        const timestamp = cooldowns.get(command.data.name);
        const cooldownAmount = command.cooldown * 1000;
        const expirationTime = timestamp + cooldownAmount;

        if (now < expirationTime) {
          const expiredTimestamp = Math.round(expirationTime / 1000);

          return interaction.reply({
            content: `No no no, not so fast. Try \`${command.data.name}\` again <t:${expiredTimestamp}:R>.`,
            ephemeral: true,
          });
        }

        cooldowns.set(command.data.name, now);
      }
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(error);
    }
  },
};
