const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');

const ROOM_LIMIT = 3;
const PARENT_CATEGORY_ID = '881071692414345250';
const ROOM_NAME = ['Chane', 'Tane', 'Rain']; // Keep all the names in capitalized case, can also give space
// To Do: Do this so first letter is Capital and if any space exist or not?, just keep them in proper
const DEFAULT_ROOM = 'Tane';
// SOme problem with creating the default room, it should already exist, no?
//   const twelveHoursInMs = 43200; // 12 hours in seconds
// const twelveHoursInMs = 60; // 1 minute in seconds
let Game = {
  currentDay: 1,
  playingId: '1101087801925181485',
  noVoteId: '1101602215212372179',
  deadId: '1101602543454408764',
  twelveHoursInMs: 60,
  townSquareRole: '1100061376694722693',
  categoryId: '1100059641498574949',
  viewChannelPermission: '0x0000000000000400',
  validRooms: [
    'the-blacksmith-shop_',
    'the-infirmary_',
    'the-tavern_',
    'the-main-garden_',
    'the-edge-of-town_',
    'the-train-station_',
    'the-alley_',
    'the-inn_',
    'the-sheriff-station_',
    'the-carpentry-shop_',
  ],
  placeRoles: {
    'The Blacksmith Shop': '1100061352636186675',
    'The Infirmary': '1100061354901123153',
    'The Tavern': '1100061357182812311',
    'The Main Garden': '1100061359988813934',
    'The Edge of Town': '1100061361951752225',
    'The Train Station': '1100061364615135242',
    'The Alley': '1100061366733258824',
    'The Inn': '1100061369170149487',
    'The Sheriff Station': '1100061371598647446',
    'The Carpentry Shop': '1100061374241058870',
    'Town Square': '1100061376694722693',
  },
};
async function define_Variables() {
  const db = await openConnection();
  const variables = await db.get(`SELECT * FROM Game WHERE id = 1`);
  Game.currentDay = variables.day;
  await closeConnection(db);
}
define_Variables();

module.exports = {
  ROOM_LIMIT,
  PARENT_CATEGORY_ID,
  ROOM_NAME,
  DEFAULT_ROOM,
  Game,
};
