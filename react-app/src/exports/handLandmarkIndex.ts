export const HAND_INDEX = {
  wrist: 0,
  thumb: {
    cmc: 1,
    mcp: 2,
    ip: 3,
    tip: 4
  },
  index: {
    mcp: 5,
    pip: 6,
    dip: 7,
    tip: 8
  },
  middle: {
    mcp: 9,
    pip: 10,
    dip: 11,
    tip: 12
  },
  ring: {
    mcp: 13,
    pip: 14,
    dip: 15,
    tip: 16
  },
  pinky: {
    mcp: 17,
    pip: 18,
    dip: 19,
    tip: 20
  }
};

export const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20]
];

export const HAND_DIMENSIONS = { x: 1, y: 2 };

export const NUM_ARRAY_HAND_INDEX = {
  timestamp: 0,
  wrist: { x: 1, y: 2 },
  thumb_c: { x: 3, y: 4 },
  thumb_m: { x: 5, y: 6 },
  thumb_d: { x: 7, y: 8 },
  thumb_t: { x: 9, y: 10 },
  index_c: { x: 11, y: 12 },
  index_m: { x: 13, y: 14 },
  index_d: { x: 15, y: 16 },
  index_t: { x: 17, y: 18 },
  middle_c: { x: 19, y: 20 },
  middle_m: { x: 21, y: 22 },
  middle_d: { x: 23, y: 24 },
  middle_t: { x: 25, y: 26 },
  ring_c: { x: 27, y: 28 },
  ring_m: { x: 29, y: 30 },
  ring_d: { x: 31, y: 32 },
  ring_t: { x: 33, y: 34 },
  pinky_c: { x: 35, y: 36 },
  pinky_m: { x: 37, y: 38 },
  pinky_d: { x: 39, y: 40 },
  pinky_t: { x: 41, y: 42 }
};