import { HandLandmarker, PoseLandmarker } from "@mediapipe/tasks-vision";
import { ClipRegion } from "./types";
import { ComboboxData } from "@mantine/core";

export const APPSHELL_CONFIG = {
  HEADER_HEIGHT: 60,
  NAVBAR_WIDTH: 300,
  GAP: 20,
}

export const FRAMESIZE = {
  VIDEO: {'WIDTH': 1920, 'HEIGHT': 1080},
  CANVAS: {'WIDTH': 640, 'HEIGHT': 360},
}

export const FRAMERATE = 30
export const NUM_POSES: number = 2;
export const FEATURE_TIMES = 20;

export const techniqueOptions: {value: string, label: string}[] = [
  { value: '00', label: 'テスト用' },
  { value: '01', label: '01-脈拍測定' }, // 手技1
  { value: '02', label: '02-聴診・心臓？・対人' }, // 手技2
  { value: '03', label: '03-ベッド・脚部・触診' }, // 手技3
  // ↓↓ 10/10のケース用
  { value: '04', label: '04-眼瞼結膜' },
  { value: '05', label: '05-甲状腺' },
  { value: '06', label: '06-頭頸部・リンパ節確認・触診' },
  { value: '07', label: '07-肺正面・聴診・対ラング' }, // 0で記録
  { value: '08', label: '08-聴診・背面・対ラング' }, // 0で記録
  { value: '09', label: '09-静音浸透' }, // 0で記録
  // ↓↓ 11/7のケース用
  { value: '10', label: '手技1：テスト用' }, // 何個かの手技をまとめて一つの動画 (テスト用)
  { value: '11', label: '11-肺・正面・聴診・対ラング（07と同じ？）' }, // 手技2
  { value: '12', label: '12-背中・静音浸透（09と同じ？）' }, //手技3 静音浸透が混ざった。打診と。
  { value: '13', label: '13-背中・打診' }, // 手技4
  { value: '14', label: '14-背中・聴診（08と同じ？）' }, // 手技5
  { value: '15', label: '15-背中・打診→聴診' }, // 手技6

  { value: '16', label: '16-脇・腕リンパ節' },
  { value: '17', label: '17-目・対光反射' },
  { value: '18', label: '18-目・服装反射' },
  { value: '19', label: '19-ベッド・腹部・聴診' },
  { value: '20', label: '20-ベッド・腹部・打診' },
  { value: '21', label: '21-ベッド・腹部・触診' },
];

export const dateOptions: ComboboxData = [
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