import { useRef } from "react"
import { ClipRegion } from "../../exports/types"
import { CameraRegions, FRAMESIZE } from "../../exports/consts"
import { LandmarkVideo } from "../../utils/mediapipe/LandmarkVideo"
import { LandmarkVideoControls } from "../../utils/mediapipe/LandmarkVideoControls "
import { LandmarkChunk } from "../../exports/types"
import { useMediaQuery } from "@mantine/hooks"
import { HeatmapVideo } from "../../utils/graph/HeatmapVideo"
import { Title } from "@mantine/core"

interface Props {
  videoBlob: Blob;
  poseLandmarks: LandmarkChunk,
  handLandmarksTopCamera: LandmarkChunk,
  handLandmarksFrontCamera: LandmarkChunk,
  heatmapLandmarks: LandmarkChunk,
  heatmapCamera: ClipRegion,
  isDisplayPosture: boolean,
  zoomLevelTopCam: number,
  zoomLevelFrontCam: number
}

export const VideoPanel: React.FC<Props> = ({
  videoBlob,
  poseLandmarks, handLandmarksTopCamera, handLandmarksFrontCamera,
  heatmapLandmarks, heatmapCamera,
  isDisplayPosture, zoomLevelTopCam, zoomLevelFrontCam,
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const canvasWidth = isMobile ? window.innerWidth : FRAMESIZE.CANVAS.WIDTH;
  const canvasHeight = isMobile ? window.innerWidth * (FRAMESIZE.CANVAS.HEIGHT / FRAMESIZE.CANVAS.WIDTH) : FRAMESIZE.CANVAS.HEIGHT;

  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="contaienr px-5 py-2">
      <video
        id="input_stream" ref={videoRef}
        width={FRAMESIZE.CANVAS.WIDTH} height={FRAMESIZE.CANVAS.HEIGHT}
        autoPlay muted style={{ display: "none" }}
      />
      <div className="md:flex flex-wrap gap-4">
        <div className="side-video-container">
          <Title order={3} className="font-semibold mb-2">(1) 横カメラ</Title>
          <LandmarkVideo
            videoRef={videoRef}
            landmarkChunk={poseLandmarks}
            landmarkType="pose"
            width={canvasWidth} 
            height={canvasHeight}
            clipRegion={CameraRegions.Side}
            isDisplayPosture={isDisplayPosture}
            zoomLevel={1}
          />
        </div>
        <div className="front-video-container">
          <Title order={3} className="font-semibold mb-2">(2) 上カメラ</Title>
          <LandmarkVideo
            videoRef={videoRef}
            landmarkChunk={handLandmarksTopCamera}
            landmarkType="hand"
            width={canvasWidth}
            height={canvasHeight}
            clipRegion={CameraRegions.Top}
            isDisplayPosture={isDisplayPosture}
            zoomLevel={zoomLevelTopCam}
          />
        </div>
        <div className="seeling-video-container">
          <Title order={3} className="font-semibold mb-2">(3) 患者カメラ</Title>
          <LandmarkVideo
            videoRef={videoRef}
            landmarkChunk={handLandmarksFrontCamera}
            landmarkType="hand_patient_camera"
            width={canvasWidth} 
            height={canvasHeight}
            clipRegion={CameraRegions.Front}
            isDisplayPosture={isDisplayPosture}
            zoomLevel={zoomLevelFrontCam}
          />
        </div>
        <div className="heatmap-container">
          <Title order={3} className="font-semibold mb-2">(4) ヒートマップ</Title>
          <HeatmapVideo
            originVideoRef={videoRef}
            landmarks={heatmapLandmarks}
            clipRegion={heatmapCamera}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
          />
        </div>
      </div>
      <LandmarkVideoControls
        videoRef={videoRef}
        recordedVideoBlob={videoBlob!}
        isDisplayPosture={isDisplayPosture}
      />
    </div>
  )
}