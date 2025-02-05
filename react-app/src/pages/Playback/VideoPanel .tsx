import { useRef } from "react"
import { ClipRegion } from "../../exports/types"
import { CameraRegions, FRAMESIZE } from "../../exports/consts"
import { LandmarkVideo } from "../../utils/mediapipe/LandmarkVideo"
import { LandmarkVideoControls } from "../../utils/mediapipe/LandmarkVideoControls "
import { LandmarkChunk } from "../../exports/types"
import { useMediaQuery } from "@mantine/hooks"
import { HeatmapVideo } from "../../utils/graph/HeatmapVideo"
import { Group, Stack, Title } from "@mantine/core"
import { useVideoSource } from "../../utils/video/useVideoSource"

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
  const isMobile = useMediaQuery('(max-width: 36em)');
  const canvasWidth = isMobile ? window.innerWidth - 25 : FRAMESIZE.CANVAS.WIDTH;
  const canvasHeight = isMobile ? window.innerWidth * (FRAMESIZE.CANVAS.HEIGHT / FRAMESIZE.CANVAS.WIDTH) - 10 : FRAMESIZE.CANVAS.HEIGHT;

  const videoRef = useRef<HTMLVideoElement>(null);
  const { videoCurrentTime, handleSeekChange } = useVideoSource(videoRef.current, videoBlob);

  return (
    <Stack p="sm">
      <video
        id="input_stream"
        ref={videoRef}
        width={FRAMESIZE.CANVAS.WIDTH} height={FRAMESIZE.CANVAS.HEIGHT}
        style={{ display: "none" }}
      />
      <Group pb="sm">
        <div className="side-video-container">
          <Title order={3} className="font-semibold" mb={2}>(1) 横カメラ</Title>
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
          <Title order={3} mb={2} className="font-semibold">(2) 上カメラ</Title>
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
          <Title order={3} mb={2} className="font-semibold">(3) 患者カメラ</Title>
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
          <Title order={3} mb={2} className="font-semibold">(4) ヒートマップ</Title>
          <HeatmapVideo
            originVideoRef={videoRef}
            landmarks={heatmapLandmarks}
            clipRegion={heatmapCamera}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
          />
        </div>
      </Group>
      <LandmarkVideoControls
        videoRef={videoRef}
        videoBlob={videoBlob}
        isDisplayPosture={isDisplayPosture}
        videoCurrentTime={videoCurrentTime}
        handleSeekChange={handleSeekChange}
      />
    </Stack>
  )
}