import { HandLandmarker, PoseLandmarker } from "@mediapipe/tasks-vision";
import { ClipRegion } from "./types";

export const NAVBAR_WIDTH = 300
export const APPSHELL_GAP = 20

export const FRAMESIZE = {
  VIDEO: {'WIDTH': 1920, 'HEIGHT': 1080},
  CANVAS: {'WIDTH': 640, 'HEIGHT': 360},
}

export const FRAMERATE = 30

export const NUM_POSES: number = 2;

export const FEATURE_TIMES = 20;

export interface SelectBoxOption {
  value: string;
  label: string;
}

export const userOptions: SelectBoxOption[] = [
  { value: '0', label: 'ユーザー0' },
  { value: '1', label: 'ユーザー1' },
  { value: '2', label: 'ユーザー2' },
  { value: '3', label: 'ユーザー3' },
  { value: '4', label: 'ユーザー4' },
  { value: '5', label: 'ユーザー5' },
  { value: '6', label: 'ユーザー6' },
];

export const techniqueOptions: SelectBoxOption[] = [
  // { value: '0', label: 'テスト用' },
  // { value: '1', label: '手技1' },
  // { value: '2', label: '手技2' },
  // { value: '3', label: '手技3' },
  // { value: '4', label: '手技4' },
  // { value: '5', label: '手技5' },
  // { value: '6', label: '手技6' },
  // ↓↓ 11/7のケース用
  { value: '0', label: 'テスト用' },
  { value: '10', label: '手技1' },
  { value: '11', label: '手技2' },
  { value: '12', label: '手技3' },
  { value: '13', label: '手技4' },
  { value: '14', label: '手技5' },
  { value: '15', label: '手技6' },
];

type PassList = {
  [key: string]: string;
}
export const PASS_List: PassList = {
  0: "000",
  1: "aaa",
  2: "bbb",
  3: "ccc",
  4: "ddd",
  5: "eee",
  6: "fff",
}

export const dateOptions: SelectBoxOption[] = [
  { value: '20240910', label: '20240910' },
  { value: '20241010', label: '20241010' },
  { value: '20241107', label: '20241107' },
]

export const POSE_CONNECTIONS = PoseLandmarker.POSE_CONNECTIONS;
export const HAND_CONNECTIONS = HandLandmarker.HAND_CONNECTIONS;

export const CamWidth = FRAMESIZE.VIDEO.WIDTH / 2; // 960
export const CamHeight = FRAMESIZE.VIDEO.HEIGHT / 2; // 540

export interface CamRegion {
  "Side": ClipRegion;
  "Front": ClipRegion;
  "Top": ClipRegion;
}

export const CameraRegions: CamRegion = {
  "Side": { x: 0, y: 0, width: CamWidth, height: CamHeight},
  "Front": { x: CamWidth, y: 0, width: CamWidth, height: CamHeight},
  "Top": { x: 0, y: CamHeight, width: CamWidth, height: CamHeight},
}

const LANDMARKS_PER_RESULT = 33; // 33 landmarks per pose
export const NAN_ARRAY = Array(LANDMARKS_PER_RESULT * 2).fill('nan');

export const FIRST_FIND_INDEX = 0;