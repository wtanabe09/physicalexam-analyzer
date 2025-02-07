/*
  リアルタイムに姿勢推定を施し，結果をCanvasに描画してアウトプットする．
  1. Sourceから映像を受け取り，VideoタグのSourceにセットする
  2. VideoタグのSourceを読み取りMediapipeの姿勢推定を実施．LandmarkResultが返される（useMediapipe)
  3. LandamrkResultの結果をCanvasに描画（drawLandmarks)
*/

import { RefObject, useEffect, useRef } from "react";
import { useLandmarkDetector } from "./useLandmarkDetector";
import { ClipRegion, LandmarkChunk, LandmarkType } from "../../exports/types";
import { ClippedVideo } from "../video/ClippedVideo";
import { drawLandmarksByDetected } from "./drawLandmarksByDetected";
import { useLandmarkChunk } from "./useLnadmarkChunk";
import { drawImage } from "./drawImage";

interface Props {
  videoRef: RefObject<HTMLVideoElement>;
  width: number | string;
  height: number | string;
  isRecording: boolean;
  landmarksToParent: React.Dispatch<React.SetStateAction<LandmarkChunk>>;
  clipRegion: ClipRegion;
  isDisplayPosture: boolean;
  landmarkType: LandmarkType;
}

export const LandmarkVideoRealtime: React.FC<Props> = ({
  videoRef, width, height,
  isRecording, landmarksToParent,
  clipRegion, isDisplayPosture, landmarkType
}) => {
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const { landmarks } = useLandmarkDetector(landmarkType, videoRef, sourceCanvasRef, clipRegion); /* landmarks: [timestamp, result] */

  //chunkを作成し、親(Recording)コンポーネントに渡す。 即時フィードバックビデオでも使うから。
  useLandmarkChunk({ landmarks, landmarkType, isRecording, landmarksToParent });

  useEffect(() => {
    const sourceCanvas = sourceCanvasRef.current;
    const outputCanvas = outputCanvasRef.current;
    if (landmarks && videoRef.current && sourceCanvas && outputCanvas) {
      drawImage(sourceCanvas, outputCanvas, 1, landmarks[1]);
      drawLandmarksByDetected(landmarks[1], landmarkType, sourceCanvas, outputCanvas, isDisplayPosture);
    }
  }, [landmarks, isDisplayPosture, videoRef, outputCanvasRef, sourceCanvasRef, landmarkType]);

  return (
    <div className="flex">
      <ClippedVideo
        ref={sourceCanvasRef}
        videoRef={videoRef}
        width={width}
        height={height}
        clipRegion={clipRegion}
        style={{display: "none"}}
      />
      <canvas
        ref={outputCanvasRef}
        width={width}
        height={height}
      />
    </div>
  )
}