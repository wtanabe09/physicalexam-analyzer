import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { ClipRegion } from "../../exports/types";
import { useClippedVideo } from "./useClippedVideo";

interface Props {
  id?: string,
  videoEle: HTMLVideoElement,
  width: string | number,
  height: string | number,
  clipRegion: ClipRegion,
  style?: React.CSSProperties,
}

export const ClippedVideo = forwardRef<HTMLCanvasElement, Props>(
  ({id, videoEle, width, height, clipRegion, style}, ref) => {
    
  const internalRef = useRef<HTMLCanvasElement>(null);
  useImperativeHandle(ref, () => internalRef.current!, []);
  useClippedVideo({ videoEle, clippedCanvasRef: internalRef, clipRegion });

  return (
    <canvas
      id={id || ""}
      ref={internalRef}
      width={width}
      height={height}
      style={style}
    />
  );

});
