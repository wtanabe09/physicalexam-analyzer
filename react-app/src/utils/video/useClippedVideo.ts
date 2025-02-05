import { useEffect } from "react";
import { ClipRegion } from "../../exports/types";

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>,
  clippedCanvasRef: React.RefObject<HTMLCanvasElement>,
  clipRegion: ClipRegion,
}

export const useClippedVideo = ({videoRef, clippedCanvasRef, clipRegion}: Props) => {
  useEffect(() => {
    const video = videoRef.current;
    const clippedCanvas = clippedCanvasRef.current;
    if (video && clippedCanvas && clipRegion) {
      // video.currentTime = 1;
      const ctx = clippedCanvas.getContext('2d');
      
      const drawClippedFrame = () => {
        if (video && ctx) {
          ctx.clearRect(0, 0, clippedCanvas.width, clippedCanvas.height);

          ctx.drawImage( video,
            clipRegion.x, clipRegion.y, clipRegion.width, clipRegion.height,
            0, 0, clippedCanvas.width, clippedCanvas.height
          );
        }
        requestAnimationFrame(drawClippedFrame);
      };

      drawClippedFrame();
    }
    return () => {
      if (clippedCanvas) {
        const ctx = clippedCanvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, clippedCanvas.width, clippedCanvas.height);
      }
    }
  }, [clipRegion, clippedCanvasRef, videoRef]);
}