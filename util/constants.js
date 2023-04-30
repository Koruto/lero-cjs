const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');

const ROOM_LIMIT = 3;

// SOme problem with creating the default room, it should already exist, no?
//   const twelveHoursInMs = 43200; // 12 hours in seconds
// const twelveHoursInMs = 60; // 1 minute in seconds
let Game = {
  currentDay: 1,
  isNightTime: 0,
  playingId: '1101087801925181485',
  noVoteId: '1101602215212372179',
  aliveId: '1101859415767924930',
  deadId: '1101602543454408764',
  twelveHoursInMs: 120,
  townSquareRole: '1100061376694722693',
  categoryId: '1100059641498574949',
  archivedCategoryId: '1100059677380849774',
  viewChannelPermission: '0x0000000000000400',
  sendMessagePermission: '0x0000000000000800',
  validRooms: [
    'blacksmith-shop_',
    'infirmary_',
    'tavern_',
    'main-garden_',
    'edge-of-town_',
    'train-station_',
    'alley_',
    'inn_',
    'sheriff-station_',
    'carpentry-shop_',
  ],
  placeRoles: {
    'Blacksmith Shop': '1100061352636186675',
    Infirmary: '1100061354901123153',
    Tavern: '1100061357182812311',
    'Main Garden': '1100061359988813934',
    'Edge Of Town': '1100061361951752225',
    'Train Station': '1100061364615135242',
    Alley: '1100061366733258824',
    Inn: '1100061369170149487',
    'Sheriff Station': '1100061371598647446',
    'Carpentry Shop': '1100061374241058870',
    'Town Square': '1100061376694722693',
  },
};
async function define_Variables() {
  const db = await openConnection();
  const variables = await db.get(`SELECT * FROM Game WHERE id = 1`);
  Game.currentDay = variables.day;
  Game.isNightTime = variables.night;
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
