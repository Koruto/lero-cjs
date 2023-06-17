const { Events } = require('discord.js');
const { Game, define_Variables, ListOfCommands } = require('../util/constants');

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
      // Conditions to check validity

      const notAllowedCommands = ListOfCommands['notAllowed'];
      const onlyFromTownSquareCommands = ListOfCommands['onlyFromTownSquare'];

      if (notAllowedCommands.includes(interaction.commandName)) {
        if (!interaction.member.roles.cache.has(Game.playingId)) {
          await interaction.reply('Join the game to use its feature :)');
          return;
        }

        const timeOfDay = await define_Variables();
        if (timeOfDay.isNightTime) {
          await interaction.reply({
            content: 'Cannot use this command at night',
            ephemeral: true,
          });
          return;
        }
      }

      if (onlyFromTownSquareCommands.includes(interaction.commandName)) {
        if (interaction.channel.name !== 'town-square') {
          await interaction.reply({
            content: `Use command only from Town Square`,
            ephemeral: true,
          });
          return;
        }
      }

      // Cooldown Timer for Commands

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
      console.log('Cry Cri, I cry a River of water, it floods the dam');
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(error);
    }
  },
};
