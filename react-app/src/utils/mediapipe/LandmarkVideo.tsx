import { useRef } from "react";
import { ClipRegion, LandmarkType, MyLandmarkType } from "../../exports/types";
import { ClippedVideo } from "../video/ClippedVideo";
import { useLandmarkRender } from "./useLandmarkRender";

interface Props {
  videoEle: HTMLVideoElement;
  landmarkChunk: [number, MyLandmarkType][];
  landmarkType: LandmarkType;
  isDisplayPosture: boolean;
  width: string | number;
  height: string | number;
  clipRegion: ClipRegion;
  zoomLevel: number;
}

export const LandmarkVideo: React.FC<Props> = ({ 
  videoEle, landmarkChunk, landmarkType,
  isDisplayPosture, width, height, clipRegion, zoomLevel
}: Props) => {
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);

  useLandmarkRender({
    videoEle, sourceCanvasRef, outputCanvasRef,
    landmarkChunk, landmarkType, isDisplayPosture, zoomLevel
  });

  return (
    <div>
      {landmarkChunk?.length > 1 ? (
        <>
          <ClippedVideo
            ref={sourceCanvasRef}
            videoEle={videoEle}
            width={width}
            height={height}
            clipRegion={clipRegion}
            style={{display: "none"}}
          />
          <canvas
            className="output_canvas"
            ref={outputCanvasRef}
            width={width}
            height={height}
          />
        </>
      ) : (
        <ClippedVideo
          videoEle={videoEle}
          width={width}
          height={height}
          clipRegion={clipRegion}
        />
      )}
    </div>
  );
};
