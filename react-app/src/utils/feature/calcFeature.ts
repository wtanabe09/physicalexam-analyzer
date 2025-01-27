import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { POSE_INDEX } from "../../exports/poseLandmarkIndex";
import { Point2D } from "../../exports/types";

function isNormalizedLandmarkArray(arr: any[]): arr is NormalizedLandmark[] {
  return arr.length > 0 && typeof arr[0] === 'object' && 'x' in arr[0] && 'y' in arr[0];
}

function isNumberArray(arr: any[]): arr is number[] {
  return arr.length > 0 && typeof arr[0] === 'number';
}

export const getPoint = (landmark: NormalizedLandmark[] | number[], index: number): Point2D => {
  if (isNormalizedLandmarkArray(landmark)) {
    if (index >= landmark.length) {
      throw new Error(`Index ${index} is out of bounds for landmark array of length ${landmark.length}`);
    }
    return {
      x: landmark[index].x,
      y: landmark[index].y
    };
  } else if (isNumberArray(landmark)) {
    if (index * 2 + 1 >= landmark.length) {
      throw new Error(`Index ${index} is out of bounds for landmark array of length ${landmark.length}`);
    }
    return {
      x: landmark[index * 2],
      y: landmark[index * 2 + 1]
    };
  }
  throw new Error('Invalid landmark format');
};

const calcVerticalDistance = (point1: Point2D, point2: Point2D): number => {
  return point2.y - point1.y;
};
const calcHorizontalDistance = (point1: Point2D, point2: Point2D): number => {
  return point2.x - point1.x;
};

export const calcFeatureIndividual = (poseLandmark: NormalizedLandmark[] | number[]): number[] => {
  try {
    const rightWrist = getPoint(poseLandmark, POSE_INDEX.Side.wrist.right);
    const rightKnee = getPoint(poseLandmark, POSE_INDEX.Side.knee.right);
    const rightShoulder = getPoint(poseLandmark, POSE_INDEX.Side.shoulder.right);
    const rightHip = getPoint(poseLandmark, POSE_INDEX.Side.hip.right);

    const handToKneeY = calcVerticalDistance(rightWrist, rightKnee);
    const shoulderToHipY = calcVerticalDistance(rightShoulder, rightHip);

    return [handToKneeY, shoulderToHipY];
  } catch (e) {
    console.error("Error in calcFeatureIndividual:", e);
    return [];
  }
};


const calcFeaturePair = (doctorLandmark: NormalizedLandmark[], patientLandmark: NormalizedLandmark[]): number[] => {
  try{
    const dRightShoulder = doctorLandmark[POSE_INDEX.Side.wrist.right];
    const dRightHip = doctorLandmark[POSE_INDEX.Side.hip.right];
    const pRightShoulder = patientLandmark[POSE_INDEX.Side.wrist.right];
    const pRightHip = patientLandmark[POSE_INDEX.Side.hip.right];

    const dpDistShoulderX = calcHorizontalDistance(pRightShoulder,dRightShoulder);
    const dpDistHipX = calcHorizontalDistance(pRightHip, dRightHip);

    return [dpDistShoulderX, dpDistHipX];
  } catch(e) {
    console.log(e);
    return [];
  }
}

// 特徴量の計算を行う関数
export const calcFeature = (poseLandmarks: NormalizedLandmark[][], prevFeature: number[]): number[] => {
  // poseLandmarksがnullの場合はエラー処理が走る．
  // let features: number[] = [];
  const doctor = poseLandmarks[0];
  const patient = poseLandmarks[1];
  // const prevFeatureDoctor = prevFeature.slice(0, 2);
  // const prevFeaturePatient = prevFeature.slice(2, 4);
  // const prevFeaturePair = prevFeature.slice(4, 6);

  const [dHandToKneeY, dShoulderToHipY] = calcFeatureIndividual(doctor);
  const [pHandToKneeY, pShoulderToHipY] = calcFeatureIndividual(patient);
  const [dpDistShoulderX, dpDistHipX] = calcFeaturePair(doctor, patient);

  return [dHandToKneeY, dShoulderToHipY, pHandToKneeY, pShoulderToHipY, dpDistShoulderX, dpDistHipX, 0];
}