import React from "react";

export const HiddenCanvas = React.forwardRef<HTMLCanvasElement, { id: string; width: number; height: number }>(
  ({ id, width, height }, ref) => (
    <canvas
      id={id}
      ref={ref}
      width={width}
      height={height}
      style={{ display: "none" }}
    />
  )
);