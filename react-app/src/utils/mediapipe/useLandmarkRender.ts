import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { useCallback, useEffect } from "react";
import { LandmarkType, MyLandmarkType } from "../../exports/types";
import { drawLandmarksByDetected } from "./drawLandmarks";
import { drawImage } from "./drawImage";

const TIMESTAMPCOL = 0;
const LANDMARKCOL = 1;
const DELAY = 110;

const isNormalizedLandmarkArray = (landmarks: MyLandmarkType): landmarks is NormalizedLandmark[][] => {
  return landmarks.length > 0 && typeof landmarks[0][0] === 'object' && 'x' in landmarks[0][0];
};

const isNumberArray = (landmarks: MyLandmarkType): landmarks is number[][] => {
  return landmarks.length > 0 && typeof landmarks[0][0] === 'number';
};

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>;
  sourceCanvasRef: React.RefObject<HTMLCanvasElement>;
  outputCanvasRef: React.RefObject<HTMLCanvasElement>;
  landmarkChunk: [number, MyLandmarkType][];
  landmarkType: LandmarkType;
  isDisplayPosture: boolean;
  zoomLevel: number;
}

export const useLandmarkRender = ({
  videoRef, sourceCanvasRef, outputCanvasRef,
  landmarkChunk, landmarkType, isDisplayPosture, zoomLevel
}: Props) => {

  const renderFrame = useCallback((landmarks: MyLandmarkType) => {
    const sourceCanvas = sourceCanvasRef.current;
    const outputCanvas = outputCanvasRef.current;
    if (!sourceCanvas || !outputCanvas) return;
    try {
      // drawImage(sourceCanvas, outputCanvas, zoomLevel, landmarks);
      if (isNormalizedLandmarkArray(landmarks) || isNumberArray(landmarks)){
        drawLandmarksByDetected(
          landmarks, landmarkType,
          sourceCanvas, outputCanvas,
          isDisplayPosture, zoomLevel
        );
      } else {
        drawImage(sourceCanvas, outputCanvas, 1, landmarks);
      }
    } catch (error) {
      console.error("Error in renderFrame:", error);
    }
  }, [sourceCanvasRef, outputCanvasRef, landmarkType, isDisplayPosture, zoomLevel]);

  const renderLoop = useCallback(() => {
    const video = videoRef.current;
    if (!video || !landmarkChunk) return;

    const currentTime = video.currentTime * 1000;
    const adjustedTime = currentTime + DELAY;
    let counter = 0;
    // ランドマークのタイムスタンプが現在のビデオの再生時間よりも前の場合は、次のランドマークを探す
    while (counter < landmarkChunk.length && landmarkChunk[counter][TIMESTAMPCOL] < adjustedTime) counter++ ;
    if (video.played && landmarkChunk[counter]) {
      renderFrame(landmarkChunk[counter][LANDMARKCOL]);
    }

    requestAnimationFrame(renderLoop);
  }, [landmarkChunk, renderFrame, videoRef]);

  const renderInitialFrame = useCallback(() => {
    if (landmarkChunk && landmarkChunk.length > 0) {
      renderFrame(landmarkChunk[0][LANDMARKCOL]);
    } else {
      // ランドマークがない場合は、ソースキャンバスの内容をそのまま描画
      if (sourceCanvasRef.current && outputCanvasRef.current) {
        drawImage(sourceCanvasRef.current, outputCanvasRef.current);
      }
    }
  }, [landmarkChunk, renderFrame, sourceCanvasRef, outputCanvasRef]);


  useEffect(() => {
    const video = videoRef.current;
    const canvas = outputCanvasRef.current;
    if (video) {
      video.addEventListener('loadeddata', renderInitialFrame);
      video.addEventListener('play', renderLoop);
    }
    return () => {
      if (video) {
        video.removeEventListener('loadeddata', renderInitialFrame);
        video.removeEventListener('play', renderLoop);
      }
      if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [videoRef, landmarkChunk, renderFrame, renderLoop]);

};
