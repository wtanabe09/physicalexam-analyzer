
import { useHeatmap } from "./useHeatmapArray";
import { ClipRegion, LandmarkChunk } from "../../consts/types";
import { ClippedVideo } from "../video/ClippedVideo";
import { useRef } from "react";
import { useHeatmapRender } from "./useHeatmapRender";

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
  const heatmapWidth = Math.floor(canvasWidth / 13);
  const heatmapHeight = Math.floor(canvasHeight / 13);
  const heatmapArray = useHeatmap(landmarks, heatmapWidth, heatmapHeight);
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