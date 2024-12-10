import { useEffect, useState } from "react";
import { FRAMESIZE } from "../../consts/consts";

export const useResponsive = () => {
  const [canvasSize, setCanvasSize] = useState({ width: 640, height: 480 });
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const updateCanvasSize = () => {
      const width = window.innerWidth < 768 ? window.innerWidth : FRAMESIZE.CANVAS.WIDTH;
      const height = (width / FRAMESIZE.CANVAS.WIDTH) * FRAMESIZE.CANVAS.HEIGHT;
      setCanvasSize({ width, height });
      setIsMobile(window.innerWidth < 768);
    };
    
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []); 

  return { isMobile, canvasSize };
}