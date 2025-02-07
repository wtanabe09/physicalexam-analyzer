import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { useCallback, useEffect, useRef } from "react";
import { FormattedCsv, LandmarkChunk, LandmarkType, MyLandmarkType } from "../../exports/types";
import { drawLandmarksByDetected } from "./drawLandmarksByDetected";
import { drawImage } from "./drawImage";
import { calcSlide } from "../feature/calcAdjust";
import { POSE_INDEX } from "../../exports/poseLandmarkIndex";

interface Props {
  originVideoRef: React.RefObject<HTMLVideoElement>;
  sourceCanvasRef: React.RefObject<HTMLCanvasElement>;
  outputCanvasRef: React.RefObject<HTMLCanvasElement>;
  landmarkChunkOriginal: LandmarkChunk;
  landmarkChunkTarget: LandmarkChunk|FormattedCsv|null;
  landmarkType: LandmarkType;
  isDisplayPosture: boolean;
  comparisonRow: number;
}

// const TIMESTAMPCOL = 0;
const LANDMARKCOL = 1;
const DELAY = 110;

const isNormalizedLandmarkArray = (landmarks: MyLandmarkType): landmarks is NormalizedLandmark[][] => {
  return landmarks.length > 0 && typeof landmarks[0][0] === 'object' && 'x' in landmarks[0][0];
};

const isNumberArray = (landmarks: MyLandmarkType): landmarks is number[][] => {
  return landmarks.length > 0 && typeof landmarks[0][0] === 'number';
};

export const useComparisonLandmarkRender = ({
  originVideoRef, sourceCanvasRef, outputCanvasRef,
  landmarkChunkOriginal, landmarkChunkTarget, landmarkType, isDisplayPosture, comparisonRow
}: Props) => {
  const animationFrameIdRef = useRef<number | null>(null);
  const lastCounterRef = useRef<number>(0);

  const renderFrame = useCallback((
    landmarksTarget: MyLandmarkType, landmarksOrigin: MyLandmarkType
  ) => {
    const sourceCanvas = sourceCanvasRef.current;
    const outputCanvas = outputCanvasRef.current;
    if (!landmarkChunkTarget || !sourceCanvas || !outputCanvas) return;
    
    try {
      if (isNormalizedLandmarkArray(landmarksTarget) || isNumberArray(landmarksTarget)) {
        // 左に位置する人をターゲットにするため(x座法が小さい方を対象にする)
        const patient_index_target = landmarksTarget[0][POSE_INDEX.Side.hip.left*2] < landmarksTarget[1][POSE_INDEX.Side.hip.left*2] ? 0 : 1;
        const patient_index_origin = landmarksOrigin[0][POSE_INDEX.Side.hip.left*2] < landmarksOrigin[1][POSE_INDEX.Side.hip.left*2] ? 0 : 1;
        const {slideX, slideY} = calcSlide(landmarksOrigin[patient_index_origin], landmarksTarget[patient_index_target]);
        
        const slidedLandmarks = landmarksTarget.map((row) => 
          row.map((landmark, i) =>
            typeof landmark === 'number' ? landmark + (i % 2 === 0 ? slideX : slideY) : 0
          )
        );
        drawLandmarksByDetected(
          slidedLandmarks, landmarkType,
          sourceCanvas, outputCanvas,
          isDisplayPosture
        );
      } else {
        drawImage(sourceCanvas, outputCanvas, landmarksTarget);
      }
    } catch (error) {
      console.error("Error in renderFrame:", error);
    }
  }, [isDisplayPosture, landmarkChunkTarget, landmarkType, outputCanvasRef, sourceCanvasRef])

  
  const renderLoop = useCallback(() => {
    const video = originVideoRef.current;
    if (!video || !landmarkChunkTarget || !landmarkChunkOriginal) return;

    const currentTime = video.currentTime * 1000;
    const adjustedTime = currentTime + DELAY;
    let counter = lastCounterRef.current;
    while (counter < landmarkChunkOriginal.length && landmarkChunkOriginal[counter][0] < adjustedTime) {
      counter++;
    }

    const targetFrame = comparisonRow
    if (video && landmarkChunkTarget[targetFrame] && landmarkChunkOriginal[counter]) {
      const landmarksTarget = landmarkChunkTarget[targetFrame][LANDMARKCOL]; // time: 0, lamd: 1
      const landmarksOrigin = landmarkChunkOriginal[counter][LANDMARKCOL];
      renderFrame(landmarksTarget, landmarksOrigin);
    }

    animationFrameIdRef.current = requestAnimationFrame(renderLoop);
  }, [originVideoRef, landmarkChunkTarget, landmarkChunkOriginal, comparisonRow, renderFrame]);


  useEffect(() => {
    const video = originVideoRef.current;
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
  }, [originVideoRef, landmarkChunkOriginal, renderLoop, outputCanvasRef, isDisplayPosture]);

};
