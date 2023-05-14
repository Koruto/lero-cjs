// const {
//   openConnection,
//   closeConnection,
// } = require('../database/interactWithDB');

// const ROOM_LIMIT = 3;

// // Some problem with creating the default room, it should already exist, no?
// //   const twelveHoursInSeconds = 43200; // 12 hours in seconds
// // const twelveHoursInSeconds = 60; // 1 minute in seconds
// const Game = {
//   playingId: '1082346141003296871',
//   noVoteId: '1078003254807506954',
//   aliveId: '1074139812078026822',
//   deadId: '1074139806839349368',
//   twelveHoursInSeconds: 43200,
//   townSquareRole: '1075403559006388334',
//   categoryId: '1074082117589401730',
//   archivedCategoryId: '1101894036824006759',
//   guildId: '1074042138939113562',
//   viewChannelPermission: '0x0000000000000400',
//   sendMessagePermission: '0x0000000000000800',
//   validRooms: [
//     'blacksmith-shop_',
//     'infirmary_',
//     'tavern_',
//     'main-garden_',
//     'edge-of-town_',
//     'train-station_',
//     'alley_',
//     'inn_',
//     'sheriff-station_',
//     'carpentry-shop_',
//   ],
//   placeRoles: {
//     'Blacksmith Shop': '1075404429454491699',
//     Infirmary: '1075404279008989294',
//     Tavern: '1075404253268557885',
//     'Main Garden': '1075404362312065044',
//     'Edge Of Town': '1084233672661663774',
//     'Train Station': '1093832536364437625',
//     Alley: '1075403664245669969',
//     Inn: '1075404309824548884',
//     'Sheriff Station': '1075404331425218591',
//     'Carpentry Shop': '1075404399662350336',
//     'Town Square': '1075403559006388334',
//   },
// };

// async function define_Variables() {
//   let timeOfDay = {
//     currentDay: 1,
//     isNightTime: 0,
//   };

//   const db = await openConnection();
//   const variables = await db.get(`SELECT * FROM Game WHERE id = 1`);
//   timeOfDay.currentDay = variables.day;
//   timeOfDay.isNightTime = variables.night;
//   await closeConnection(db);
//   return timeOfDay;
// }

// module.exports = {
//   Game,
//   ROOM_LIMIT,
//   define_Variables,
// };

const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');

const ROOM_LIMIT = 3; // 1 is Default, so in 3 it will be 4 people in room

// SOme problem with creating the default room, it should already exist, no?
//   const twelveHoursInSeconds = 43200; // 12 hours in seconds
// const twelveHoursInSeconds = 60; // 1 minute in seconds
const Game = {
  playingId: '1101087801925181485',
  noVoteId: '1101602215212372179',
  pendingId: '1107011779776761999', // ! Add this for Ele Game Constants
  aliveId: '1101859415767924930',
  deadId: '1101602543454408764',
  twelveHoursInSeconds: 43200,
  townSquareRole: '1100061376694722693',
  categoryId: '1100059641498574949',
  archivedCategoryId: '1100059677380849774',
  guildId: '1100058607099318354',
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
  let timeOfDay = {
    currentDay: 1,
    isNightTime: 0,
  };

  const db = await openConnection();
  const variables = await db.get(`SELECT * FROM Game WHERE id = 1`);
  timeOfDay.currentDay = variables.day;
  timeOfDay.isNightTime = variables.night;
  await closeConnection(db);
  return timeOfDay;
}

module.exports = {
  Game,
  ROOM_LIMIT,
  define_Variables,
};
