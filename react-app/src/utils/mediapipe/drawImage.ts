import { NormalizedLandmark } from "@mediapipe/tasks-vision";

type Landmarks = number[] | NormalizedLandmark[];

const getLandmarkCoordinates = (
  landmarks: number[] | NormalizedLandmark[],
  landmark: number | NormalizedLandmark,
  index: number
): [number, number] => {
  if (typeof landmark === 'number') {
    // landmarks: number[]のindexはx,yの順に並んでいる．偶数列がx,奇数列がy
    return [landmarks[index * 2] as number, landmarks[index * 2 + 1] as number];
  } else if (typeof landmark === 'object') {
    return [landmark.x as number, landmark.y as number];
  }
  return [0, 0];
};

const ZOOM_MARK = 12;
export const drawImage = (
  source: HTMLCanvasElement | HTMLVideoElement, outputCanvas: HTMLCanvasElement,
  zoomLevel?: number, landmarks?: number[][] | NormalizedLandmark[][],
) => {
  const canvasWidth = outputCanvas.width;
  const canvasHeight = outputCanvas.height;
  if (!source || !outputCanvas) return;

  const canvasCtx = outputCanvas.getContext("2d")!;
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);

  if (zoomLevel && zoomLevel !== 1 && landmarks) {
    const [middleX, middleY] = getLandmarkCoordinates(landmarks[0], landmarks[0][ZOOM_MARK], ZOOM_MARK);
    canvasCtx.translate(middleX * canvasWidth , middleY * canvasHeight);
    canvasCtx.scale(zoomLevel, zoomLevel);
    canvasCtx.translate(-middleX * canvasWidth, -middleY * canvasHeight);
  }

  canvasCtx.drawImage(source, 0, 0, canvasWidth, canvasHeight);
}
