import { ROOM_LIMIT } from './constants';

export function handleMessage(message) {
  if (message.content.startsWith('&create room')) {
    const userIds = message.mentions.users.keyArray();
    userIds.push(message.author.id);
    const userMentionLength = userIds.length;

    if (userMentionLength > ROOM_LIMIT) {
      message.channel.send(`You can only mention up to ${ROOM_LIMIT} users.`);
      throw new Error(`You can only mention up to ${ROOM_LIMIT} users`);
    }
  }
}
