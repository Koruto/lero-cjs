const ROOM_LIMIT = 3;
const PARENT_CATEGORY_ID = '881071692414345250';
const ROOM_NAME = ['Chane', 'Tane', 'Rain']; // Keep all the names in capitalized case, can also give space
// To Do: Do this so first letter is Capital and if any space exist or not?, just keep them in proper
const DEFAULT_ROOM = 'Tane';
// SOme problem with creating the default room, it should already exist, no?
const Game = { currentDay: 1 };

module.exports = {
  ROOM_LIMIT,
  PARENT_CATEGORY_ID,
  ROOM_NAME,
  DEFAULT_ROOM,
  Game,
};
