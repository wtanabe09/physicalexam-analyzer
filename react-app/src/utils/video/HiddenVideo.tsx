import React from "react";

export const HiddenVideo = React.forwardRef<HTMLVideoElement, { width: number; height: number }>(
  ({ width, height }, ref) => (
    <video
      id="input_stream"
      ref={ref}
      width={width}
      height={height}
      autoPlay
      muted
      style={{ display: "none" }}
    />
  )
);