import { useCallback, useEffect, useRef } from "react";
import { drawHeatmap } from "../graph/drawHeatmap";
import { drawImage } from "./drawImage";

interface Props {
  originVideoRef: React.RefObject<HTMLVideoElement>,
  sourceCanvasRef: React.RefObject<HTMLCanvasElement>,
  heatmapCanvasRef: React.RefObject<HTMLCanvasElement>,
  heatmapArray: number[][],
  heatmapSize?: number,
}
export const useHeatmapRender = ({ originVideoRef, sourceCanvasRef, heatmapCanvasRef, heatmapArray }: Props) => {
    const animationFrameIdRef = useRef<number | null>(null);

    const originVideo = originVideoRef.current;

    const renderFrame = useCallback((heatmap: number[][]) => {
      const sourceCanvas = sourceCanvasRef.current;
      const heatmapCanvas = heatmapCanvasRef.current;
      if (!sourceCanvas || !heatmapCanvas) return;
      try {
        drawImage(sourceCanvas, heatmapCanvas);
        if (heatmap) {
          drawHeatmap(sourceCanvas, heatmapCanvas, heatmap);
        } else {
          drawImage(sourceCanvas, heatmapCanvas);
        }
      } catch (error) {
        console.error("Error in renderFrame:", error);
      }
    }, [heatmapCanvasRef, sourceCanvasRef]);
  
    const renderLoop = useCallback(() => {
      if (originVideo) {
        renderFrame(heatmapArray);
      }
      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    }, [heatmapArray, originVideo, renderFrame]);

    useEffect(() => {
      if (originVideo && originVideo.played) {
        animationFrameIdRef.current = requestAnimationFrame(renderLoop);
      }
      return () => {
        if (animationFrameIdRef.current !== null) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }
      }
    }, [originVideoRef, heatmapArray, renderLoop]);
  
  }