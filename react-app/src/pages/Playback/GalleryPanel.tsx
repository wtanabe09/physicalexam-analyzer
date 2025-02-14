import { CameraRegions } from "../../exports/consts"
import { LandmarkVideo } from "../../utils/mediapipe/LandmarkVideo"
import { LandmarkChunk } from "../../exports/types"
import { Box, Group } from "@mantine/core"

interface Props {
  videoEle: HTMLVideoElement;
  poseLandmarks: LandmarkChunk,
  handLandmarksTopCamera: LandmarkChunk,
  handLandmarksFrontCamera: LandmarkChunk,
  isDisplayPosture: boolean,
  canvasWidth: number,
  canvasHeight: number,
}

export const GalleryPanel: React.FC<Props> = ({
  videoEle,
  poseLandmarks, handLandmarksTopCamera, handLandmarksFrontCamera,
  isDisplayPosture, canvasWidth, canvasHeight
}) => {
  
  return (
    <Group pb="sm">
      <Box>
        {/* <Title order={3} mb={2}>(1) 横カメラ</Title> */}
        <LandmarkVideo
          videoEle={videoEle}
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
        <LandmarkVideo
          videoEle={videoEle}
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
        <LandmarkVideo
          videoEle={videoEle}
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