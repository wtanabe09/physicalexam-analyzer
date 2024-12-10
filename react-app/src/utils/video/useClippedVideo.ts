import { useEffect } from "react";
import { ClipRegion } from "../../consts/types";

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>,
  clippedCanvasRef: React.RefObject<HTMLCanvasElement>,
  clipRegion: ClipRegion,
}

export const useClippedVideo = ({videoRef, clippedCanvasRef, clipRegion}: Props) => {
  useEffect(() => {
    if (videoRef.current && clippedCanvasRef.current && clipRegion) {
      const clippedCanvas = clippedCanvasRef.current;
      const ctx = clippedCanvas.getContext('2d');
      
      const drawClippedFrame = () => {
        if (videoRef.current && ctx) {
          ctx.drawImage(
            videoRef.current,
            clipRegion.x, clipRegion.y, clipRegion.width, clipRegion.height,
            0, 0, clippedCanvas.width, clippedCanvas.height
          );
        }
        requestAnimationFrame(drawClippedFrame);
      };

      drawClippedFrame();
    }
    return () => {
      if (clippedCanvasRef.current) {
        const ctx = clippedCanvasRef.current.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, clippedCanvasRef.current.width, clippedCanvasRef.current.height);
      }
    }
  }, [clipRegion, clippedCanvasRef, videoRef]);
}