// Require the necessary discord.js classes
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { REST } from '@discordjs/rest';
import { GuildsAPI } from '@discordjs/core';
import {
  ROOM_LIMIT,
  PARENT_CATEGORY_ID,
  ROOM_NAME,
  DEFAULT_ROOM,
} from './constants.js';
import dotenv from 'dotenv';
dotenv.config();
const token = process.env.DISCORD_TOKEN;

const rest = new REST({ version: '10' }).setToken(token);
const guildsAPI = new GuildsAPI(rest);

//Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

async function createRoles(missingRoles, GUILD_ID) {
  const promises = missingRoles.map((role) =>
    guildsAPI.createRole(GUILD_ID, { name: role })
  );
  await Promise.all(promises);
}

client.on(Events.MessageCreate, async (message) => {
  if (message.content.startsWith('&create room')) {
    const viewChannelPermission = 0x0000000000000400;

    // console.log(userIds, userMentionLength);
    // Get the guild/server where the command was sent, an Object
    const guild = message.guild;
    const GUILD_ID = guild.id;
    // console.log(message);
    // console.log(userId, '\n\n', guild, '\n\n', guild.id);

    // Getting all roles from the guild
    const allRoles = await guildsAPI.getRoles(GUILD_ID);
    const missingRoles = [];
    // console.log('\n\n ALL ROLES \n\n');
    // console.log(allRoles);
    ROOM_NAME.forEach((name) => {
      if (!allRoles.find((role) => role.name === name)) {
        missingRoles.push(name);
      }
    });
    // Creating roles for the ones missing roles, or some new addition
    createRoles(missingRoles, GUILD_ID); // To resolve promise and not move forward unless things completed

    const allRolesAgain = await guildsAPI.getRoles(GUILD_ID);
    // !! Problem Here, Returns an error if role creation is not finished, something undefined, if all roles does not exist
    const DEFAULT_ROLE_ID = allRolesAgain.find(
      (role) => role.name === DEFAULT_ROOM
    ).id;
    // console.log(message);
    // prints ['936929561302675456', '204255221017214977', '881076128176013312']
    let userIds = Array.from(message.mentions.users.keys());
    // Checking if the user is in default room, If not they cannot be added to the initial Room
    // console.log('\n\n USER ROLES \n\n');
    for (const user of userIds) {
      const userRoles = (await guildsAPI.getMember(GUILD_ID, user)).roles;
      if (!userRoles.includes(DEFAULT_ROLE_ID)) {
        await message.channel.send(`<@!${user}> already is in existing room!`);
        return;
      }
    }
    userIds.push(message.author.id);
    const userMentionLength = userIds.length;

    try {
      // Create a new channel in the guild/server
      if (userMentionLength > ROOM_LIMIT) {
        await message.channel.send(
          `You can only mention up to ${ROOM_LIMIT} users.`
        );
        throw new Error(`You can only mention up to ${ROOM_LIMIT} users`);
      }

      const validChannelNames = ROOM_NAME.map((value) =>
        value.toLowerCase().replace(/\s+/g, '-')
      );
      const allChannels = await guildsAPI.getChannels(GUILD_ID);

      const filteredChannels = allChannels
        .filter((channel) => channel.parent_id === PARENT_CATEGORY_ID)
        .map((channel) => channel.name);

      const channelList = validChannelNames.filter(
        (channel) => !filteredChannels.includes(channel)
      );
      if (channelList.length === 0) {
        await message.channel.send(`No Room Available Currently`);
        throw new Error(`No Room Available Currently`);
      }

      const randomIndex = Math.floor(Math.random() * channelList.length);
      const channelName = channelList[randomIndex];

      // Removing of role
      for (const user of userIds) {
        const result = await guildsAPI.removeRoleFromMember(
          GUILD_ID,
          user,
          DEFAULT_ROLE_ID,
          {}
        );
      }

      // Adding of Role
      const channelNameAsRoleName = channelName
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      const newChannelID = allRolesAgain.find(
        (role) => role.name === channelNameAsRoleName
      ).id;

      for (const user of userIds) {
        const result = await guildsAPI.addRoleToMember(
          GUILD_ID,
          user,
          newChannelID
        );
      }

      // console.log(allChannels);
      let permissionOverwrites = [
        {
          id: GUILD_ID,
          type: 0,
          deny: viewChannelPermission,
        },
      ];

      for (const userId of userIds) {
        permissionOverwrites.push({
          id: userId,
          type: 1,
          allow: viewChannelPermission,
        });
      }

      const channel = await guildsAPI.createChannel(GUILD_ID, {
        name: channelName,
        parent_id: PARENT_CATEGORY_ID, // Check the message object, for the category of private
        permission_overwrites: permissionOverwrites,
      });

      // Send a confirmation message to the channel where the command was sent
      await message.channel.send(`Created new channel: ${channelName}`);
    } catch (error) {
      console.error(error);
      await message.channel.send('Error creating channel.');
    }
  }
});

// Log in to Discord with your client's token
client.login(token);

// Tasks to do
/* 


4. Channel deleting, and saving messages before
5. Cut it into many piecees, code's getting too big now

Done
2. Check if the player is avaiblable or not for getting called 
3. Give the corresponding role of the channel when adding, and first also check if the user is 
   available to be added from the roles.


To Check


*/
