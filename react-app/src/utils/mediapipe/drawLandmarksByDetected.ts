import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { POSE_CONNECTIONS, HAND_CONNECTIONS } from "../../exports/consts";
import { HAND_INDEX } from "../../exports/handLandmarkIndex";
import { Connection, LandmarkType, MyLandmarkType } from "../../exports/types";

const INDEX_KNEE_LANDMARK = 27;
const ZOOM_MARKING_INDEX = HAND_INDEX.thumb.tip;

const isNormalizedLandmarkArray = (landmarks: MyLandmarkType): landmarks is NormalizedLandmark[][] => {
  return landmarks.length > 0 && typeof landmarks[0][0] === 'object' && 'x' in landmarks[0][0];
};

const isNumberArray = (landmarks: MyLandmarkType): landmarks is number[][] => {
  return landmarks.length > 0 && typeof landmarks[0][0] === 'number';
};

const calculateMargin = (canvasSize: number, magnification: number) => 
  (canvasSize - canvasSize * magnification) / 2;

const calculatePosition = (landmark: number, canvasSize: number, magnification: number) => 
  landmark * canvasSize * magnification;

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

const drawLandmarks = (
  landmarks: number[] | NormalizedLandmark[],
  canvasCtx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number,
  color: string = 'white', arcWidth: number = 3, magnification: number = 1
) => {
  if (!landmarks || landmarks.length === 0) return;

  const marginX = calculateMargin(canvasWidth, magnification);
  const marginY = calculateMargin(canvasHeight, magnification);

  landmarks.slice(0, INDEX_KNEE_LANDMARK).forEach((landmark, i) => {
    const [landmarkX, landmarkY] = getLandmarkCoordinates(landmarks, landmark, i);
    const drawX = calculatePosition(landmarkX, canvasWidth, magnification) + marginX;
    const drawY = calculatePosition(landmarkY, canvasHeight, magnification) + marginY;

    canvasCtx.beginPath();
    canvasCtx.arc(drawX, drawY, arcWidth, 0, Math.PI * 2);
    canvasCtx.fillStyle = color;
    if (i === ZOOM_MARKING_INDEX) canvasCtx.fillStyle = 'green'; // 拡大の基準点である、12番目のlandmarkを緑色にする。
    canvasCtx.fill();
  });
}

const drawConnectors = (
  landmarks: number[] | NormalizedLandmark[], connections: Connection[],
  canvasCtx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number,
  color: string = 'white', lineWidth: number = 2, magnification: number = 1
) => {
  if (!landmarks || landmarks.length < 1) return;
  const marginX = calculateMargin(canvasWidth, magnification);
  const marginY = calculateMargin(canvasHeight, magnification);

  connections.forEach(({start, end}) => {
    if (start >= INDEX_KNEE_LANDMARK || end >= INDEX_KNEE_LANDMARK) return;

    const [startX, startY] = getLandmarkCoordinates(landmarks, landmarks[start], start);
    const [endX, endY] = getLandmarkCoordinates(landmarks, landmarks[end], end);

    const drawStartX = calculatePosition(startX, canvasWidth, magnification) + marginX;
    const drawStartY = calculatePosition(startY, canvasHeight, magnification) + marginY;
    const drawEndX = calculatePosition(endX, canvasWidth, magnification) + marginX;
    const drawEndY = calculatePosition(endY, canvasHeight, magnification) + marginY;
    
    canvasCtx.beginPath();
    canvasCtx.moveTo(drawStartX, drawStartY);
    canvasCtx.lineTo(drawEndX, drawEndY);
    canvasCtx.strokeStyle = color;
    canvasCtx.lineWidth = lineWidth;
    canvasCtx.stroke();
  });
}

