const {
  openConnection,
  closeConnection,
} = require('../database/interactWithDB');

const { codeBlock } = require('discord.js');

const ROOM_LIMIT = 3; // 1 is Default, so in 3 it will be 4 people in room

const messageConstants = {
  privateRoomStartingMessage: codeBlock(
    `Welcome to your own private room!\n\nPlease feel free to use this room to discuss whatever you may need. This is completely private, no other player will be able to see this conversation (All conversations will be saved and shared in the end).\n\nTo leave, use the command: /leave-room\n\nP.S.: Do not forget, if the number of players are less than 2, Chat will be deleted immediately, so make sure they see the messages before leaving the room.`
  ),
};

const ListOfCommands = {
  onlyFromTownSquare: ['join-room', 'nominate', 'unvote', 'vote'],
  notAllowed: [
    'join-room',
    'leave-room',
    'history',
    'nominate',
    'status',
    'unvote',
    'vote',
  ],
};

// For Koruto Server

// const Game = {
//   playingId: '1101087801925181485',
//   noVoteId: '1101602215212372179',
//   pendingId: '1107011779776761999',
//   aliveId: '1101859415767924930',
//   deadId: '1101602543454408764',
//   spectatorId: '1109510808397951016',
//   twelveHoursInSeconds: 43200,
//   townSquareRole: '1100061376694722693',
//   categoryId: '1100059641498574949',
//   archivedCategoryId: '1100059677380849774',
//   guildId: '1100058607099318354',
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
//     'Blacksmith Shop': '1100061352636186675',
//     Infirmary: '1100061354901123153',
//     Tavern: '1100061357182812311',
//     'Main Garden': '1100061359988813934',
//     'Edge Of Town': '1100061361951752225',
//     'Train Station': '1100061364615135242',
//     Alley: '1100061366733258824',
//     Inn: '1100061369170149487',
//     'Sheriff Station': '1100061371598647446',
//     'Carpentry Shop': '1100061374241058870',
//     'Town Square': '1100061376694722693',
//   },
// };

// For Ele's Server

// const Game = {
//   playingId: '1108450948306698240',
//   noVoteId: '1078003254807506954',
//   pendingId: '1082346141003296871',
//   aliveId: '1074139812078026822',
//   deadId: '1074139806839349368',
//   spectatorId: '1083868720063074344',
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

// For SilentSand Server

const Game = {
  playerId: '1186459215418626130',
  noVoteId: '1187740478637101106',
  pendingId: '1187740594945138768',
  aliveId: '1187733992041103441',
  deadId: '1186459429344907305',
  spectatorId: '1187732853312729119',
  twelveHoursInSeconds: 43200,
  townSquareRole: '1187733761748643891',
  categoryId: '1187770983298371705',
  archivedCategoryId: '1187740296214220810',
  guildId: '1100058607099318354',
  viewChannelPermission: '0x0000000000000400',
  sendMessagePermission: '0x0000000000000800',
  validRooms: [
    'starbaker-show_',
    'radiance_',
    'planetside_',
    'the-crystal-ball_',
    'akatsuki-headquarters_',
    'ring-of-spears_',
    'secret-council_',
    'underground_',
    'forum-posts_',
    'terms-of-services_',
    'train-station_',
  ],
  placeRoles: {
    'Starbaker Show': '1187733144586166282',
    Radiance: '1187733286118764595',
    Planetside: '1187733319434117191',
    'The Crystal Ball': '1187733382877159454',
    'Akatsuki Headquarters': '1187733417371115550',
    'Ring of Spears': '1187733489387307109',
    'Secret Council': '1187733528360779866',
    Underground: '1187733608404881471',
    'Forum Posts': '1187733656349974559',
    'Terms of Services': '1187733696363634708',
    'Train Station': '1187733761748643891',
    'Town Squage': '1187733761748643891',
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
  messageConstants,
  ListOfCommands,
};
