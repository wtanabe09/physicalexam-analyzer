import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { useCallback, useEffect, useRef } from "react";
import { LandmarkType, MyLandmarkType } from "../../exports/types";
import { drawLandmarksByDetected } from "./drawLandmarksByDetected";
import { drawImage } from "./drawImage";

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>;
  sourceCanvasRef: React.RefObject<HTMLCanvasElement>;
  outputCanvasRef: React.RefObject<HTMLCanvasElement>;
  landmarkChunk: [number, MyLandmarkType][];
  landmarkType: LandmarkType;
  isDisplayPosture: boolean;
  zoomLevel: number;
}

const TIMESTAMPCOL = 0;
const LANDMARKCOL = 1;
const DELAY = 110;

const isNormalizedLandmarkArray = (landmarks: MyLandmarkType): landmarks is NormalizedLandmark[][] => {
  return landmarks.length > 0 && typeof landmarks[0][0] === 'object' && 'x' in landmarks[0][0];
};

const isNumberArray = (landmarks: MyLandmarkType): landmarks is number[][] => {
  return landmarks.length > 0 && typeof landmarks[0][0] === 'number';
};

export const useLandmarkRender = ({
  videoRef, sourceCanvasRef, outputCanvasRef,
  landmarkChunk, landmarkType, isDisplayPosture, zoomLevel
}: Props) => {
  const animationFrameIdRef = useRef<number | null>(null);
  const lastCounterRef = useRef<number>(0);

  const renderFrame = useCallback((landmarks: MyLandmarkType) => {
    const sourceCanvas = sourceCanvasRef.current;
    const outputCanvas = outputCanvasRef.current;
    if (!sourceCanvas || !outputCanvas) return;
    
    try {
      if (isNormalizedLandmarkArray(landmarks) || isNumberArray(landmarks)) {
        drawLandmarksByDetected( 
          landmarks, landmarkType, sourceCanvas, outputCanvas,
          isDisplayPosture, zoomLevel
        );
      } else {
        drawImage(sourceCanvas, outputCanvas, zoomLevel, landmarks);
      }
    } catch (error) {
      console.error("Error in renderFrame:", error);
    }
  }, [isDisplayPosture, landmarkType, outputCanvasRef, sourceCanvasRef, zoomLevel])

  
  const renderLoop = useCallback(() => {
    const video = videoRef.current;
    if (!video || !landmarkChunk) return;

    const currentTime = video.currentTime * 1000;
    const adjustedTime = currentTime + DELAY;
    let counter = lastCounterRef.current;
    while (counter < landmarkChunk.length && landmarkChunk[counter][TIMESTAMPCOL] < adjustedTime) {
      counter++;
    }
    
    if (video && landmarkChunk[counter]) {
      const landmarks = landmarkChunk[counter][LANDMARKCOL]
      renderFrame(landmarks);
    }

    animationFrameIdRef.current = requestAnimationFrame(renderLoop);
  }, [landmarkChunk, renderFrame, videoRef]);


  useEffect(() => {
    const video = videoRef.current;
    const canvas = outputCanvasRef.current;
    
    if (video) {
      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    }

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (canvas) {
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [videoRef, landmarkChunk, renderLoop, outputCanvasRef, isDisplayPosture]);

};
