import { FilesetResolver, HandLandmarker, PoseLandmarker } from "@mediapipe/tasks-vision";
import { NUM_POSES } from "../../exports/consts";

const createVision = async () => {
  return await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
};

export const setupPoseLandmarker = async () => {
  const vision = await createVision();

  const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`, // モデルは一番軽量のものを選択
      delegate: "GPU", // GPUにすると滑らかに動作する
    },
    runningMode: "VIDEO",
    numPoses: NUM_POSES,
  });

  return poseLandmarker;
};

export const setupHandLandmarker = async () => {
  const vision = await createVision();

  const handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`, // 手認識モデルのパス
      delegate: "GPU", // GPUを使用して滑らかな動作を実現
    },
    runningMode: "VIDEO",
    numHands: 2, // NUM_HANDSの代わりに固定値2を使用
  });

  return handLandmarker;
};
