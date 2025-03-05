
import { useRef } from "react";
import { ClippedVideo } from "../video/ClippedVideo";
import { FormattedCsv, LandmarkChunk, LandmarkType } from "../../exports/types";
import { CameraRegions } from "../../exports/consts";
import { useComparisonLandmarkRender } from "../mediapipe/useComparisonLandmarkRender";

interface Props {
  originVideoEle: HTMLVideoElement,
  landmarkChunkOriginal: LandmarkChunk,
  landmarkChunkTarget: LandmarkChunk|FormattedCsv,
  canvasWidth: number,
  canvasHeight: number,
  isDisplayPosture: boolean
  landmarkType: LandmarkType,
  comparisonRow: number,
}

export const ComparisonVideo = ({
  originVideoEle,
  landmarkChunkOriginal, landmarkChunkTarget,
  canvasWidth, canvasHeight, isDisplayPosture, landmarkType, comparisonRow
}: Props) => {
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement|null>(null);

  useComparisonLandmarkRender({
    originVideoEle, sourceCanvasRef, outputCanvasRef,
    landmarkChunkOriginal, landmarkChunkTarget, landmarkType, isDisplayPosture, comparisonRow
  });
  
  return (
    <div>
      {landmarkChunkTarget && landmarkChunkTarget?.length > 1 ? (
        <>
          <ClippedVideo
            ref={sourceCanvasRef}
            videoEle={originVideoEle}
            width={canvasWidth}
            height={canvasHeight}
            clipRegion={CameraRegions.Side}
            style={{display: "none"}}
          />
          <canvas
            className="output_canvas"
            ref={outputCanvasRef}
            width={canvasWidth}
            height={canvasHeight}
          />
        </>
      ) : (
        <ClippedVideo
          videoEle={originVideoEle}
          width={canvasWidth}
          height={canvasHeight}
          clipRegion={CameraRegions.Side}
        />
      )}
    </div>
  )
}