import { Group, Slider, Title, Text, Box } from "@mantine/core"
import { LandmarkVideo } from "../../utils/mediapipe/LandmarkVideo"
import { useState } from "react";
import { LandmarkChunk } from "../../exports/types";
import { CameraRegions } from "../../exports/consts";

export interface VideoPanelProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  poseLandmarks: LandmarkChunk,
  handLandmarksTopCamera: LandmarkChunk;
  handLandmarksFrontCamera: LandmarkChunk;
  isDisplayPosture: boolean;
  canvasWidth: number;
  canvasHeight: number;
}

export const ZoomPanel = ({
  videoRef, handLandmarksFrontCamera, handLandmarksTopCamera, isDisplayPosture,
  canvasWidth, canvasHeight
}: VideoPanelProps) => {
  const [zoomLevelFrontCam, setZoomLevelFrontCam] = useState<number>(1);
  const [zoomLevelTopCam, setZoomLevelTopCam] = useState<number>(1);

  return (
    <Group>
      <Box className="front-video-container">
        <Box pb={15}>
          <Title order={3} mb={2}>(2) 上カメラ</Title>
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
        </Box>
        <Box>
          <Text>(2)真上カメラ 拡大率</Text>
          {handLandmarksTopCamera && !isNaN(handLandmarksTopCamera[0][0])
            ? <Slider
                value={zoomLevelTopCam}
                onChange={setZoomLevelTopCam}
                min={1} max={3} step={0.1}
              />
            : <Slider
                value={zoomLevelTopCam}
                onChange={setZoomLevelTopCam}
                disabled
                min={1} max={3} step={0.1}
              />
          }
        </Box>
      </Box>
      <Box className="seeling-video-container">
        <Box pb={15}>
          <Title order={3} mb={2}>(3) 患者カメラ</Title>
          <LandmarkVideo
            videoRef={videoRef}
            landmarkChunk={handLandmarksFrontCamera}
            landmarkType="hand-front"
            width={canvasWidth}
            height={canvasHeight}
            clipRegion={CameraRegions.Front}
            isDisplayPosture={isDisplayPosture}
            zoomLevel={zoomLevelFrontCam}
          />
        </Box>
        <Box>
          <Text>(3)患者正面カメラ 拡大率</Text>
          {handLandmarksFrontCamera && !isNaN(handLandmarksFrontCamera[0][0])
            ? <Slider
                value={zoomLevelFrontCam}
                onChange={setZoomLevelFrontCam}
                min={1} max={3} step={0.1}
              />
            : <Slider
                value={zoomLevelFrontCam}
                onChange={setZoomLevelFrontCam}
                min={1} max={3} step={0.1}
                disabled
              />
          }
        </Box>
      </Box>
    </Group>
  )
}