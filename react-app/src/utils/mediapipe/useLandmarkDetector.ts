// ビデオからリアルタイムにMediapipeによる姿勢推定を行う。

import { useEffect, useState, RefObject, useRef, useCallback } from "react";
import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { ClipRegion, Landmarker, LandmarkType } from "../../exports/types";
import { setupHandLandmarker, setupPoseLandmarker } from "./modelSettings";
// import { CameraRegions } from "../../exports/consts";

const ONE_SECOND_MS: number = 1000;
const UPDATE_INTERVAL: number = 100; // ms

// const getKeyByValue = (object: any, value: any) => {
//   return Object.keys(object).find(key => object[key] === value);
// }

const initializeLandmarker = async (landmarkerType: LandmarkType): Promise<Landmarker> => {
  return landmarkerType === 'pose' ? await setupPoseLandmarker() : await setupHandLandmarker();
};

export const useLandmarkDetector = (
  landmarkType: LandmarkType | null,
  videoEle: HTMLVideoElement,
  canvasRef: RefObject<HTMLCanvasElement>,
  clipRegion: ClipRegion
) => {
  const [landmarker, setLandmarker] = useState<Landmarker | null>(null);
  const [landmarks, setLandmarks] = useState<[number, NormalizedLandmark[][]] | undefined>();
  const landmarksRef = useRef<[number, NormalizedLandmark[][]] | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);
  const renderLoopIdRef = useRef<number | null>(null);
  // const regionKey = getKeyByValue(CameraRegions, clipRegion);


  const detectLandmarks = useCallback((video: HTMLVideoElement, canvas: HTMLCanvasElement): [number, NormalizedLandmark[][]] | null => {
    if (!landmarker || video.currentTime === lastVideoTimeRef.current) return null;
    try {
      const timestampMs = video.currentTime * ONE_SECOND_MS;
      const detectionResults = landmarker.detectForVideo(canvas, timestampMs).landmarks;
      
      if (detectionResults) {
        // const fixedLandmarks = fixLandmarkData(detectionResults, regionKey!);
        lastVideoTimeRef.current = video.currentTime;
        return [timestampMs, detectionResults];
      }
    } catch(error) {
      console.error("ランドマーク検出エラー:", error);
    }
    return null;
  }, [landmarker]);
  
  
  const detectionLoop = useCallback(() => {
    if (!videoEle || !canvasRef.current) return;
    try {
      landmarksRef.current = detectLandmarks(videoEle, canvasRef.current);
    } catch (error) {
      console.error("ランドマーク検出ループでエラーが発生しました:", error);
    }
    renderLoopIdRef.current = requestAnimationFrame(detectionLoop);
  }, [videoEle, canvasRef, detectLandmarks]);

  useEffect(() => {
    if (landmarkType) {
      initializeLandmarker(landmarkType!).then(initializedLandmarker => {
        setLandmarker(initializedLandmarker);
        console.log("landmarker initialized: " + landmarkType);
      }).catch(err => {
        console.error("ランドマーカーの初期化に失敗しました: ", err);
      });
    }
  }, [landmarkType]);
  
  useEffect(() => {

    // 動画が読み込まれたらdetectionLoopを呼び出す readyState 4は動画が読み込まれたことを意味する
    if (landmarker && videoEle && videoEle.readyState === 4 && !renderLoopIdRef.current) {
      renderLoopIdRef.current = requestAnimationFrame(detectionLoop);
    }

    // stateの更新はUPDATE_INTERVALごとに行う。処理負荷を減らすため。
    const intervalId = setInterval(() => {
      if (landmarksRef.current) {
        setLandmarks(landmarksRef.current);
      }
    }, UPDATE_INTERVAL);

    return () => {
      if (renderLoopIdRef.current) cancelAnimationFrame(renderLoopIdRef.current);
      if (intervalId) clearInterval(intervalId);
      if (landmarker) landmarker?.close();
    };
  }, [videoEle, detectionLoop, landmarker]);

  return { landmarks };
};


// const fixLandmarkData = useCallback((
  //   landmarks: NormalizedLandmark[][], regionKey: string
  // ) => {
  //   if (!landmarks || landmarks.length < 0) return;
  //   const firstLandmark = landmarks[0];
  //   const lastLandmark = landmarks[1];
  //   if (regionKey === "Side") {
  //     // 腰のx座標が大きい方を一人目（医者）とする
  //     if (firstLandmark[POSE_INDEX.Side.hip.left].x < lastLandmark[POSE_INDEX.Side.hip.left].x) {
  //       return [lastLandmark, firstLandmark];
  //     }
  //   } else if (regionKey === "Top") {
  //     // 手の小指のy座標が小さい方を一つ目の手（右手）とする
  //     if (firstLandmark[HAND_INDEX.pinky.tip].y > lastLandmark[HAND_INDEX.pinky.tip].y) {
  //       return [lastLandmark, firstLandmark];
  //     }
  //   } else if (regionKey === "Front") {
  //     // 手の小指のx座標が大きい方を一つ目の手（右手）とする
  //     if (firstLandmark[HAND_INDEX.pinky.tip].x < lastLandmark[HAND_INDEX.pinky.tip].x) {
  //       return [lastLandmark, firstLandmark];
  //     }
  //   }
  //   return landmarks;
  // }, []);
