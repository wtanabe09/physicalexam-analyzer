import { Group, Title } from "@mantine/core"
import { CameraRegions } from "../../exports/consts";
import { HeatmapVideo } from "../../utils/graph/HeatmapVideo";
import { VideoPanelProps } from "./ZoomPanel";

export const HeatMapPanel = ({
  videoEle, handLandmarksFrontCamera, handLandmarksTopCamera, isDisplayPosture,
  canvasWidth, canvasHeight
}: VideoPanelProps) => {
  
  return (
    <div className="heatmap-container">
      <Title order={3} mb={2}>(4) ヒートマップ</Title>
      <Group>
        <HeatmapVideo
          originVideoEle={videoEle}
          landmarks={handLandmarksFrontCamera}
          clipRegion={CameraRegions.Front}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
        />
        <HeatmapVideo
          originVideoEle={videoEle}
          landmarks={handLandmarksTopCamera}
          clipRegion={CameraRegions.Top}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
        />
      </Group>
    </div>
  )
}