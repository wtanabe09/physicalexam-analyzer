import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { calcFeatureIndividual, getPoint } from "./calcFeature";
import { Point2D } from "../../exports/types";
import { POSE_INDEX } from "../../exports/poseLandmarkIndex";

export const calcScale = (testLand: number[], compairLand: NormalizedLandmark[]): number => {
  const [tHandToKneeY, tShoulderToHipY] = calcFeatureIndividual(testLand);
  const [cHandToKneeY, cShoulderToHipY] = calcFeatureIndividual(compairLand);
  const scale = (tShoulderToHipY / cShoulderToHipY);
  return scale;
}

export const calcSlide = (testLand: number[], compairLand: NormalizedLandmark[]): Point2D => {
  const testHip = getPoint(testLand, POSE_INDEX.Side.hip.left);
  const compHip = getPoint(compairLand, POSE_INDEX.Side.hip.left);
  const slideX = testHip.x - compHip.x;
  const slideY = testHip.y - compHip.y;
  return {x: slideX, y: slideY};
}