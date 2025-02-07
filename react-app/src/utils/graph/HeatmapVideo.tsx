
import { useHeatmap } from "./useHeatmapArray";
import { ClipRegion, LandmarkChunk } from "../../exports/types";
import { ClippedVideo } from "../video/ClippedVideo";
import { useRef } from "react";
import { useHeatmapRender } from "../mediapipe/useHeatmapRender";

interface Props {
  originVideoRef: React.RefObject<HTMLVideoElement>,
  landmarks: LandmarkChunk | null,
  canvasWidth: number,
  canvasHeight: number,
  clipRegion: ClipRegion
}
export const HeatmapVideo: React.FC<Props> = ({ originVideoRef, landmarks, canvasWidth, canvasHeight, clipRegion }) => {
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const heatmapCanvasRef = useRef<HTMLCanvasElement>(null);
  const separate = 13;
  const heatmapCanvas = {width: Math.floor(canvasWidth / separate), height: Math.floor(canvasHeight / separate)}
  const heatmapArray = useHeatmap(landmarks, heatmapCanvas.width, heatmapCanvas.height);
  useHeatmapRender({originVideoRef, sourceCanvasRef, heatmapCanvasRef, heatmapArray});
  
  return (
      <div>
        <ClippedVideo
          ref={sourceCanvasRef}
          videoRef={originVideoRef}
          width={canvasWidth}
          height={canvasHeight}
          clipRegion={clipRegion}
          style={{display: "none"}}
        />
        <canvas
          className="output_canvas"
          ref={heatmapCanvasRef}
          width={canvasWidth}
          height={canvasHeight}
        />
      </div>
  );
}