const zoomControl = (
  zoomLevel: number, landmarks: number[][] | NormalizedLandmark[][],
  canvasCtx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number
) => {
  if (zoomLevel !== 1 && landmarks) {
    // 画面上のより上に写っている方（y座標がより小さい方の手）を対象とする
    let targetIndex = 0;
    if (landmarks.length > 1 && isNormalizedLandmarkArray(landmarks)) {
      if (landmarks[0][HAND_INDEX.pinky.tip].y > landmarks[1][HAND_INDEX.pinky.tip].y) {
        targetIndex = 1;
      }
    } else if (isNumberArray(landmarks)) {
      if (landmarks.length > 1 && landmarks[0][HAND_INDEX.pinky.tip*2+1] > landmarks[1][HAND_INDEX.pinky.tip*2+1]) {
        targetIndex = 1;
      }
    }

    const [middleX, middleY] = getLandmarkCoordinates(landmarks[targetIndex], landmarks[targetIndex][ZOOM_MARKING_INDEX], ZOOM_MARKING_INDEX);
    if (0 < middleX && middleX < 1 && 0 < middleY && middleY < 1) {
      const x = middleX * canvasWidth;
      const y = middleY * canvasHeight;
      console.log(x, y);
      canvasCtx.translate(x, y);
      canvasCtx.scale(zoomLevel, zoomLevel);
      canvasCtx.translate(-x, -y);
    }
  }
}

// 顔の円などを書き加えて描画する
export const drawLandmarksByDetected = (
  landmarks: number[][] | NormalizedLandmark[][], landmarkType: LandmarkType, 
  sourceCanvas: HTMLCanvasElement, outputCanvas: HTMLCanvasElement,
  isDiaplayPosture: boolean, zoomLevel: number = 1
) => {
  if (landmarks && sourceCanvas && outputCanvas) {
    const canvasWidth = outputCanvas.width; 
    const canvasHeight = outputCanvas.height;
    const arcWidth = landmarkType === 'pose' ? 5 : 2;

    const canvasCtx = outputCanvas.getContext("2d")!;
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (zoomLevel !== 1) {
      zoomControl(zoomLevel, landmarks, canvasCtx, canvasWidth, canvasHeight);
    }

    canvasCtx.drawImage(sourceCanvas, 0, 0, canvasWidth, canvasHeight);

    const connections = landmarkType === 'pose' ? POSE_CONNECTIONS : HAND_CONNECTIONS;
    if (isDiaplayPosture) {
      landmarks.forEach((landmark, i) => {
        const colorString = i === 0 ? 'red' : 'blue';
        drawConnectors(
          landmark, connections,
          canvasCtx, canvasWidth, canvasHeight, colorString
        );
        drawLandmarks(
          landmark,
          canvasCtx, canvasWidth, canvasHeight, colorString, arcWidth
        );
      });
    }

    canvasCtx.restore();
  }
}

// const drawFaceArc = (poseLandmarks: NormalizedLandmark[], canvasCtx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
//   let arcWidth = 0
//   if ((poseLandmarks[7].x - poseLandmarks[8].x) > 0) {
//     arcWidth = (poseLandmarks[7].x - poseLandmarks[8].x) * canvasWidth;
//   }
  
//   canvasCtx.beginPath(); // パスの開始
//   canvasCtx.arc(poseLandmarks[0].x*canvasWidth, poseLandmarks[0].y*canvasHeight, arcWidth, 0, Math.PI * 2);
//   canvasCtx.fillStyle = "red"; // 塗りつぶしの色を赤に指定
//   canvasCtx.fill(); // 円を塗りつぶす
// }

// 固定値の表示：指導医のデータとして表示したい．
// export const drawConstPose = (drawingUtils: DrawingUtils, constLandmark: NormalizedLandmark[][]) => {
//   drawingUtils.drawLandmarks(constLandmark[0], {
//     radius: (data) => DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1),
//     color: 'green',
//   });
//   drawingUtils.drawConnectors(constLandmark[0], PoseLandmarker.POSE_CONNECTIONS, {lineWidth: 2});
// }
