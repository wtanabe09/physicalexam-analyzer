import { HandLandmarker, NormalizedLandmark, PoseLandmarker } from "@mediapipe/tasks-vision";

export type LoadingStatus  = 'idle' | 'loading' | 'loaded' | 'error';

export type ActivateState = 'activate' | 'no user selected' | 'wrong password';

export type VideoSource = Blob | MediaStream;

export type LandmarkArray = [number[], number[]];
   
export type FormattedCsvType = [number, LandmarkArray][];

export type MyLandmarkType = NormalizedLandmark[][] | number[][];


export type Point2D = {
  x: number;
  y: number;
}

export type Connection = {
  start: number;
  end: number;
}

export type Timestamp = number;

export type LandmarkChunk = [[Timestamp, NormalizedLandmark[][]]];

export type ClipRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Landmarker = PoseLandmarker | HandLandmarker;

export type LandmarkType = "pose" | "hand" | "hand_patient_camera";

export type FetchMethodType = "GET" | "PUT"