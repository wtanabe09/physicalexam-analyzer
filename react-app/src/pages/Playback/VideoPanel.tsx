import { CameraRegions } from "../../exports/consts"
import { LandmarkVideo } from "../../utils/mediapipe/LandmarkVideo"
import { LandmarkChunk } from "../../exports/types"
import { Box, Group } from "@mantine/core"

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>;
  poseLandmarks: LandmarkChunk,
  handLandmarksTopCamera: LandmarkChunk,
  handLandmarksFrontCamera: LandmarkChunk,
  isDisplayPosture: boolean,
  canvasWidth: number,
  canvasHeight: number,
}

export const VideoPanel: React.FC<Props> = ({
  videoRef,
  poseLandmarks, handLandmarksTopCamera, handLandmarksFrontCamera,
  isDisplayPosture, canvasWidth, canvasHeight
}) => {
  
  return (
    <Group pb="sm">
      <Box>
        {/* <Title order={3} mb={2}>(1) 横カメラ</Title> */}
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
      </Box>
      <Box>
        {/* <Title order={3} mb={2}>(2) 正面カメラ</Title> */}
        <LandmarkVideo
          videoRef={videoRef}
          landmarkChunk={handLandmarksFrontCamera}
          landmarkType="hand-front"
          width={canvasWidth} 
          height={canvasHeight}
          clipRegion={CameraRegions.Front}
          isDisplayPosture={isDisplayPosture}
          zoomLevel={1}
        />
      </Box>
      <Box>
      {/* <Title order={3} mb={2}>(3) 上カメラ</Title> */}
        <LandmarkVideo
          videoRef={videoRef}
          landmarkChunk={handLandmarksTopCamera}
          landmarkType="hand"
          width={canvasWidth} 
          height={canvasHeight}
          clipRegion={CameraRegions.Top}
          isDisplayPosture={isDisplayPosture}
          zoomLevel={1}
        />
      </Box>
    </Group>
  )
}