
import { LandmarkChunk, MyLandmarkType } from "../../consts/types";
import { FIRST_FIND_INDEX } from "../../consts/consts";
import { useEffect, useState } from "react";
import { HAND_INDEX } from "../../consts/handLandmarkIndex";
import { NormalizedLandmark } from "@mediapipe/tasks-vision";

const isNormalizedLandmarkArray = (landmarks: MyLandmarkType): landmarks is NormalizedLandmark[][] => {
  return landmarks.length > 0 && typeof landmarks[0][0] === 'object' && 'x' in landmarks[0][0];
};

const isNumberArray = (landmarks: MyLandmarkType): landmarks is number[][] => {
  return landmarks.length > 0 && typeof landmarks[0][0] === 'number';
};

const TRACKING_POINT = HAND_INDEX.thumb.tip;
export const calcHeatmap = (
  landmarkChunk: LandmarkChunk | [[number, number[][]]],
  arrayWidth:number, arrayHeight:number,
  targetIndex:number = TRACKING_POINT
) => {
  if (!landmarkChunk) return;
  const heatmapArray = new Array(arrayHeight)
  for (let i = 0; i < arrayHeight; i++) {
    heatmapArray[i] = new Array(arrayWidth).fill(0);
  }

  for (let i = 0; i < landmarkChunk.length; i++) {
    const landmarks = landmarkChunk[i][1];
    if (landmarks.length === 0) continue;

    let indexX = 0; let indexY = 0;

    if (isNormalizedLandmarkArray(landmarks)) {
      // Normalizedlandmark の場合の座標取得
      let index = 0
      if (landmarks.length > 1 &&
        landmarks[0][HAND_INDEX.pinky.tip].y > landmarks[1][HAND_INDEX.pinky.tip].y) {
        index = 1;
      }
      const landmark = landmarks[index][targetIndex];
      console.log(landmark)
      indexX = Math.floor(landmark.x * arrayWidth);
      indexY = Math.floor(landmark.y * arrayHeight);
    } else if (isNumberArray(landmarks)) {
      // csvの場合の座標取得
      let index = 0;
      if (landmarks[1][HAND_INDEX.pinky.tip * 2 + 1] !== 0 &&
        landmarks[FIRST_FIND_INDEX][HAND_INDEX.pinky.tip * 2 + 1] > landmarks[1][HAND_INDEX.pinky.tip * 2 + 1]) {
        index = 1;
      }
      const landmarkX = landmarks[index][targetIndex * 2];
      const landmarkY = landmarks[index][targetIndex * 2 + 1];
      indexX = Math.floor(landmarkX * arrayWidth);
      indexY = Math.floor(landmarkY * arrayHeight);
    }
    heatmapArray[indexY][indexX] += 1; // 行・列で指定するためY, Xの順
  }
  return heatmapArray;
}

// このタイミングでカスタムフックとして呼び出さなくても、heatmapを描画するタイミングで呼び出しも良いのか。
export const useHeatmap = (
  landmarkChunk: LandmarkChunk | null,
  arrayWidth: number, arrayHeight: number,
  targetIndex: number = TRACKING_POINT
) => {
  const [heatmapArray, setHeatmapArray] = useState<number[][]>([]);
  useEffect(() => {
    if (!landmarkChunk || landmarkChunk.length < 2) return;
    const heatmapArray = calcHeatmap(landmarkChunk, arrayWidth, arrayHeight, targetIndex);
    if (!heatmapArray) return;
    setHeatmapArray(heatmapArray);
  }, [landmarkChunk]);
  return heatmapArray;
}