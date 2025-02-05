
import { LandmarkChunk, MyLandmarkType } from "../../exports/types";
import { FIRST_FIND_INDEX } from "../../exports/consts";
import { useEffect, useState } from "react";
import { HAND_INDEX } from "../../exports/handLandmarkIndex";
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

    try {
      if (isNormalizedLandmarkArray(landmarks)) {
        // Normalizedlandmark の場合の座標取得
        let humanIndex = 0
        if (landmarks.length > 1 && landmarks[0][HAND_INDEX.pinky.tip].y > landmarks[1][HAND_INDEX.pinky.tip].y) {
          humanIndex = 1;
        }
        const landmark = landmarks[humanIndex][targetIndex];
        const arrIndex = {x: Math.floor(landmark.x * arrayWidth), y: Math.floor(landmark.y * arrayHeight)}
        
        if (0 <= arrIndex.x && arrIndex.x < arrayWidth && 0 <= arrIndex.y && arrIndex.y < arrayHeight) {
          heatmapArray[arrIndex.y][arrIndex.x]++; // 行・列で指定するためY, Xの順
        }
      } else if (isNumberArray(landmarks)) {
        // csvの場合の座標取得
        let humanIndex = 0;
        if (landmarks[1][HAND_INDEX.pinky.tip * 2 + 1] !== 0 &&
          landmarks[FIRST_FIND_INDEX][HAND_INDEX.pinky.tip * 2 + 1] > landmarks[1][HAND_INDEX.pinky.tip * 2 + 1]) {
          humanIndex = 1;
        }
        const landmarkX = landmarks[humanIndex][targetIndex * 2];
        const landmarkY = landmarks[humanIndex][targetIndex * 2 + 1];
        const arrIndex = {x: Math.floor(landmarkX * arrayWidth), y: Math.floor(landmarkY * arrayHeight)}
        if (0 <= arrIndex.x && arrIndex.x < arrayWidth && 0 <= arrIndex.y && arrIndex.y < arrayHeight) {
          heatmapArray[arrIndex.y][arrIndex.x]++; // 行・列で指定するためY, Xの順
        }
      }
    } catch(e) {
      console.error("calc heatmap error: " + e);
    }
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
  }, [arrayHeight, arrayWidth, landmarkChunk, targetIndex]);
  return heatmapArray;
}