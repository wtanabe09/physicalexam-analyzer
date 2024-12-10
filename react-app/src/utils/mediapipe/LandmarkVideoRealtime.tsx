/*
  リアルタイムに姿勢推定を施し，結果をCanvasに描画してアウトプットする．
  1. Sourceから映像を受け取り，VideoタグのSourceにセットする
  2. VideoタグのSourceを読み取りMediapipeの姿勢推定を実施．LandmarkResultが返される（useMediapipe)
  3. LandamrkResultの結果をCanvasに描画（drawLandmarks)
*/

import { RefObject, useEffect, useRef } from "react";
import { useLandmarkDetector } from "./useLandmarkDetector";
import { ClipRegion, LandmarkChunk, LandmarkType, LoadingStatus } from "../../consts/types";
import { ClippedVideo } from "../video/ClippedVideo";
import { useLandmarker } from "./useLandmarker";
import { drawLandmarksByDetected } from "./drawLandmarks";
import { useLandmarkChunk } from "./useLnadmarkChunk";
import { drawImage } from "./drawImage";

interface Props {
  videoRef: RefObject<HTMLVideoElement>;
  videoLoadState: LoadingStatus;
  width: number | string;
  height: number | string;
  isRecording: boolean;
  landmarksToParent: React.Dispatch<React.SetStateAction<LandmarkChunk>>;
  clipRegion: ClipRegion;
  isDisplayPosture: boolean;
  landmarkType: LandmarkType;
  sessionName: String | null;
}

export const LandmarkVideoRealtime: React.FC<Props> = ({
  videoRef, videoLoadState, width, height,
  isRecording, landmarksToParent,
  clipRegion, isDisplayPosture, landmarkType, sessionName
}) => {
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);

  const { landmarker } = useLandmarker(landmarkType);
  const { landmarks } = useLandmarkDetector(landmarker, videoRef, sourceCanvasRef, clipRegion); /* landmarks: [timestamp, result] */

  //chunkを作成し、親Recordingコンポーネントに渡す。 即時フィードバックビデオでも使うから。
  const landmarkChunk = useLandmarkChunk({landmarks, landmarkType, isRecording, sessionName, clipRegion});
  useEffect(() => {
    if(landmarkChunk) landmarksToParent(landmarkChunk);
  }, [landmarkChunk, landmarkType, landmarksToParent]);

  useEffect(() => {
    const video = videoRef.current;
    const outputCanvas = outputCanvasRef.current;
    const sourceCanvas = sourceCanvasRef.current;
    if (landmarks && video && sourceCanvas && outputCanvas) {
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