export const POSE_INDEX = {
  Center: {
    nose: 0,
    mouth: { left: 9, right: 10 }
  },
  Side: {
    eye: {
      inner: { left: 1, right: 4 },
      center: { left: 2, right: 5 },
      outer: { left: 3, right: 6 }
    },
    ear: { left: 7, right: 8 },
    shoulder: { left: 11, right: 12 },
    elbow: { left: 13, right: 14 },
    wrist: { left: 15, right: 16 },
    pinky: { left: 17, right: 18 },
    index: { left: 19, right: 20 },
    thumb: { left: 21, right: 22 },
    hip: { left: 23, right: 24 },
    knee: { left: 25, right: 26 },
    ankle: { left: 27, right: 28 },
    heel: { left: 29, right: 30 },
    footIndex: { left: 31, right: 32 }
  }
}

export const POSE_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5],
  [5, 6], [6, 8], [9, 10], [11, 12], [11, 13],
  [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
  [12, 14], [14, 16], [16, 18], [16, 20], [16, 22],
  [18, 20], [11, 23], [12, 24], [23, 24], [23, 25],
  [24, 26], [25, 27], [26, 28], [27, 29], [28, 30],
  [29, 31], [30, 32], [27, 31], [28, 32]
];

export const POSE_DEMENSIONS = {x: 1, y: 2};

export const NUM_ARRAY_POSE_INDEX = {
  timestamp: 0,
  nose: {x: 1, y: 2},
  inner_eye_left: {x: 3, y: 4},
  center_eye_left: {x: 5, y: 6},
  outer_eye_left: {x: 7, y: 8},
  inner_eye_right: {x: 9, y: 10},
  center_eye_right: {x: 11, y: 12},
  outer_eye_right: {x: 13, y: 14},
  ear_left: {x: 15, y: 16},
  ear_right: {x: 17, y: 18},
  mouth_left: {x: 19, y: 20},
  mouth_right: {x: 21, y: 22},
  shoulder_left: {x: 23, y: 24},
  shoulder_right: {x: 25, y: 26},
  elbow_left: {x: 27, y: 28},
  elbow_right: {x: 29, y: 30},
  wrist_left: {x: 31, y: 32},
  wrist_right: {x: 33, y: 34},
  pinky_left: {x: 35, y: 36},
  pinky_right: {x: 37, y: 38},
  index_left: {x: 39, y: 40},
  index_right: {x: 41, y: 42},
  thumb_left: {x: 43, y: 44},
  thumb_right: {x: 45, y: 46},
  hip_left: {x: 47, y: 48},
  hip_right: {x: 49, y: 50},
  knee_left: {x: 51, y: 52},
  knee_right: {x: 53, y: 54},
  ankle_left: {x: 55, y: 56},
  ankle_right: {x: 57, y: 58},
  heel_left: {x: 59, y: 60},
  heel_right: {x: 61, y: 62},
  foot_index_left: {x: 63, y: 64},
  foot_index_right: {x: 65, y: 66}
};