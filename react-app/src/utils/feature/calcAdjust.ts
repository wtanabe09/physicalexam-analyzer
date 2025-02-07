import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { getPoint } from "./calcFeature";
import { POSE_INDEX } from "../../exports/poseLandmarkIndex";

// export const calcScale = (testLand: number[], compairLand: NormalizedLandmark[]): number => {
//   const [tHandToKneeY, tShoulderToHipY] = calcFeatureIndividual(testLand);
//   const [cHandToKneeY, cShoulderToHipY] = calcFeatureIndividual(compairLand);
//   const scale = (tShoulderToHipY / cShoulderToHipY);
//   return scale;
// }

export const calcSlide = (testLand: number[]|NormalizedLandmark[], compairLand: number[]|NormalizedLandmark[]) => {
  const testHip = getPoint(testLand, POSE_INDEX.Side.hip.left);
  const compHip = getPoint(compairLand, POSE_INDEX.Side.hip.left);
  const slideX = testHip.x - compHip.x;
  const slideY = testHip.y - compHip.y;
  return {slideX, slideY};
}