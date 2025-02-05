import { useCallback, useEffect } from "react";
import { drawHeatmap } from "./drawHeatmap";
import { drawImage } from "../mediapipe/drawImage";

interface Props {
  originVideoRef: React.RefObject<HTMLVideoElement>,
  sourceCanvasRef: React.RefObject<HTMLCanvasElement>,
  heatmapCanvasRef: React.RefObject<HTMLCanvasElement>,
  heatmapArray: number[][],
  heatmapSize?: number,
}
export const useHeatmapRender = ({ originVideoRef, sourceCanvasRef, heatmapCanvasRef, heatmapArray }: Props) => {
  
    const renderFrame = useCallback((heatmap: number[][]) => {
      const sourceCanvas = sourceCanvasRef.current;
      const heatmapCanvas = heatmapCanvasRef.current;
      if (!sourceCanvas || !heatmapCanvas) return;
      try {
        drawImage(sourceCanvas, heatmapCanvas);
        drawHeatmap(sourceCanvas, heatmapCanvas, heatmap);
      } catch (error) {
        console.error("Error in renderFrame:", error);
      }
    }, [heatmapCanvasRef, sourceCanvasRef]);
  
    const renderLoop = useCallback(() => {
      if (!heatmapArray) return;
      renderFrame(heatmapArray);
      requestAnimationFrame(renderLoop);
    }, [heatmapArray, renderFrame]);

    useEffect(() => {
      const originalVideo = originVideoRef.current;
      if (!originalVideo || !heatmapArray) return;
      if (originVideoRef.current && originVideoRef.current.played) {
        renderLoop();
      }
    }, [originVideoRef, heatmapArray, renderLoop]);
  
  }