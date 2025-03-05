import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { POSE_INDEX } from "../../exports/poseLandmarkIndex";
import { FormattedCsv, LandmarkChunk, Point2D } from "../../exports/types";

function isNormalizedLandmarkArray(arr: any[]): arr is NormalizedLandmark[] {
  return arr.length > 0 && typeof arr[0] === 'object' && 'x' in arr[0] && 'y' in arr[0];
}

function isNumberArray(arr: any[]): arr is number[] {
  return arr.length > 0 && typeof arr[0] === 'number';
}

export const getPoint = (landmark: NormalizedLandmark[]|number[], index: number): Point2D => {
  if (isNormalizedLandmarkArray(landmark)) {
    if (index >= landmark.length) {
      throw new Error(`Index ${index} is out of bounds for landmark array of length ${landmark.length}`);
    }
    return { x: landmark[index].x, y: landmark[index].y };
  } else if (isNumberArray(landmark)) {
    if (index * 2 + 1 >= landmark.length) {
      throw new Error(`Index ${index} is out of bounds for landmark array of length ${landmark.length}`);
    }
    return { x: landmark[index * 2], y: landmark[index * 2 + 1] };
  }
  return {x: 0, y: 0};
};

const calcDistance = (small: number, big: number): number => {
  return big - small;
};

export const calcFeatureIndividual = (poseLandmark: NormalizedLandmark[] | number[]): number[] => {
  try {
    const rightWrist = getPoint(poseLandmark, POSE_INDEX.Side.wrist.right);
    const rightKnee = getPoint(poseLandmark, POSE_INDEX.Side.knee.right);
    const rightShoulder = getPoint(poseLandmark, POSE_INDEX.Side.shoulder.right);
    const rightHip = getPoint(poseLandmark, POSE_INDEX.Side.hip.right);

    const handToKneeY = calcDistance(rightWrist.y, rightKnee.y);
    const shoulderToHipY = calcDistance(rightShoulder.y, rightHip.y);

    return [handToKneeY, shoulderToHipY];
  } catch (e) {
    console.error("Error in calcFeatureIndividual:", e);
    return [];
  }
};


export const calcFeaturePair = (
  doctorLandmark: NormalizedLandmark[]|number[], patientLandmark: NormalizedLandmark[]|number[]
): {distShoulder:number, distHip:number} => {
  let dpDistShoulderX = 0; let dpDistHipX = 0;
  try{
    const hipRightInd = POSE_INDEX.Side.hip.right;
    const wristRightInd = POSE_INDEX.Side.wrist.right;

    if (isNormalizedLandmarkArray(doctorLandmark) && isNormalizedLandmarkArray(patientLandmark)) {
      const dShoulder = doctorLandmark[wristRightInd];
      const dHip = doctorLandmark[hipRightInd];
      const pShoulder = patientLandmark[wristRightInd];
      const pHip = patientLandmark[hipRightInd];
      dpDistShoulderX = calcDistance(pShoulder.x, dShoulder.x);
      dpDistHipX = calcDistance(pHip.x, dHip.x);
    } else if (isNumberArray(doctorLandmark) && isNumberArray(patientLandmark)) {
      const dHipX = doctorLandmark[hipRightInd*2]
      const pHipX = patientLandmark[hipRightInd*2]
      const dWristX = doctorLandmark[wristRightInd*2]
      const pWristX = patientLandmark[wristRightInd*2]
      dpDistShoulderX = calcDistance(dWristX, pWristX);
      dpDistHipX = calcDistance(dHipX, pHipX);
    }
  } catch(e) {
    console.log(e);
  }
  const distShoulder = Math.abs(dpDistShoulderX);
  const distHip = Math.abs(dpDistHipX);
  return {distShoulder, distHip};
}

// 特徴量の計算を行う関数
// export const calcFeature = (poseLandmarks: NormalizedLandmark[][], prevFeature: number[]): number[] => {
//   // poseLandmarksがnullの場合はエラー処理が走る．
//   // let features: number[] = [];
//   const doctor = poseLandmarks[0];
//   const patient = poseLandmarks[1];
//   // const prevFeatureDoctor = prevFeature.slice(0, 2);
//   // const prevFeaturePatient = prevFeature.slice(2, 4);
//   // const prevFeaturePair = prevFeature.slice(4, 6);

//   const [dHandToKneeY, dShoulderToHipY] = calcFeatureIndividual(doctor);
//   const [pHandToKneeY, pShoulderToHipY] = calcFeatureIndividual(patient);
//   const {dpDistShoulderX, dpDistHipX} = calcFeaturePair(doctor, patient);

//   return [dHandToKneeY, dShoulderToHipY, pHandToKneeY, pShoulderToHipY, dpDistShoulderX, dpDistHipX, 0];
// }

export const getSmalestFeature = (landmarkChunk: LandmarkChunk|FormattedCsv) => {
  const smallList: {
    distShoulder:number, distHip:number, rowShoulder:number, rowHip:number
  } = {distShoulder: 1, distHip:1, rowShoulder:0, rowHip:0};
  const LAND_COL = 1
  landmarkChunk.forEach((landmark, i) => {
    const personA = landmark[LAND_COL][0];
    const personB = landmark[LAND_COL][1];
    if (isNormalizedLandmarkArray(personA) && isNormalizedLandmarkArray(personB)) {
      const dist = personA[POSE_INDEX.Side.hip.left*2].x - personB[POSE_INDEX.Side.hip.left*2].x;
      if (dist < smallList.distHip) {
        smallList.distHip = dist;
        smallList.rowHip = i;
      }
    }
    // const { distShoulder, distHip } = calcFeaturePair(parsonB, parsonA);
    // const dist = personA[]
    // if (distShoulder < smallList.distShoulder) {
    //   smallList.distShoulder = distShoulder;
    //   smallList.rowShoulder = i;
    // } else if (distHip < smallList.distHip) {
    //   smallList.distHip = distHip;
    //   smallList.rowShoulder = i;
    // }
  })
  return smallList;
}